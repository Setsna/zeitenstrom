/* Zeitenstrom: der Stand des Kindes, Speicher und Cloud.
   - Anmeldung mit dem Zugangscode des Perlentauchers (js/konto-cloud.js aus dem Baukasten).
   - Der Stand liegt im Browser (js/konto-speicher.js) und wird mit ze_stand/<code> in Firebase abgeglichen.
   - Gespeichert werden nur Stempel und geschaffte Runden je Station und Stufe. Vermutungen, Zugergebnisse
     und Strichlisten gelten nur für die laufende Aufgabe und werden nie gespeichert. Kein Freitext, kein Name im Stand.
   - ?vorschau=N zeigt einen Beispielstand mit N Stempeln und speichert nichts. Nur auf dem eigenen Rechner
     (localhost), auf der echten Seite wäre das eine Tür ohne Code.
   - Kein Export als Datei, kein Löschknopf für Kinder. Zurücksetzen macht die Lehrkraft im Perlentaucher.

   Der Stand in ze_stand/<code>:
     stempel    { 'station:stufe': Zeitpunkt }   Stempel für eine gemeisterte Stufe, der erste bleibt
     runden     { 'station:stufe': Anzahl }      geschaffte Aufgaben je Stufe, ganze Zahl
     angelegt, geaendert                         Zeitpunkte in ms (setzt konto-speicher.js)
   Erlaubt sind nur die festen Schlüssel aus config.js (7 Stationen x 3 Stufen, futur schon im Schema). Dieselben Regeln gelten im
   Regel-Block ze_stand der Firebase-Konsole und in tools/test/ze-gueltig.js. Alle drei immer zusammen ändern. */
(() => {
  'use strict';
  const ZE = window.ZE;
  const C = ZE.config;
  const LK = window.LagunenKonto;
  const A = LK.abgleich;

  const SCHLUESSEL = C.stationen.flatMap(s => C.stufen.map(st => `${s.id}:${st}`));
  const ganz = x => { const n = A.zahl(x); return n ? Math.min(Math.floor(n), C.rundenMax) : 0; };

  /* Nur bekannte Schlüssel, nur ganze positive Zahlen. Alles andere fällt weg. */
  function sauber(roh) {
    const r = A.karte(roh), sp = A.karte(r.stempel), ru = A.karte(r.runden);
    const stempel = {}, runden = {};
    for (const k of SCHLUESSEL) {
      const t = A.zahl(sp[k]);
      if (t) stempel[k] = Math.round(t);
      const n = ganz(ru[k]);
      if (n) runden[k] = n;
    }
    return { stempel, runden };
  }

  /* Zwei Stände zusammenführen (Bausteine aus js/konto-abgleich.js) */
  function mische(basis, lokal, fern) {
    const b = sauber(basis), l = sauber(lokal), f = sauber(fern);
    const runden = {};
    for (const k of SCHLUESSEL) {
      const n = Math.min(A.zuwachs(b.runden[k], l.runden[k], f.runden[k]), C.rundenMax);
      if (n) runden[k] = n;
    }
    const aus = {
      stempel: A.vereinigeFrueh(l.stempel, f.stempel),
      runden,
      geaendert: A.spaeter(A.karte(lokal).geaendert, A.karte(fern).geaendert)
    };
    const angelegt = A.frueher(A.karte(lokal).angelegt, A.karte(fern).angelegt);
    if (angelegt) aus.angelegt = angelegt;
    return aus;
  }

  /* Nach dem Zurücksetzen durch die Lehrkraft: leer anfangen */
  const neuanfang = (lokal, jetzt) => ({ stempel: {}, runden: {}, angelegt: jetzt, geaendert: jetzt });

  /* ---------- Vorschau (nur localhost) ---------- */
  const LOKAL = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
  const vorschauWert = new URLSearchParams(location.search).get('vorschau');
  const vorschauAn = LOKAL && vorschauWert !== null && /^\d{1,2}$/.test(vorschauWert);
  function vorschauStand() {
    if (!vorschauAn) return null;
    const n = Math.min(Number(vorschauWert), SCHLUESSEL.length);
    const k = { stempel: {}, runden: {} };
    SCHLUESSEL.slice(0, n).forEach((s, i) => { k.stempel[s] = Date.now() - (n - i) * 86400000; k.runden[s] = 5; });
    return k;
  }

  /* ---------- Speicher und Cloud ---------- */
  const S = LK.speicher({
    schluessel: `${C.speicher.schluessel}-v${C.speicher.schema}`,
    nameMax: C.nameMaxLaenge,
    leer: () => ({ stempel: {}, runden: {} }),
    normalisiere: sauber,
    mische,
    vorschau: vorschauStand
  });

  const cloud = LK.cloud({
    firebase: C.firebase,
    sammlung: C.cloud.stand,
    sammlungKinder: C.cloud.kinder,
    speicher: S, mische, neuanfang,
    brauchtAngaben: false,
    schreibPauseMs: C.cloud.schreibPauseMs,
    nameMax: C.nameMaxLaenge
  });

  const schluesselOk = (station, stufe) => SCHLUESSEL.includes(`${station}:${stufe}`);

  ZE.stand = {
    S, cloud, mische, neuanfang, sauber,
    SCHLUESSEL,
    istVorschau: S.istVorschau,
    aktiv: () => S.aktiv(),
    code: () => S.code(),

    /* Eine Aufgabe in einer Stufe geschafft. Gibt zurück, ob gespeichert wurde. */
    rundeGeschafft(station, stufe) {
      const k = S.aktiv(), s = `${station}:${stufe}`;
      if (!k || !schluesselOk(station, stufe)) return false;
      k.runden[s] = Math.min((Number(k.runden[s]) || 0) + 1, C.rundenMax);
      return S.speichern();
    },
    /* Stufe gemeistert: Stempel. Der erste Stempel bleibt mit seinem Datum. */
    stempelGeben(station, stufe) {
      const k = S.aktiv(), s = `${station}:${stufe}`;
      if (!k || !schluesselOk(station, stufe)) return false;
      if (!k.stempel[s]) k.stempel[s] = Date.now();
      return S.speichern();
    },
    hatStempel: (station, stufe) => { const k = S.aktiv(); return !!(k && k.stempel[`${station}:${stufe}`]); },
    runden: (station, stufe) => { const k = S.aktiv(); return k ? Number(k.runden[`${station}:${stufe}`]) || 0 : 0; },
    zustand: {
      get ladeFehler() { return S.ladeFehler; },
      get letzterFehler() { return S.letzterFehler; }
    }
  };
})();
