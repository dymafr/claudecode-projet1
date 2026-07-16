import {
  convertirCelsiusEnFahrenheit,
  convertirFahrenheitEnCelsius,
  arrondirTemperature,
  lireTemperature
} from './conversion.js';

const MESSAGE_ERREUR = 'Veuillez saisir une température valide.';

const champTemperature = document.querySelector('#temperature');
const boutonConvertir = document.querySelector('#convertir');
const paragrapheResultat = document.querySelector('#resultat');

const champTemperatureFahrenheit = document.querySelector('#temperature-fahrenheit');
const boutonConvertirFahrenheit = document.querySelector('#convertir-fahrenheit');
const paragrapheResultatFahrenheit = document.querySelector('#resultat-fahrenheit');

function afficherConversion() {
  const temperatureCelsius = lireTemperature(champTemperature.value);

  if (temperatureCelsius === null) {
    paragrapheResultat.textContent = MESSAGE_ERREUR;
    return;
  }

  const temperatureFahrenheit = arrondirTemperature(
    convertirCelsiusEnFahrenheit(temperatureCelsius)
  );

  paragrapheResultat.textContent =
    `${temperatureCelsius} °C correspondent à ${temperatureFahrenheit} °F.`;
}

function afficherConversionFahrenheit() {
  const temperatureFahrenheit = lireTemperature(champTemperatureFahrenheit.value);

  if (temperatureFahrenheit === null) {
    paragrapheResultatFahrenheit.textContent = MESSAGE_ERREUR;
    return;
  }

  const temperatureCelsius = arrondirTemperature(
    convertirFahrenheitEnCelsius(temperatureFahrenheit)
  );

  paragrapheResultatFahrenheit.textContent =
    `${temperatureFahrenheit} °F correspondent à ${temperatureCelsius} °C.`;
}

boutonConvertir.addEventListener('click', afficherConversion);
boutonConvertirFahrenheit.addEventListener('click', afficherConversionFahrenheit);
