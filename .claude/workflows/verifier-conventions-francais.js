export const meta = {
  name: 'verifier-conventions-francais',
  description: 'Vérifie la convention « tout le code en français » du CLAUDE.md : un gardien-francais par fichier, puis un gardien-francais adversarial par finding',
  whenToUse: "Quand on veut auditer le respect de la convention de nommage en français (src/, test/, index.html). Accepte via args une liste de chemins de fichiers à auditer ; utilise la liste par défaut sinon. Tous les agents utilisent le profil .claude/agents/gardien-francais.md, qui fait autorité sur la doctrine linguistique.",
  phases: [
    { title: 'Detection', detail: 'un gardien-francais par fichier, en mode détection' },
    { title: 'Refutation', detail: 'un gardien-francais par finding, en mode réfutation' },
  ],
}

// ---------------------------------------------------------------------------
// Fichiers audités : passés via `args` (tableau de chemins) ou liste par défaut
// ---------------------------------------------------------------------------
const FICHIERS = Array.isArray(args) && args.length
  ? args
  : ['src/conversion.js', 'src/main.js', 'test/conversion.test.js', 'index.html']

const PROFIL = 'gardien-francais'
const PLAFOND_VERIFICATIONS = 20

const SCHEMA_DETECTION = {
  type: 'object',
  properties: {
    fichier: { type: 'string' },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          identifiant: { type: 'string', description: "L'identifiant fautif, tel qu'écrit dans le code" },
          ligne: { type: 'integer', description: 'Numéro de ligne (1-indexé) de la déclaration' },
          categorie: {
            type: 'string',
            enum: ['variable', 'fonction', 'parametre', 'propriete', 'classe', 'nom-de-fichier', 'id-html', 'classe-css', 'commentaire', 'texte-ui', 'autre'],
          },
          extrait: { type: 'string', description: 'La ligne de code complète, verbatim' },
          raison: { type: 'string', description: "Pourquoi cet identifiant n'est pas en français" },
          suggestion: { type: 'string', description: 'Nom français proposé, sans accent ni cédille' },
        },
        required: ['identifiant', 'ligne', 'categorie', 'extrait', 'raison', 'suggestion'],
        additionalProperties: false,
      },
    },
  },
  required: ['fichier', 'findings'],
  additionalProperties: false,
}

const SCHEMA_VERDICT = {
  type: 'object',
  properties: {
    refute: { type: 'boolean', description: 'true si le finding est invalide / doit être rejeté' },
    motif_refutation: { type: 'string', description: "Si refute=true : pourquoi. Sinon : 'aucun'" },
    ligne_verifiee: { type: 'boolean', description: "true si l'extrait cité correspond bien au contenu réel du fichier à cette ligne" },
    confiance: { type: 'string', enum: ['haute', 'moyenne', 'basse'] },
    justification: { type: 'string' },
  },
  required: ['refute', 'motif_refutation', 'ligne_verifiee', 'confiance', 'justification'],
  additionalProperties: false,
}

// ---------------------------------------------------------------------------
// Prompts — la doctrine linguistique n'est PAS répétée ici : elle vit dans
// .claude/agents/gardien-francais.md, qui est la source de vérité unique.
// ---------------------------------------------------------------------------

function promptDetection(fichier) {
  return `MODE DÉTECTION.

Périmètre imposé : le seul fichier \`${fichier}\`, à lire intégralement avec Read
depuis la racine du projet (chemin relatif tel quel). N'audite aucun autre
fichier et n'utilise pas le repli git.

Applique ta doctrine linguistique pour relever TOUS les identifiants de
\`${fichier}\` qui violent la convention « tout le code en français » du
CLAUDE.md. Examine aussi le nom du fichier lui-même.

Contraintes de restitution :
- \`ligne\` : le numéro de ligne EXACT retourné par Read.
- \`extrait\` : la ligne COPIÉE VERBATIM, sans le préfixe de numérotation de Read.
- \`suggestion\` : un nom français sans accent ni cédille.
- \`fichier\` : exactement "${fichier}".
- Fichier conforme => tableau \`findings\` vide.`
}

