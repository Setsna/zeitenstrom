/* Zeitenstrom: Station „Zeitform erkennen“. Trägt sich über ZE.station.eintragen ein (Ablauf in js/station-lauf.js).
   leicht: Sätze mit Hinweiswort (gestern, gerade), Auswahl mit Alltagswörtern (jetzt, früher, früher mit haben oder sein).
   mittel: ohne Hinweiswort, Alltagswort und Fachwort. knifflig: nur Fachwort, beim Perfekt beide Teile finden.
   Erst probieren, dann das Fachwort: Das Fachwort steht nach der Antwort da. */
(() => {
  'use strict';
  window.ZE.station.eintragen({
    id: 'erkennen', praefix: 'er',
    titel: 'Zeitform erkennen', unterzeile: 'Jetzt oder früher?',
    nuriSatz: 'Jedes Verb verrät dir, wann etwas passiert. Schau genau hin: jetzt oder früher?',
    soGehts: ['Lies den Satz.', 'Tippe das Verb an. Es sagt, was jemand tut.', 'Wähle: jetzt, früher oder früher mit haben oder sein.'],
    stufen: { leicht: 'mit Hinweiswort wie „gestern“', mittel: 'ohne Hinweiswort', knifflig: 'mit Fachwörtern' },
    amTisch: { titel: 'Verb-Kärtchen', schritte: [
      'Schreibt fünf Verben auf Kärtchen, jedes dreimal: ich male, ich malte, ich habe gemalt.',
      'Legt drei Felder auf den Tisch: jetzt, früher, früher mit haben oder sein.',
      'Mischt die Kärtchen. Abwechselnd legt jeder ein Kärtchen auf ein Feld und sagt einen Satz dazu.',
      'Prüft gemeinsam: Passt das Kärtchen zum Feld?'], notiz: 'Material: Kärtchen, Stift.' },
    stempelMotiv: '<path class="stempel__welle" d="M24 54h46"/><path class="stempel__welle" d="M66 48l8 6-8 6"/><circle class="stempel__kugel" cx="34" cy="54" r="5"/><circle class="stempel__kugel" cx="58" cy="40" r="4"/>'
  });
})();
