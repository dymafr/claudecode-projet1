import {
  convertirCelsiusEnFahrenheit,
  arrondirTemperature
} from './conversion.js';

const champTemperature = document.querySelector('#temperature');
const boutonConvertir = document.querySelector('#convertir');
const paragrapheResultat = document.querySelector('#resultat');

function afficherConversion() {
  const saisie = champTemperature.value.trim();
  const temperatureCelsius = Number(saisie);

  if (saisie === '' || Number.isNaN(temperatureCelsius)) {
    paragrapheResultat.textContent = 'Veuillez saisir une température valide.';
    return;
  }

  const temperatureFahrenheit = arrondirTemperature(
    convertirCelsiusEnFahrenheit(temperatureCelsius)
  );

  paragrapheResultat.textContent =
    `${temperatureCelsius} °C correspondent à ${temperatureFahrenheit} °F.`;
}

boutonConvertir.addEventListener('click', afficherConversion);
