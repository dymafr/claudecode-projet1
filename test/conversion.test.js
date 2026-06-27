import test from 'node:test';
import assert from 'node:assert/strict';

import {
  convertirCelsiusEnFahrenheit,
  convertirFahrenheitEnCelsius,
  arrondirTemperature
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
