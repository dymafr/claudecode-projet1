import { spawnSync } from "node:child_process";

const commandeNpm = process.platform === "win32" ? "npm.cmd" : "npm";

function executer(titre, commande, argumentsCommande) {
  console.log(`\n## ${titre}`);

  const resultat = spawnSync(commande, argumentsCommande, {
    encoding: "utf8",
    shell: false,
  });

  if (resultat.error) {
    console.error(
      `Impossible d'exécuter la commande : ${resultat.error.message}`,
    );
    return;
  }

  if (resultat.stdout.trim()) {
    console.log(resultat.stdout.trim());
  }

  if (resultat.stderr.trim()) {
    console.error(resultat.stderr.trim());
  }

  console.log(`Code de sortie : ${resultat.status ?? 1}`);
}

executer("État Git", "git", ["status", "--short"]);
executer("Résumé du diff", "git", ["diff", "--stat"]);
executer("Fichiers modifiés", "git", ["diff", "--name-only"]);
executer("Tests automatisés", commandeNpm, ["test"]);
