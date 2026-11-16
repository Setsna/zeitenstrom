/* Zeitenstrom: Station „Futur“ (Zusatz Klasse 4, Ingo 16.11.2026: schon bauen). Ablauf in js/station-lauf.js.
   leicht: werden und Grundform in zwei Lücken (ich werde malen). mittel: Zeitform erkennen mit allen vier Zeitformen.
   knifflig: den ganzen Satz im Futur aus Wortkacheln bauen, die Grundform kommt ans Satzende.
   Zählt nicht für die Urkunde (config.js: zusatz: true). Futur-Sätze und -Texte von Ingo freigegeben (16.11.2026). */
(() => {
  'use strict';
  window.ZE.station.eintragen({
    id: 'futur', praefix: 'fu',
    titel: 'Futur', unterzeile: 'Zusatz für Klasse 4: ich werde malen',
    nuriSatz: 'Manches ist noch gar nicht passiert. Dann hilft das Wort werden: Ich werde morgen malen.',
    soGehts: ['Lies den Satz für jetzt.', 'Setze werden und die Grundform ein.', 'Die Grundform steht am Satzende, so wie im Wörterbuch.'],
    stufen: { leicht: 'werden und Grundform', mittel: 'alle vier Zeitformen erkennen', knifflig: 'den ganzen Satz bauen' },
    amTisch: { titel: 'Pläne für morgen', schritte: [
      'Jeder sagt drei Sätze, was er morgen machen wird: „Ich werde … spielen.“',
      'Der Partner zählt: Hat jeder Satz werden und am Ende die Grundform?',
      'Schreibt zwei Sätze ins Heft und unterstreicht beide Teile des Verbs.'], notiz: 'Material: Heft und Stift.' },
    stempelMotiv: '<path class="stempel__welle" d="M24 54h46"/><path class="stempel__welle" d="M66 48l8 6-8 6"/><circle class="stempel__welle" cx="52" cy="40" r="5"/><circle class="stempel__welle" cx="64" cy="40" r="5"/>'
  });
})();
