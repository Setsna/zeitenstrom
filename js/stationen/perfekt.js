/* Zeitenstrom: Station „Perfekt bilden“. Ablauf in js/station-lauf.js.
   Zwei Lücken: erst haben oder sein, dann der zweite Teil (gemalt, gegangen). Alle Kacheln sind echte Formen.
   leicht: regelmäßige Verben mit haben. mittel: Verben mit Stammänderung, mit haben oder sein (mindestens zwei mit sein).
   knifflig: gemischt, mit einer weiteren Form von haben oder sein. */
(() => {
  'use strict';
  window.ZE.station.eintragen({
    id: 'perfekt', praefix: 'pf',
    titel: 'Perfekt bilden', unterzeile: 'habe gemalt, bin gelaufen',
    nuriSatz: 'Beim Erzählen bekommt das Verb oft einen Helfer: haben oder sein. Zusammen erzählen sie von früher.',
    soGehts: ['Lies den Satz für jetzt.', 'Setze zuerst haben oder sein ein.', 'Setze dann den zweiten Teil ans Ende und tippe auf Prüfen.'],
    stufen: { leicht: 'mit haben', mittel: 'mit haben oder sein', knifflig: 'gemischt' },
    amTisch: { titel: 'Wochenende erzählen', schritte: [
      'Erzählt euch zu zweit, was ihr am Wochenende gemacht habt: „Ich bin … Ich habe …“',
      'Der Zuhörer zählt mit: Wie oft kam „habe“, wie oft „bin“?',
      'Schreibt danach zwei Sätze ins Heft, einmal mit „habe“, einmal mit „bin“.'], notiz: 'Material: Heft und Stift.' },
    stempelMotiv: '<rect class="stempel__welle" x="26" y="40" width="20" height="18" rx="3"/><rect class="stempel__welle" x="52" y="40" width="22" height="18" rx="3"/><path class="stempel__welle" d="M46 49h6"/>'
  });
})();
