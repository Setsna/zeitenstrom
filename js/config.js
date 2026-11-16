/* Zeitenstrom: alle Einstellungen an einer Stelle.
   Klassisches Skript, legt window.ZE.config an. */
(() => {
  'use strict';
  const ZE = window.ZE = window.ZE || {};

  ZE.config = {
    name: 'Zeitenstrom',
    unterzeile: 'Verben von heute nach gestern.',
    maskottchen: 'Nuri',

    /* Speicher im Browser (Baukasten js/konto-speicher.js):
       localStorage   zeitenstrom-v1.k<kennung>            Stand samt Vorname (für die Anzeige ohne Netz)
                      zeitenstrom-v1.k<kennung>.abgleich   zuletzt abgeglichener Stand
       sessionStorage zeitenstrom-v1-wer                   welches Kind in diesem Tab angemeldet ist
       Die Kennung wird aus dem Code errechnet, der Code selbst steht nicht im Namen. */
    speicher: { schluessel: 'zeitenstrom', schema: 1 },
    codeLaenge: 8,
    nameMaxLaenge: 20,

    /* Gemeinsames Konto: das Firebase-Projekt des Perlentauchers (dieselben Angaben wie bei der Chancenbucht).
       Diese Angaben sind keine Geheimnisse, sie stehen bei jeder Firebase-Seite im Quelltext.
       Geschützt werden die Daten durch die Regeln in der Firebase-Konsole (Block ze_stand). */
    firebase: {
      apiKey: 'AIzaSyBX3MUJq69uFyejbEiJimGeAtHMER3OCdE',
      authDomain: 'lernplattform-44aa1.firebaseapp.com',
      projectId: 'lernplattform-44aa1',
      storageBucket: 'lernplattform-44aa1.firebasestorage.app',
      messagingSenderId: '213839225177',
      appId: '1:213839225177:web:4cf676269e50c708466c48'
    },
    cloud: {
      kinder: 'kinder',        /* kinder/<code>: Vorname, von der Lehrkraft angelegt (nur lesen) */
      stand: 'ze_stand',       /* ze_stand/<code>: der Stand dieses Kindes im Zeitenstrom */
      schreibPauseMs: 2500     /* so lange nach der letzten Änderung warten, dann gebündelt schreiben */
    },

    /* Stationen und Stufen. Die Ids sind Teil der Firebase-Regeln (feste Schlüssel 'station:stufe', 7 x 3 = 21).
       futur ist der Zusatz für Klasse 4 (Ingo, 16.11.2026: schon bauen). zusatz: true heißt: zählt nicht für die Urkunde.
       Eine neue Station oder Stufe braucht eine Regeländerung (Regel-Block ze_stand und tools/test/ze-gueltig.js). */
    stationen: [
      { id: 'erkennen', name: 'Zeitform erkennen', kurz: 'Jetzt oder früher?', live: true },
      { id: 'praeteritum', name: 'Präteritum bilden', kurz: 'ich male, ich malte', live: true },
      { id: 'perfekt', name: 'Perfekt bilden', kurz: 'habe gemalt, bin gelaufen', live: true },
      { id: 'umschreiben', name: 'Geschichte um­schreiben', kurz: 'Satz für Satz nach gestern', live: true },
      { id: 'zeitfehler', name: 'Zeitfehler finden', kurz: 'Welches Verb passt nicht?', live: true },
      { id: 'stimmt', name: 'Kann das stimmen?', kurz: 'Nuri prüfen', live: true },
      { id: 'futur', name: 'Futur (Klasse 4)', kurz: 'ich werde malen', live: true, zusatz: true }
    ],
    stufen: ['leicht', 'mittel', 'knifflig'],

    /* Runden: 6 Aufgaben, Stempel ab 5 geschafften (wie Chancenbucht). Geschafft = richtig im 1. oder 2. Versuch. */
    runde: { aufgaben: 6, stempelAb: 5 },

    /* Obergrenze für runden je Schlüssel (wie im Regel-Block) */
    rundenMax: 100000,

    /* Versionsnummer der Bilder, getrennt von ?v=N für js und css */
    bildStand: 4
  };
})();
