/* Zeitenstrom: Station „Geschichte umschreiben“. Ablauf in js/station-lauf.js.
   Eine Geschichte mit sechs Sätzen, Satz für Satz: oben der Satz für jetzt, unten baut das Kind den ganzen Satz für früher
   aus Wortkacheln, die es per Touch verschiebt (Ingo, 16.11.2026), dazu echte Formen, die nicht passen.
   leicht: „Am Meer“ (regelmäßige Verben) ins Präteritum. mittel: „Im Zoo“ oder „Ein Regentag“ ins Präteritum.
   knifflig: eine der Geschichten ins Perfekt (zwei Lücken). Jeder Satz ist von Hand in allen Zeitformen geschrieben. */
(() => {
  'use strict';
  window.ZE.station.eintragen({
    id: 'umschreiben', praefix: 'us',
    titel: 'Geschichte umschreiben', unterzeile: 'Satz für Satz nach gestern',
    nuriSatz: 'Diese Geschichte passiert gerade. Erzähl sie so, als wäre sie gestern passiert.',
    soGehts: ['Lies den Satz für jetzt.', 'Zieh die Kacheln in die Lücken, bis der Satz von früher erzählt. Du kannst sie auch antippen.', 'Satz für Satz wird die ganze Geschichte fertig.'],
    stufen: { leicht: 'Am Meer, ins Präteritum', mittel: 'mit Stammänderung', knifflig: 'ins Perfekt' },
    amTisch: { titel: 'Bildergeschichte', schritte: [
      'Malt eine Bildergeschichte mit vier Bildern.',
      'Erzählt sie zuerst so, als passiere sie gerade: „Der Hund rennt …“',
      'Schreibt sie dann ins Heft, als wäre sie gestern passiert.',
      'Unterstreicht alle Verben. Erzählen alle von früher?'], notiz: 'Material: Papier, Buntstifte, Heft.' },
    stempelMotiv: '<path class="stempel__welle" d="M28 34h40M28 44h40M28 54h28M28 64h34"/>'
  });
})();
