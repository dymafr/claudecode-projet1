import {
  convertirCelsiusEnFahrenheit,
  convertirFahrenheitEnCelsius,
  arrondirTemperature
} from './conversion.js';

const champTemperature = document.querySelector('#temperature');
const boutonConvertir = document.querySelector('#convertir');
const paragrapheResultat = document.querySelector('#resultat');

const champTemperatureFahrenheit = document.querySelector('#temperature-fahrenheit');
const boutonConvertirFahrenheit = document.querySelector('#convertir-fahrenheit');
const paragrapheResultatFahrenheit = document.querySelector('#resultat-fahrenheit');

function afficherConversion() {
  const temperatureCelsius = Number(champTemperature.value);

  const temperatureFahrenheit = arrondirTemperature(
    convertirCelsiusEnFahrenheit(temperatureCelsius)
  );

  paragrapheResultat.textContent =
    `${temperatureCelsius} °C correspondent à ${temperatureFahrenheit} °F.`;
}

function afficherConversionFahrenheit() {
  const temperatureFahrenheit = Number(champTemperatureFahrenheit.value);

  const temperatureCelsius = arrondirTemperature(
    convertirFahrenheitEnCelsius(temperatureFahrenheit)
  );

  paragrapheResultatFahrenheit.textContent =
    `${temperatureFahrenheit} °F correspondent à ${temperatureCelsius} °C.`;
}

boutonConvertir.addEventListener('click', afficherConversion);
boutonConvertirFahrenheit.addEventListener('click', afficherConversionFahrenheit);
