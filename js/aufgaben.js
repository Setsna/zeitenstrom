/* Zeitenstrom: Aufgaben für alle Stationen und die Prüflogik (Etappe 1b).
   Klassisches Skript, legt window.ZE.aufgaben an. Braucht ZE.verben, ZE.saetze, ZE.zufall (oder einen eigenen Zufall z).
   Nur Daten, keine Darstellung. tools/tests.html prüft jede Stufe jeder Station.

   Regeln (CLAUDE.md, „Fachliche Regeln“):
   - Die richtige Antwort kommt aus der Verbtabelle (Verb, Person, Zeitform), nie aus einem Textvergleich mit der Aufgabe.
   - Gibt es mehrere richtige Formen, zählen alle (loesung ist eine Liste je Lücke).
   - Kacheln zeigen nur echte Formen des Verbs (andere Zeitform oder Person). Fehlformen gibt es nirgends.
   - Groß- und Kleinschreibung: Kacheln haben die Schreibung des Satzes; geprüft wird ohne Rücksicht darauf
     und ohne Leerzeichen am Rand (für eine spätere Texteingabe). ß und ss bleiben verschieden.

   Aufgabenarten:
     zeitform  { satz, zeit, beschriftung: 'alltag'|'beides'|'fach', beideTeile }      Zeitform erkennen
     luecken   { vorlage?, woerter: [{ text, zeichen } | { luecke, praefix, zeichen }], kacheln, loesung }
     tabelle   { verb, zeilen: [{ person, praesens, luecke | text }], kacheln, loesung }
     fehler    { saetze: [satz], fehler: [{ satz, verb, person, loesung, kacheln }] }   Zeitfehler finden
     stimmt    { behauptung, stimmt, begruendungen, schluss }                             Kann das stimmen? */
