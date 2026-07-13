---
name: techdebt
description: Analyse la maintenabilité du code ou du diff courant pour détecter la dette technique, les duplications, la complexité accidentelle et les tests manquants. Utilise cette skill lorsqu'on demande un audit de dette technique ou de maintenabilité. Ne l'utilise pas pour corriger le code, lancer l'application ou effectuer une revue de correction.
argument-hint: [périmètre optionnel]
allowed-tools:
  - Read
  - Grep
  - Glob
  - 'Bash(node "${CLAUDE_SKILL_DIR}/scripts/inspecter-projet.mjs")'
disallowed-tools:
  - Edit
  - Write
  - NotebookEdit
disable-model-invocation: true
user-invocable: false
---

# Audit de dette technique

## Périmètre demandé

$ARGUMENTS

Si aucun périmètre n'est fourni, analyse le diff Git courant.
Si le diff est vide, analyse les fichiers principaux du convertisseur.

## Contexte déterministe

!`node "${CLAUDE_SKILL_DIR}/scripts/inspecter-projet.mjs"`

## Référence projet

Lis `references/conventions.md` avant de produire le rapport.
Utilise uniquement les conventions pertinentes pour le périmètre analysé.

## Procédure

1. Détermine le périmètre exact de l'audit.
2. Examine les preuves collectées par le script.
3. Lis uniquement les fichiers nécessaires.
4. Recherche :
   - les duplications ;
   - la complexité accidentelle ;
   - les responsabilités mal séparées ;
   - les noms imprécis ou trompeurs ;
   - les cas limites ignorés ;
   - les tests manquants ou fragiles ;
   - le code mort ;
   - les incohérences avec les conventions du projet.
5. Ne signale que les problèmes démontrés.
6. Ne modifie aucun fichier.
7. Ne crée aucun commit.
8. N'installe aucune dépendance.
9. Ne propose pas de refactorisation sans expliquer son bénéfice concret.

## Format du rapport

Présente :

1. le périmètre analysé ;
2. les preuves collectées ;
3. les problèmes importants ;
4. la dette non bloquante ;
5. les tests ou validations manquants ;
6. les recommandations prioritaires ;
7. la prochaine action minimale.

Pour chaque problème, indique :

- le fichier concerné ;
- la preuve observée ;
- l'impact concret ;
- la correction minimale envisageable.

Si aucune dette significative n'est trouvée, indique-le clairement.
