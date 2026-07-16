export function convertirCelsiusEnFahrenheit(celsius) {
  return celsius * 9 / 5 + 32;
}

export function convertirFahrenheitEnCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

export function arrondirTemperature(valeur) {
  return Math.round(valeur * 10) / 10;
}

export function lireTemperature(texte) {
  if (typeof texte !== 'string' || texte.trim() === '') {
    return null;
  }

  const valeur = Number(texte);

  return Number.isFinite(valeur) ? valeur : null;
}