(() => {
  'use strict';
  const ZE = window.ZE = window.ZE || {};
  const V = () => ZE.verben;
  const SA = () => ZE.saetze;

  const ZEITEN = ['praesens', 'praeteritum', 'perfekt'];
  const ZEITEN4 = ['praesens', 'praeteritum', 'perfekt', 'futur'];   /* nur in der Futur-Station (Zusatz Klasse 4) */
  const FACH = { praesens: 'Präsens', praeteritum: 'Präteritum', perfekt: 'Perfekt', futur: 'Futur' };
  const ALLTAG = { praesens: 'jetzt', praeteritum: 'früher', perfekt: 'früher, mit haben oder sein', futur: 'später, mit werden' };
  const PRONOMEN = ['ich', 'du', 'er', 'wir', 'ihr', 'sie'];

  /* ---------- Prüfen ---------- */
  const norm = s => String(s == null ? '' : s).trim().toLowerCase();
  /* Eine Antwort ist richtig, wenn sie (ohne Groß/klein und Rand-Leerzeichen) einer der richtigen Formen gleicht */
  const richtig = (antwort, erlaubt) => Array.isArray(erlaubt) && erlaubt.some(f => norm(f) === norm(antwort));

  /* ---------- Hilfen ---------- */
  const verb = s => V().gib(s.verb);
  const satzVon = (s, zeit) => s[zeit];
  /* echte, verschiedene Kachelwörter; doppelte Texte fallen weg */
  function kacheln(z, texte) {
    const gesehen = new Set(), aus = [];
    for (const t of texte) { if (t && !gesehen.has(norm(t))) { gesehen.add(norm(t)); aus.push(t); } }
    return z.mische(aus).map((text, i) => ({ id: 'k' + i, text }));
  }
  /* Schreibung wie im Satz: am Satzanfang groß (nur wenn die Lücke vorn steht) */
  const gross = t => t.charAt(0).toUpperCase() + t.slice(1);

  /* Satz mit Lücken an den Verbteilen. praefix: fester Wortstamm vor der Lücke (Präteritum leicht: „mal“ + Kachel) */
  function lueckenWoerter(satz, praefixe = []) {
    return SA().zerlege(satz).map(w => (w.verb ? { luecke: w.teil, praefix: praefixe[w.teil] || '', zeichen: w.zeichen, vorn: false } : { text: w.text, zeichen: w.zeichen }))
      .map((w, i) => (i === 0 && w.luecke !== undefined ? Object.assign(w, { vorn: true }) : w));
  }
  /* Aus einem Satz eine Lückenaufgabe in der Zeitform ziel */
  function luecke(z, s, ziel, { vorlage, stufe }) {
    const v = verb(s), p = s.person;
    const ersteVorn = SA().zerlege(satzVon(s, ziel))[0].verb;
    const g = t => (ersteVorn ? gross(t) : t);
    if (ziel === 'praeteritum') {
      const falsch = [V().form(s.verb, 'praesens', p), v.partizip, andererPerson(v, 'praeteritum', p)];
      return {
        typ: 'luecken', verb: s.verb, person: p, zeit: ziel, satzId: s.id,
        vorlage: vorlage ? { wort: 'jetzt', satz: SA().text(s.praesens) } : null,
        woerter: lueckenWoerter(satzVon(s, ziel)),
        kacheln: kacheln(z, [V().form(s.verb, 'praeteritum', p), ...falsch].map(g)),
        loesung: [V().formen(s.verb, 'praeteritum', p)],
        fachwort: 'Präteritum'
      };
    }
    /* Futur: zwei Lücken, werden und die Grundform */
    if (ziel === 'futur') {
      const w = V().WERDEN[p], wKacheln = [w, V().WERDEN[p === 2 ? 0 : 2], V().HILFSVERB.haben[p]];
      const zweiter = [v.grundform, V().form(s.verb, 'praesens', p), v.partizip];
      return {
        typ: 'luecken', verb: s.verb, person: p, zeit: ziel, satzId: s.id,
        vorlage: vorlage ? { wort: 'jetzt', satz: SA().text(s.praesens) } : null,
        woerter: lueckenWoerter(satzVon(s, ziel)),
        kacheln: kacheln(z, [...wKacheln.map(g), ...zweiter.filter(t => !wKacheln.some(h => norm(h) === norm(t)))]),
        loesung: [[w], [v.grundform]],
        fachwort: 'Futur'
      };
    }
    /* Perfekt: zwei Lücken, haben/sein und der zweite Teil */
    const hv = V().HILFSVERB[v.hilfsverb][p], anders = V().HILFSVERB[v.hilfsverb === 'haben' ? 'sein' : 'haben'][p];
    const hvKacheln = [hv, anders];
    if (stufe === 'knifflig') hvKacheln.push(V().HILFSVERB[v.hilfsverb][p === 2 ? 0 : 2]);
    const zweiter = [v.partizip, V().form(s.verb, 'praeteritum', p), V().form(s.verb, 'praesens', p)];
    return {
      typ: 'luecken', verb: s.verb, person: p, zeit: ziel, satzId: s.id,
      vorlage: vorlage ? { wort: 'jetzt', satz: SA().text(s.praesens) } : null,
      woerter: lueckenWoerter(satzVon(s, ziel)),
      kacheln: kacheln(z, [...hvKacheln.map(g), ...zweiter.filter(t => !hvKacheln.some(h => norm(h) === norm(t)))]),
      loesung: [[hv], [v.partizip]],
      fachwort: 'Perfekt'
    };
  }
  function andererPerson(v, zeit, p) {
    const eigen = v[zeit][p][0];
    const andere = [3, 0, 3, 0, 3, 2].map(q => v[zeit][q][0]).filter(t => t !== eigen);
    return andere[0] || v[zeit].map(x => x[0]).find(t => t !== eigen);
  }

  /* ---------- Zeitform erkennen ---------- */
  function erkennen(z, stufe, n) {
    if (stufe === 'leicht') {
      const je = ZEITEN.map(zeit => z.mische(SA().HINWEIS_SAETZE.filter(h => h.zeit === zeit)));
      const liste = z.mische(Array.from({ length: n }, (_, i) => je[i % 3][Math.floor(i / 3) % je[i % 3].length]));
      return liste.map(h => ({ typ: 'zeitform', satz: h.satz, zeit: h.zeit, verb: h.verb, person: h.person, hinweis: h.hinweis, beschriftung: 'alltag', beideTeile: false }));
    }
    const saetze = z.einige(SA().SAETZE, n);
    const zeiten = z.mische(Array.from({ length: n }, (_, i) => ZEITEN[i % 3]));
    return saetze.map((s, i) => ({ typ: 'zeitform', satz: s[zeiten[i]], zeit: zeiten[i], verb: s.verb, person: s.person, beschriftung: stufe === 'mittel' ? 'beides' : 'fach', beideTeile: stufe === 'knifflig' }));
  }

  /* ---------- Präteritum bilden ---------- */
  function praeteritum(z, stufe, n) {
    if (stufe === 'leicht') {
      const passend = SA().SAETZE.filter(s => verb(s).art === 'regelmaessig' && V().stammUndEndung(s.verb));
      return z.einige(passend, n).map(s => {
        const se = V().stammUndEndung(s.verb);
        const ersteVorn = SA().zerlege(s.praeteritum)[0].verb;
        return {
          typ: 'luecken', verb: s.verb, person: s.person, zeit: 'praeteritum', satzId: s.id, bauen: true,
          vorlage: { wort: 'jetzt', satz: SA().text(s.praesens) },
          woerter: lueckenWoerter(s.praeteritum, [ersteVorn ? gross(se.stamm) : se.stamm]),
          kacheln: kacheln(z, ['te', 'test', 'ten', 'tet']),
          loesung: [V().formen(s.verb, 'praeteritum', s.person)],
          fachwort: 'Präteritum'
        };
      });
    }
    if (stufe === 'mittel') {
      const passend = SA().SAETZE.filter(s => verb(s).art === 'stammaenderung');
      return z.einige(passend, n).map(s => luecke(z, s, 'praeteritum', { vorlage: true, stufe }));
    }
    /* knifflig: Tabelle mit drei Lücken, gemischt regelmäßig und mit Stammänderung */
    const verben = z.einige(V().liste().filter(v => v.grundform !== 'sein' && v.grundform !== 'haben'), n);
    return verben.map(v => {
      /* Nur Personen mit genau einer Form öffnen: Bei „du aßest/aßt“ könnte das Kind sonst eine richtige Form
         in die eine Lücke legen und der anderen Lücke die Kachel wegnehmen (ihr aßt). */
      const eindeutig = [0, 1, 2, 3, 4, 5].filter(p => v.praeteritum[p].length === 1);
      const offen = z.mische(eindeutig).slice(0, 3).sort((a, b) => a - b);
      const zeilen = V().PERSONEN.map((person, p) => (offen.includes(p)
        ? { person, praesens: v.praesens[p][0], luecke: offen.indexOf(p) }
        : { person, praesens: v.praesens[p][0], text: v.praeteritum[p][0] }));
      const richtige = offen.map(p => v.praeteritum[p][0]);
      const falsch = offen.map(p => v.praesens[p][0]).filter(t => !richtige.includes(t)).slice(0, 2);
      const alle = [...richtige, ...falsch];
      return {
        typ: 'tabelle', verb: v.grundform, zeit: 'praeteritum', zeilen,
        kacheln: z.mische(alle.map((text, i) => ({ id: 'k' + i, text }))),
        loesung: offen.map(p => v.praeteritum[p].slice()),
        fachwort: 'Präteritum'
      };
    });
  }

  /* ---------- Perfekt bilden ---------- */
  function perfekt(z, stufe, n) {
    const filter = {
      leicht: s => verb(s).art === 'regelmaessig' && verb(s).hilfsverb === 'haben' && s.verb !== 'haben',
      mittel: s => verb(s).art === 'stammaenderung' && s.verb !== 'haben' && s.verb !== 'sein',
      knifflig: s => s.verb !== 'haben'
    }[stufe];
    let passend = SA().SAETZE.filter(filter);
    /* mittel und knifflig: mindestens zwei Sätze mit „sein“ */
    if (stufe !== 'leicht') {
      const mitSein = z.einige(passend.filter(s => verb(s).hilfsverb === 'sein'), 2);
      const rest = z.einige(passend.filter(s => !mitSein.includes(s)), n - 2);
      return z.mische([...mitSein, ...rest]).map(s => luecke(z, s, 'perfekt', { vorlage: true, stufe }));
    }
    return z.einige(passend, n).map(s => luecke(z, s, 'perfekt', { vorlage: true, stufe }));
  }

  /* ---------- Geschichte umschreiben ---------- */
  function umschreiben(z, stufe, n) {
    const G = SA().GESCHICHTEN;
    const g = stufe === 'leicht' ? G.find(x => x.id === 'strand') : z.eins(stufe === 'mittel' ? G.filter(x => x.id === 'zoo' || x.id === 'regen') : G);
    const ziel = stufe === 'knifflig' ? 'perfekt' : 'praeteritum';
    return g.saetze.slice(0, n).map((s, i) => Object.assign(satzBauen(z, s, ziel), { geschichte: g.titel, nummer: i + 1 }));
  }
  /* Den ganzen Satz aus Wortkacheln bauen (Ingo, 16.11.2026): Jedes Wort des Zielsatzes ist eine Kachel, dazu echte
     Formen des Verbs, die nicht passen (Präteritum: Präsens und zweiter Teil; Perfekt: Präteritum und das andere
     Hilfsverb). Jede Stelle im Satz ist eine Lücke. Geprüft wird je Stelle: Wortstellen gegen das Wort des von Hand
     geschriebenen Satzes, Verbstellen gegen die Verbtabelle. Beim Perfekt muss das Kind den zweiten Teil selbst ans
     Satzende legen. */
  function satzBauen(z, s, ziel) {
    const v = verb(s), p = s.person;
    const woerter = SA().zerlege(satzVon(s, ziel));
    const tabelle = ziel === 'perfekt' ? [[V().HILFSVERB[v.hilfsverb][p]], [v.partizip]] : ziel === 'futur' ? [[V().WERDEN[p]], [v.grundform]] : [V().formen(s.verb, 'praeteritum', p)];
    const loesung = woerter.map(w => (w.verb ? tabelle[w.teil] : [w.text]));
    const falsch = ziel === 'perfekt'
      ? [V().HILFSVERB[v.hilfsverb === 'haben' ? 'sein' : 'haben'][p], V().form(s.verb, 'praeteritum', p)]
      : ziel === 'futur' ? [V().HILFSVERB[v.hilfsverb][p], v.partizip]
        : [V().form(s.verb, 'praesens', p), v.partizip];
    const imSatz = woerter.map(w => w.text.toLowerCase());
    const extra = falsch.filter((t, i, a) => !imSatz.includes(t.toLowerCase()) && a.indexOf(t) === i);
    const kacheln = z.mische([...woerter.map(w => ({ text: w.text, wort: !w.verb })), ...extra.map(text => ({ text, wort: false }))])
      .map((k, i) => ({ id: 'k' + i, text: k.text, wort: k.wort }));
    return {
      typ: 'luecken', satzBau: true, verb: s.verb, person: p, zeit: ziel, satzId: s.id,
      vorlage: { wort: 'jetzt', satz: SA().text(s.praesens) },
      woerter: woerter.map((w, i) => ({ luecke: i, praefix: '', zeichen: w.zeichen, verb: w.verb })),
      kacheln, loesung,
      verbStellen: woerter.map((w, i) => (w.verb ? i : -1)).filter(i => i >= 0),
      fachwort: FACH[ziel]
    };
  }

  /* ---------- Futur (Zusatz Klasse 4, Ingo 16.11.2026) ----------
     leicht: werden und Grundform in zwei Lücken. mittel: Zeitform erkennen mit allen vier Zeitformen.
     knifflig: den ganzen Satz im Futur aus Kacheln bauen (Grundform ans Satzende). Nur Grundsätze mit Futur-Fassung. */
  function futur(z, stufe, n) {
    const mitFutur = SA().SAETZE.filter(s => s.futur && s.verb !== 'haben' && s.verb !== 'sein');
    if (stufe === 'leicht') return z.einige(mitFutur, n).map(s => luecke(z, s, 'futur', { vorlage: true, stufe }));
    if (stufe === 'knifflig') return z.einige(mitFutur, n).map(s => Object.assign(satzBauen(z, s, 'futur'), {}));
    const saetze = z.einige(mitFutur, n);
    const zeiten = z.mische(Array.from({ length: n }, (_, i) => ZEITEN4[i % 4]));
    if (!zeiten.includes('futur')) zeiten[0] = 'futur';
    return saetze.map((s, i) => ({ typ: 'zeitform', satz: s[zeiten[i]], zeit: zeiten[i], zeiten: ZEITEN4, verb: s.verb, person: s.person, beschriftung: 'beides', beideTeile: false }));
  }

  /* ---------- Zeitfehler finden ---------- */
  function zeitfehler(z, stufe, n) {
    const laenge = stufe === 'leicht' ? 4 : 6, zahl = stufe === 'knifflig' ? 2 : 1;
    return Array.from({ length: n }, () => {
      const g = z.eins(SA().GESCHICHTEN);
      const saetze = g.saetze.slice(0, laenge);
      /* Fehler nicht im ersten Satz: Der erste Satz zeigt, dass die Geschichte von früher erzählt */
      const stellen = z.mische(saetze.map((_, i) => i).slice(1)).slice(0, zahl).sort((a, b) => a - b);
      return {
        typ: 'fehler', geschichte: g.titel, zeit: 'praeteritum',
        saetze: saetze.map((s, i) => (stellen.includes(i) ? s.praesens : s.praeteritum)),
        fehler: stellen.map(i => {
          const s = saetze[i], v = verb(s);
          const ersteVorn = SA().zerlege(s.praesens)[0].verb;
          const g2 = t => (ersteVorn ? gross(t) : t);
          return {
            satz: i, verb: s.verb, person: s.person,
            loesung: V().formen(s.verb, 'praeteritum', s.person),
            kacheln: kacheln(z, [V().form(s.verb, 'praeteritum', s.person), V().form(s.verb, 'praesens', s.person), v.partizip].map(g2))
          };
        })
      };
    });
  }

  /* ---------- Kann das stimmen? ---------- */
  function grund(zeit, teile) {
    /* Kurz, mit dem Zeit-Zeichen davor (Design-Review 16.11.2026, Ingo: „kürzer, mit Zeit-Symbol“) */
    if (zeit === 'praesens') return `„${teile[0]}“: jetzt.`;
    if (zeit === 'praeteritum') return `„${teile[0]}“: früher, ein Wort.`;
    return `„${teile[0]} … ${teile[1]}“: früher, mit haben oder sein.`;
  }
  /* Wie das Verb im Satz aussähe, damit die falschen Gründe zu diesem Satz passen */
  function stimmtLeicht(z, n) {
    const saetze = z.einige(SA().SAETZE, n);
    return saetze.map((s, i) => {
      const zeit = ZEITEN[(i + z.zahl(3)) % 3];
      const wahr = z.zahl(2) === 0;
      const behauptet = wahr ? zeit : z.eins(ZEITEN.filter(x => x !== zeit));
      const teile = SA().verbteile(s[zeit]);
      const gruende = ZEITEN.map(x => ({ text: x === zeit ? grund(x, teile) : falscherGrund(x, teile), richtig: x === zeit, zeit: x }));
      return {
        typ: 'stimmt', art: 'zeitform', verb: s.verb, zeit, behauptet,
        behauptung: `„${SA().text(s[zeit])}“ Das ist ${FACH[behauptet]}.`,
        stimmt: behauptet === zeit,
        begruendungen: z.mische(gruende),
        schluss: `Die Zeitform ist ${FACH[zeit]}: ${teile.join(' … ')}.`
      };
    });
    function falscherGrund(x, teile) {
      if (x === 'praesens') return `„${teile[0]}“: jetzt.`;
      if (x === 'praeteritum') return `„${teile.join(' ')}“: früher, ein Wort.`;
      return 'Zwei Teile: früher, mit haben oder sein.';
    }
  }
  function stimmtMittel(z, n) {
    const verben = z.einige(V().liste().filter(v => v.grundform !== 'sein' && v.grundform !== 'haben'), n);
    return verben.map((v, i) => {
      const p = z.eins([0, 2, 3, 5]), pr = PRONOMEN[p];
      if (i % 3 === 2) {
        /* Hilfsverb: nur als Wort („haben“/„sein“), nie als falsche Form */
        const behauptet = z.zahl(2) === 0 ? v.hilfsverb : (v.hilfsverb === 'haben' ? 'sein' : 'haben');
        return {
          typ: 'stimmt', art: 'hilfsverb', verb: v.grundform,
          behauptung: `Bei „${v.grundform}“ steht im Perfekt „${behauptet}“.`,
          stimmt: behauptet === v.hilfsverb,
          begruendungen: z.mische([
            { text: `Es heißt: ${pr} ${V().HILFSVERB[v.hilfsverb][p]} ${v.partizip}.`, richtig: true },
            { text: 'Im Perfekt steht immer „sein“.', richtig: false },
            { text: 'Im Perfekt steht immer „haben“.', richtig: false }]),
          schluss: `${gross(pr)} ${V().HILFSVERB[v.hilfsverb][p]} ${v.partizip}. Das ist das Perfekt.`
        };
      }
      const praet = v.praeteritum[p][0], praes = v.praesens[p][0];
      const wahl = z.eins(['praet', 'praes', 'partizip']);
      const gezeigt = { praet, praes, partizip: v.partizip }[wahl];
      const richtigText = wahl === 'praet' ? `„${praet}“ ist die Präteritumform von „${v.grundform}“.`
        : wahl === 'praes' ? `„${praes}“ ist Präsens. Im Präteritum heißt es: ${pr} ${praet}.`
          : `„${v.partizip}“ braucht noch haben oder sein. Im Präteritum heißt es: ${pr} ${praet}.`;
      return {
        typ: 'stimmt', art: 'form', verb: v.grundform,
        behauptung: `Das Präteritum von „${pr} ${praes}“ heißt „${pr} ${gezeigt}“.`,
        stimmt: wahl === 'praet',
        begruendungen: z.mische([
          { text: richtigText, richtig: true },
          { text: wahl === 'praes' ? `„${praes}“ ist die Präteritumform von „${v.grundform}“.` : `„${gezeigt}“ ist die Präsensform von „${v.grundform}“.`, richtig: false },
          { text: `Bei „${v.grundform}“ gibt es kein Präteritum.`, richtig: false }]),
        schluss: `${gross(pr)} ${praes} heute. ${gross(pr)} ${praet} gestern.`
      };
    });
  }
  function stimmt(z, stufe, n) {
    if (stufe === 'leicht') return stimmtLeicht(z, n);
    if (stufe === 'mittel') return stimmtMittel(z, n);
    return z.einige(SA().BEHAUPTUNGEN, n).map(b => Object.assign({ typ: 'stimmt', art: 'regel' }, b, { begruendungen: z.mische(b.begruendungen) }));
  }

  const ERZEUGER = { erkennen, praeteritum, perfekt, umschreiben, zeitfehler, stimmt, futur };
  /* Eine Runde: n Aufgaben für Station und Stufe */
  function runde(station, stufe, z = ZE.zufall, n = (ZE.config && ZE.config.runde.aufgaben) || 6) {
    const f = ERZEUGER[station];
    if (!f) throw new Error('unbekannte Station ' + station);
    return f(z, stufe, n);
  }

  ZE.aufgaben = { ZEITEN, ZEITEN4, FACH, ALLTAG, PRONOMEN, norm, richtig, runde, ERZEUGER, lueckenWoerter };
})();
