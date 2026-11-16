/* Zeitenstrom: Station „Kann das stimmen?“. Ablauf in js/station-lauf.js.
   Nuri behauptet etwas, das Kind prüft es und wählt eine Begründung.
   leicht: „Das ist Präsens/Präteritum/Perfekt“ zu einem Satz (Wahrheit aus den Satzdaten berechnet).
   mittel: Behauptungen zu Formen und zu haben/sein (aus der Verbtabelle berechnet, nie mit einer Fehlform).
   knifflig: von Hand geschriebene Behauptungen zu den Regeln (js/saetze.js, BEHAUPTUNGEN). */
(() => {
  'use strict';
  window.ZE.station.eintragen({
    id: 'stimmt', praefix: 'ks',
    titel: 'Kann das stimmen?', unterzeile: 'Nuri prüfen',
    nuriSatz: 'Ich sage manchmal Dinge über Verben. Manche stimmen, manche nicht. Prüf mich!',
    soGehts: ['Lies, was Nuri sagt.', 'Entscheide: Stimmt das?', 'Tippe dann den Satz an, der es erklärt.'],
    stufen: { leicht: 'Welche Zeitform ist es?', mittel: 'Stimmt die Form?', knifflig: 'Stimmt die Regel?' },
    amTisch: { titel: 'Stimmt das?', schritte: [
      'Jeder schreibt drei Sätze über Verben auf, zwei richtige und einen falschen.',
      'Lest sie euch vor. Der andere sagt: Das stimmt oder Das stimmt nicht.',
      'Begründet mit einem Beispiel: „Nein, es heißt ich ging.“'], notiz: 'Material: Zettel und Stift.' },
    stempelMotiv: '<path class="stempel__welle" d="M38 36a8 8 0 1 1 12 7c-3 2-5 4-5 7"/><circle class="stempel__kugel" cx="45" cy="60" r="2.5"/>'
  });
})();
