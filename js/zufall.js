/* Zeitenstrom: Zufall für die Auswahl und Reihenfolge der Aufgaben (Technik aus der Chancenbucht).
   Klassisches Skript, legt window.ZE.zufall an.
   - Quelle crypto.getRandomValues, ganze Zahlen ohne Schieflage (Verwerfen statt Rest).
   - Fester Startwert (mulberry32) nur für Tests und auf localhost über ?startwert=N. Auf der echten Seite gibt es keinen Weg dorthin.
   Hier entscheidet der Zufall nur, WELCHE Aufgabe kommt und in welcher Reihenfolge die Kacheln liegen.
   Ob eine Antwort richtig ist, kommt immer aus den Daten (js/verben.js, js/saetze.js). */
(() => {
  'use strict';
  const ZE = window.ZE = window.ZE || {};
  const ZWEI32 = 4294967296;

  function cryptoQuelle() {
    const puffer = new Uint32Array(256);
    let i = puffer.length;
    return () => {
      if (i >= puffer.length) { crypto.getRandomValues(puffer); i = 0; }
      return puffer[i++];
    };
  }
  function startwertQuelle(startwert) {
    let a = (Number(startwert) >>> 0) || 1;
    return () => {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0);
    };
  }
  function notQuelle() { return () => Math.floor(Math.random() * ZWEI32) >>> 0; }

  function baue(quelle, name) {
    function zahl(n) {
      if (!Number.isInteger(n) || n < 1 || n > ZWEI32) throw new Error('zahl(n): n muss eine ganze Zahl von 1 bis 2^32 sein');
      const grenze = ZWEI32 - (ZWEI32 % n);
      let x;
      do { x = quelle(); } while (x >= grenze);
      return x % n;
    }
    /* Neue, gemischte Liste (Fisher-Yates), die alte bleibt unverändert */
    function mische(liste) {
      const a = liste.slice();
      for (let i = a.length - 1; i > 0; i--) { const j = zahl(i + 1); [a[i], a[j]] = [a[j], a[i]]; }
      return a;
    }
    const eins = liste => liste[zahl(liste.length)];
    /* n verschiedene Einträge; reicht die Liste nicht, wird nach dem Mischen von vorn wiederholt */
    function einige(liste, n) {
      const aus = [];
      while (aus.length < n) aus.push(...mische(liste));
      return aus.slice(0, n);
    }
    return { quelle: name, zahl, mische, eins, einige };
  }

  const hatCrypto = typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function';
  let standard = hatCrypto ? baue(cryptoQuelle(), 'crypto') : baue(notQuelle(), 'Math.random');

  const LOKAL = typeof location !== 'undefined' && ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
  const sw = LOKAL ? new URLSearchParams(location.search).get('startwert') : null;
  if (sw !== null && /^\d{1,9}$/.test(sw)) standard = baue(startwertQuelle(Number(sw)), 'startwert');

  ZE.zufall = Object.assign({}, standard, {
    mitStartwert: n => baue(startwertQuelle(n), 'startwert')
  });
})();
