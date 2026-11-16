/* Zeitenstrom: Skriptfehler sammeln, damit der Rauchtest sie sieht. Wird vor allen anderen Skripten geladen. */
'use strict';
window.FEHLER = [];
window.addEventListener('error', e => window.FEHLER.push(String(e.message || e)));
window.addEventListener('unhandledrejection', e => window.FEHLER.push(String(e.reason)));
