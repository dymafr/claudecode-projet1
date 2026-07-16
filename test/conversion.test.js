import test from 'node:test';
import assert from 'node:assert/strict';

import {
  convertirCelsiusEnFahrenheit,
  convertirFahrenheitEnCelsius,
  arrondirTemperature,
  lireTemperature
} from '../src/conversion.js';

test('convertit les degrés Celsius en degrés Fahrenheit', () => {
  assert.equal(convertirCelsiusEnFahrenheit(0), 32);
  assert.equal(convertirCelsiusEnFahrenheit(100), 212);
});

test('convertit les degrés Fahrenheit en degrés Celsius', () => {
  assert.equal(convertirFahrenheitEnCelsius(32), 0);
  assert.equal(convertirFahrenheitEnCelsius(212), 100);
  assert.equal(convertirFahrenheitEnCelsius(68), 20);
  assert.equal(convertirFahrenheitEnCelsius(-40), -40);
});

test('convertit et arrondit une température Fahrenheit comme dans l\'interface', () => {
  assert.equal(arrondirTemperature(convertirFahrenheitEnCelsius(100)), 37.8);
  assert.equal(arrondirTemperature(convertirFahrenheitEnCelsius(0)), -17.8);
});

test('arrondit une température à un chiffre après la virgule', () => {
  assert.equal(arrondirTemperature(12.34), 12.3);
  assert.equal(arrondirTemperature(12.36), 12.4);
});

test('lit une température valide depuis une saisie texte', () => {
  assert.equal(lireTemperature('20'), 20);
  assert.equal(lireTemperature('0'), 0);
  assert.equal(lireTemperature('-12.5'), -12.5);
  assert.equal(lireTemperature('  20  '), 20);
});

test('rejette une saisie vide sans la convertir en 0', () => {
  assert.equal(lireTemperature(''), null);
  assert.equal(lireTemperature('   '), null);
});

test('rejette une saisie non numérique sans produire NaN', () => {
  assert.equal(lireTemperature('abc'), null);
  assert.equal(lireTemperature('20abc'), null);
  assert.equal(lireTemperature('Infinity'), null);
});
