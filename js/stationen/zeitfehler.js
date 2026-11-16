/* Zeitenstrom: Station „Zeitfehler finden“. Ablauf in js/station-lauf.js.
   Eine Geschichte im Präteritum, in der ein Satz (knifflig: zwei Sätze) im Präsens steht. Der erste Satz stimmt immer.
   Das Kind tippt das Verb an, das nicht passt, und verbessert es mit Kacheln (echte Formen, keine Fehlformen).
   leicht: vier Sätze, mittel: sechs Sätze, knifflig: sechs Sätze mit zwei Zeitfehlern. */
(() => {
  'use strict';
  window.ZE.station.eintragen({
    id: 'zeitfehler', praefix: 'zf',
    titel: 'Zeitfehler finden', unterzeile: 'Welches Verb passt nicht?',
    nuriSatz: 'In meiner Geschichte ist etwas durcheinander. Ein Verb erzählt von jetzt, obwohl alles vorbei ist.',
    soGehts: ['Lies die ganze Geschichte.', 'Tippe das Verb an, das von jetzt erzählt.', 'Verbessere es mit einer Kachel.'],
    stufen: { leicht: 'kurze Geschichte', mittel: 'lange Geschichte', knifflig: 'zwei Zeitfehler' },
    amTisch: { titel: 'Fehlerdetektive', schritte: [
      'Schreibt zu zweit eine kurze Geschichte von gestern, vier Sätze.',
      'Baut heimlich einen Zeitfehler ein: ein Verb für jetzt.',
      'Tauscht die Hefte. Wer findet den Fehler und verbessert ihn?'], notiz: 'Material: Heft und Stift.' },
    stempelMotiv: '<circle class="stempel__welle" cx="45" cy="45" r="13"/><path class="stempel__welle" d="M54 54 L66 66"/><path class="stempel__welle" d="M39 45l4 4 8-8"/>'
  });
})();
