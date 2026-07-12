## Projet

Convertisseur de température en JavaScript vanilla (ESM, `"type": "module"`).

## Stack

Aucune dépendance, aucun framework.

## Commandes

```bash
npm test                              # lance tous les tests (node --test)
node --test test/conversion.test.js   # lance un seul fichier de test
npm run dev                           # serveur de dev sur http://localhost:5173
```

aucune étape de build : le navigateur charge directement les modules `src/*.js`.

## Architecture

Le code de l'application se trouve dans `src/`.

## environnement de tests

Les tests utilisent le runner intégré de Node (`node:test` + `node:assert/strict`), pas de framework externe.

## Convention

Tout le code est en français : noms de fonctions, de variables et de fichiers (`convertirCelsiusEnFahrenheit`, `arrondirTemperature`, `champTemperature`…). Conserver cette convention pour tout nouveau code.

<!-- @docs/general.md -->

Si tu ecris de la documentation charge `docs/general.md`
