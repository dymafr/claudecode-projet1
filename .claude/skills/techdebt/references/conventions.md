# Conventions du convertisseur

## Structure

- `src/conversion.js` contient les fonctions de conversion et d'arrondi.
- `src/main.js` contient les interactions avec la page HTML.
- Les tests utilisent `node:test` et `node:assert/strict`.
- La commande de test est `npm test`.
- La commande de lancement est `npm run dev`.

## Invariants

- Les résultats sont arrondis à un chiffre après la virgule.
- Une saisie invalide ne doit jamais afficher `NaN`.
- Les fonctions de conversion doivent rester indépendantes du DOM.
- Une correction locale ne doit pas entraîner de refactorisation générale.

## Pièges connus

- `Number('')` retourne `0` : une saisie vide doit être détectée avant la conversion.
- Les tests unitaires des fonctions ne vérifient pas automatiquement le formulaire.
- L'absence de TypeScript ou de framework n'est pas une dette technique dans ce projet.
- Une préférence de style ne doit pas être présentée comme un problème bloquant.