function promptRefutation(fichier, f) {
  return `MODE RÉFUTATION.

Un autre gardien a relevé l'écart ci-dessous. Ta mission est de le RÉFUTER.
Applique la procédure de réfutation de ta doctrine, en relisant \`${fichier}\`.

ÉCART À CONTESTER
- fichier    : ${fichier}
- ligne      : ${f.ligne}
- identifiant: ${f.identifiant}
- catégorie  : ${f.categorie}
- extrait    : ${f.extrait}
- raison     : ${f.raison}
- suggestion : ${f.suggestion}

Renseigne \`ligne_verifiee\` selon que l'extrait cité correspond ou non au
contenu réel du fichier à la ligne ${f.ligne}. Si la ligne n'existe pas, ou si
l'extrait ne correspond pas, \`refute\` DOIT valoir true.

Vérifie enfin que la suggestion \`${f.suggestion}\` n'entre pas en collision avec
un identifiant déjà présent dans la même portée ; signale-le dans
\`justification\` le cas échéant, sans que cela invalide l'écart.`
}

// ---------------------------------------------------------------------------
// Étapes du pipeline
// ---------------------------------------------------------------------------

let totalDetectes = 0
let totalTronques = 0

function detecter(fichier) {
  return agent(promptDetection(fichier), {
    label: `detecte:${fichier}`,
    phase: 'Detection',
    agentType: PROFIL,
    schema: SCHEMA_DETECTION,
  })
}

function refuter(fichier, f) {
  return agent(promptRefutation(fichier, f), {
    label: `refute:${f.identifiant}`,
    phase: 'Refutation',
    agentType: PROFIL,
    schema: SCHEMA_VERDICT,
  }).then((verdict) => ({ ...f, fichier, verdict }))
}

function appliquerPlafond(fichier, findings) {
  if (findings.length <= PLAFOND_VERIFICATIONS) return findings
  const ignores = findings.length - PLAFOND_VERIFICATIONS
  totalTronques += ignores
  log(`⚠ ${fichier} : ${findings.length} écarts détectés, seuls les ${PLAFOND_VERIFICATIONS} premiers sont vérifiés (${ignores} ignorés)`)
  return findings.slice(0, PLAFOND_VERIFICATIONS)
}

function refuterTout(detection, fichier) {
  if (!detection || !detection.findings || detection.findings.length === 0) {
    log(`${fichier} : aucun écart détecté`)
    return []
  }
  const aVerifier = appliquerPlafond(fichier, detection.findings)
  totalDetectes += aVerifier.length
  log(`${fichier} : ${aVerifier.length} écart(s) présumé(s) → réfutation`)
  return parallel(aVerifier.map((f) => () => refuter(fichier, f)))
}

// ---------------------------------------------------------------------------
// Restitution
// ---------------------------------------------------------------------------

function formaterConfirme(f) {
  return {
    fichier: f.fichier,
    ligne: f.ligne,
    identifiant: f.identifiant,
    categorie: f.categorie,
    extrait: f.extrait,
    raison: f.raison,
    suggestion: f.suggestion,
    confiance: f.verdict.confiance,
    justification_verificateur: f.verdict.justification,
  }
}

function formaterRefute(f) {
  return {
    fichier: f.fichier,
    identifiant: f.identifiant,
    motif: f.verdict ? f.verdict.motif_refutation : 'verdict indisponible (agent en échec)',
  }
}

// ---------------------------------------------------------------------------

phase('Detection')
log(`Audit « tout en français » via le profil ${PROFIL} sur ${FICHIERS.length} fichier(s) : ${FICHIERS.join(', ')}`)

const resultats = await pipeline(FICHIERS, detecter, refuterTout)

const tous = resultats.filter(Boolean).flat().filter(Boolean)
const confirmes = tous.filter((f) => f.verdict && f.verdict.refute === false)
const rejetes = tous.filter((f) => !f.verdict || f.verdict.refute !== false)

log(`Terminé : ${confirmes.length} écart(s) confirmé(s) sur ${tous.length} vérifié(s) (${rejetes.length} réfuté(s))`)

return {
  profil_agent: PROFIL,
  fichiers_audites: FICHIERS,
  total_detectes: totalDetectes,
  total_non_verifies_plafond: totalTronques,
  total_refutes: rejetes.length,
  confirmes: confirmes.map(formaterConfirme),
  refutes: rejetes.map(formaterRefute),
}
