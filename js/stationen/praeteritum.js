/* Zeitenstrom: Station „Präteritum bilden“ (Hauptstation). Ablauf in js/station-lauf.js.
   leicht: regelmäßige Verben, der Wortstamm steht da, die Endung kommt aus den Kacheln (mal + te).
   mittel: Verben mit Stammänderung, die ganze Form aus echten Formen des Verbs wählen (ging, gehe, gegangen …).
   knifflig: Tabelle mit sechs Personen ergänzen, gemischt. Danach zeigt „Alle Formen“ die ganze Tabelle. */
(() => {
  'use strict';
  window.ZE.station.eintragen({
    id: 'praeteritum', praefix: 'pt',
    titel: 'Präteritum bilden', unterzeile: 'ich male, ich malte',
    nuriSatz: 'Wenn etwas vorbei ist, verändert sich das Verb. Bei manchen Verben nur am Ende, bei anderen auch in der Mitte.',
    soGehts: ['Lies den Satz für jetzt.', 'Such die Kachel, die zu früher passt.', 'Lege sie in die Lücke und tippe auf Prüfen.'],
    stufen: { leicht: 'mal-te: die Endung wählen', mittel: 'ging, fand: der Stamm ändert sich', knifflig: 'die Tabelle ergänzen' },
    amTisch: { titel: 'Erzählkette', schritte: [
      'Einer beginnt: „Gestern ging ich …“ und sagt, wohin.',
      'Der Nächste wiederholt den Satz und hängt einen an: „… dann aß ich …“',
      'Wer ein Verb in der Form für jetzt sagt, darf es noch einmal versuchen.',
      'Schreibt am Ende drei Verben aus eurer Kette in eine Tabelle: jetzt und früher.'], notiz: 'Material: zuerst nur eure Stimmen, dann Heft und Stift.' },
    stempelMotiv: '<path class="stempel__welle" d="M30 64c0-18 10-28 22-28s18 8 18 16-6 12-12 12-8-4-8-8 2-6 6-6"/><circle class="stempel__kugel" cx="30" cy="64" r="2.5"/>'
  });
})();
