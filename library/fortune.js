'use strict';
//tablica ciasteczek szcześcia
const fortuneCookies = [
  'Pkonaj swoje lęki albo one pokonają ciebie',
  'Rzeki potrzebują źródeł.',
  'Nie obawiaj się nienznaego',
  'Oczekuj przyjemnej niespodzianki',
  'Zawsze szukaj prostego rozwiązania.',
];

exports.getFortune = () => {
  const idx = Math.floor(Math.random() * fortuneCookies.length);
  return fortuneCookies[idx];
};
