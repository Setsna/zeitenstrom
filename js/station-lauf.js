/* Zeitenstrom: der gemeinsame Ablauf aller Stationen.
   Klassisches Skript, legt window.ZE.station an. Jede Station (js/stationen/<id>.js) trägt sich mit
   ZE.station.eintragen({ id, titel, ... }) ein; die App ruft oeffnen(ctx) und bedienen(e).

   Ablauf: Stufenwahl → Runde mit 6 Aufgaben → Rundenende mit Stempel (ab 5 geschafften).
   Geschafft heißt: im ersten oder zweiten Versuch richtig. Nach dem zweiten Fehlversuch zeigt die Seite die Lösung.
   Erst probieren, dann das Fachwort: Das Fachwort (Präsens, Präteritum, Perfekt) kommt nach der Antwort.
   Gespeichert werden nur runden und stempel (js/ze-stand.js). Antworten werden nicht gespeichert.
   Sicherheit: Alle Texte durch esc(), Sätze kommen aus den eigenen Daten. */
(() => {
  'use strict';
  const ZE = window.ZE = window.ZE || {};
  ZE.stationen = ZE.stationen || {};
  const T = () => ZE.teile;
  const ST = () => ZE.stand;
  const A = () => ZE.aufgaben;
  const SA = () => ZE.saetze;
  const V = () => ZE.verben;
  const K = () => ZE.kacheln;

  function eintragen(def) {
    const P = def.praefix;
    let ctx = null, z = null, hilfeStufe = 0, steuer = null;
    const esc = s => ctx.esc(s);
    const kopf = unterzeile => T().kopf(ctx, { titel: def.titel, unterzeile, praefix: P });
    const fokusAuf = sel => T().fokus(ctx, sel);
    const soGehts = offen => T().aufklapper(ctx, { klasse: 'so-gehts', titel: "So geht's", offen, schritte: def.soGehts });
    const amTisch = offen => T().aufklapper(ctx, { klasse: 'am-tisch', titel: 'Am Tisch: ' + def.amTisch.titel, offen, schritte: def.amTisch.schritte, notiz: def.amTisch.notiz });
    const stempelSvg = () => T().stempel(def.stempelMotiv);

    /* ---------- Stufenwahl ---------- */
    function ansichtStufen() {
      z = null; steuer = null;
      const erstesMal = T().erstesMal(def.id);
      ctx.zeigen(`
        ${kopf(def.unterzeile)}
        ${erstesMal ? `<p class="nuri-satz">${esc(def.nuriSatz)}</p>` : ''}
        ${soGehts(erstesMal)}
        ${T().stufenListe(ctx, def.id, P, def.stufen || {})}
        ${amTisch(false)}`, def.titel);
    }

    /* ---------- Runde ---------- */
    function rundeStarten(stufe) {
      z = { stufe, aufgaben: A().runde(def.id, stufe), i: 0, geschafft: [], gespeichertFehler: false };
      aufgabeZeigen();
    }
    const aufgabe = () => z && z.aufgaben[z.i];
    function aufgabeZeigen() {
      const a = aufgabe();
      hilfeStufe = 0;
      a.zustand = { phase: a.typ === 'zeitform' ? 'verb' : a.typ === 'fehler' ? 'suchen' : a.typ === 'stimmt' ? 'antwort' : 'setzen', versuche: 0, fehlversuche: 0, fertig: false, geschafft: false, gefunden: [], fehlerNr: 0, korrigiert: {}, teilGefunden: [] };
      ctx.zeigen(`
        ${kopf(`Stufe ${T().STUFENNAME[z.stufe]} · Aufgabe ${z.i + 1} von ${z.aufgaben.length}`)}
        <section class="papier aufgabe" id="${P}-aufgabe" aria-labelledby="${P}-frage"></section>`, `Aufgabe ${z.i + 1} – ${def.titel}`);
      zeichne();
      const erster = ctx.app.querySelector(`#${P}-aufgabe button:not([disabled])`);
      if (erster && z.i > 0) erster.focus({ preventScroll: true });
    }

    const weiterKnopf = () => `<p class="knopfreihe"><button type="button" class="knopf haupt" data-${P}="weiter">${z.i + 1 < z.aufgaben.length ? 'Weiter' : 'Zum Rundenende'}</button></p>`;
    const rueckHtml = (s, id = 'rueck') => `<p class="rueckmeldung" id="${P}-${id}" role="status">${s.rueck ? esc(s.rueck) : ''}</p>`;

    /* Ein Satz als Text, Verbteile optional hervorgehoben */
    function satzHtml(satz, { verbHervor = false, knoepfe = false, markiert = [], satzNr = 0 } = {}) {
      return SA().zerlege(satz).map((w, j) => {
        const inhalt = esc(w.text);
        const klasse = `wort${verbHervor && w.verb ? ' wort--verb' : ''}${markiert.includes(j) ? ' wort--markiert' : ''}`;
        const teil = knoepfe ? `<button type="button" class="${klasse} wort-knopf" data-${P}="wort" data-satz="${satzNr}" data-j="${j}">${inhalt}</button>` : `<span class="${klasse}">${inhalt}</span>`;
        return teil + esc(w.zeichen);
      }).join(' ');
    }
    /* Satz mit Lücken (für Kacheln). Gibt außerdem den Satz als lesbaren Text („Gestern ___ ich …“) zurück. */
    function lueckenHtml(woerter) {
      const html = woerter.map(w => (w.luecke !== undefined ? K().luecke(esc, w.luecke, w.praefix, w.zeichen) : `<span class="wort">${esc(w.text)}</span>${esc(w.zeichen)}`)).join(' ');
      const text = woerter.map(w => (w.luecke !== undefined ? (w.praefix || '') + '___' : w.text) + (w.zeichen || '')).join(' ');
      return { html, text };
    }

    /* ---------- Zeichnen je Aufgabenart ---------- */
    function zeichne() {
      const a = aufgabe(), s = a.zustand;
      const ziel = ctx.app.querySelector(`#${P}-aufgabe`);
      if (a.typ === 'zeitform') ziel.innerHTML = zeitformHtml(a, s);
      else if (a.typ === 'luecken' || a.typ === 'tabelle') ziel.innerHTML = lueckenAufgabeHtml(a, s);
      else if (a.typ === 'fehler') ziel.innerHTML = fehlerHtml(a, s);
      else if (a.typ === 'stimmt') ziel.innerHTML = stimmtHtml(a, s);
      if ((a.typ === 'luecken' || a.typ === 'tabelle') && !s.fertig) kachelnAn(ziel, a.kacheln, a);
      if (a.typ === 'fehler' && s.phase === 'korrigieren') kachelnAn(ziel, a.fehler[s.fehlerNr].kacheln, a);
      T().nachZeichnen(ziel, s);
    }
    function kachelnAn(ziel, kacheln, a) {
      const s = a.zustand;
      const ort = ziel.querySelector('.kachel-ort');
      steuer = K().steuerung(ort, { kacheln, ansagen: ctx.ansagen, beiAenderung: () => { const b = ziel.querySelector(`[data-${P}="pruefen"]`); if (b) b.disabled = !steuer.voll(); } });
      /* Richtige Kacheln aus dem ersten Versuch bleiben stehen */
      if (s.behalten) for (const [i, id] of Object.entries(s.behalten)) steuer.setze(id, Number(i));
      const b = ziel.querySelector(`[data-${P}="pruefen"]`);
      if (b) b.disabled = !steuer.voll();
    }

    /* Zeitform erkennen */
    function zeitWahlText(a, zeit) {
      if (a.beschriftung === 'alltag') return T().ZEIT_WORT[zeit];
      if (a.beschriftung === 'beides') return `${T().ZEIT_WORT[zeit]} (${A().FACH[zeit]})`;
      return A().FACH[zeit];
    }
    function zeitformHtml(a, s) {
      const teileGefunden = s.phase !== 'verb';
      const markiert = s.teilGefunden.slice();
      return `
        <h2 class="frage-klein" id="${P}-frage">${s.phase === 'verb' ? 'Tippe das Verb an.' : s.phase === 'zeit' ? 'Wann passiert das?' : 'Geschafft'}</h2>
        <p class="satz satz--gross">${satzHtml(a.satz, { verbHervor: teileGefunden, knoepfe: s.phase === 'verb', markiert })}</p>
        ${s.phase === 'verb' ? '' : `
        <div class="antworten antworten--zeit" role="group" aria-label="Zeitformen">
          ${(a.zeiten || A().ZEITEN).map(zeit => `<button type="button" class="knopf antwort-knopf zeit-knopf${s.fertig && zeit === a.zeit ? ' ist-richtig' : ''}" data-${P}="zeit" data-zeit="${zeit}"${s.phase !== 'zeit' ? ' disabled' : ''}>${T().zeitSymbol(zeit)}<span>${esc(zeitWahlText(a, zeit))}</span></button>`).join('')}
        </div>`}
        ${rueckHtml(s)}
        ${s.fertig ? `<p class="fachwort">${T().zeitSymbol(a.zeit)}<span>Das ist das <b>${esc(A().FACH[a.zeit])}</b>: ${esc(SA().verbteile(a.satz).join(' … '))}.</span></p>${weiterKnopf()}` : ''}`;
    }

    /* Lücken und Tabelle */
    function lueckenAufgabeHtml(a, s) {
      const frage = a.typ === 'tabelle' ? `Ergänze die Tabelle: ${a.verb} im Präteritum.` : a.satzBau ? 'Bau den Satz für früher: Leg die Kacheln in die Lücken.' : a.bauen ? 'Bau das Verb für früher: Wähle die Endung.' : a.zeit !== 'praeteritum' ? 'Setze die zwei Teile ein.' : 'Setze das Verb für früher ein.';
      let koerper = '';
      if (a.typ === 'tabelle') {
        koerper = `<div class="formen-tabelle"><table>
          <caption class="nurvorlesen">${esc(a.verb)}: Präsens und Präteritum</caption>
          <thead><tr><th scope="col">Person</th><th scope="col">${T().zeitSymbol('praesens')} jetzt</th><th scope="col">${T().zeitSymbol('praeteritum')} früher</th></tr></thead>
          <tbody>${a.zeilen.map(zl => `<tr><th scope="row">${esc(zl.person)}</th><td>${esc(zl.praesens)}</td><td>${zl.luecke !== undefined ? (s.fertig ? `<span class="wort wort--verb">${esc(s.loesungTexte[zl.luecke])}</span>` : K().luecke(esc, zl.luecke)) : esc(zl.text)}</td></tr>`).join('')}</tbody>
        </table></div>`;
      } else {
        const l = lueckenHtml(a.woerter);
        koerper = `
          ${a.vorlage ? `<p class="vorlage">${T().zeitSymbol('praesens')}<span class="vorlage__wort">jetzt:</span> <span class="satz">${esc(a.vorlage.satz)}</span></p>` : ''}
          ${a.geschichte ? `<p class="leise">${esc(a.geschichte)} · Satz ${a.nummer} von 6</p>` : ''}
          <p class="vorlage vorlage--ziel">${T().zeitSymbol(a.zeit)}<span class="vorlage__wort">${a.zeit === 'futur' ? 'später:' : 'früher:'}</span>
            <span class="satz satz--gross">${s.fertig ? satzHtml(fertigerSatz(a, s), { verbHervor: true }) : `<span class="nurvorlesen">${esc(l.text)}</span><span aria-hidden="false">${l.html}</span>`}</span></p>`;
      }
      return `
        <h2 class="frage-klein" id="${P}-frage">${esc(frage)}</h2>
        <div class="kachel-ort">
          ${koerper}
          ${s.fertig ? '' : K().ablage(esc, a.kacheln)}
        </div>
        ${s.fertig ? '' : `<p class="knopfreihe"><button type="button" class="knopf haupt" data-${P}="pruefen" disabled>Prüfen</button></p>`}
        ${rueckHtml(s)}
        ${s.fertig ? `<p class="fachwort">${T().zeitSymbol(a.zeit)}<span>${esc(fachwortSatz(a, s))}</span></p>
          <p class="knopfreihe"><button type="button" class="knopf knopf--klein" data-${P}="formen" aria-haspopup="dialog">Alle Formen von ${esc(a.verb)}</button></p>${weiterKnopf()}` : ''}`;
    }
    /* Der fertige Satz mit den richtigen Formen in Klammern (für die Anzeige) */
    function fertigerSatz(a, s) {
      return a.woerter.map(w => (w.luecke !== undefined ? (a.satzBau && !w.verb ? s.loesungTexte[w.luecke] : `[${(w.praefix || '') + s.loesungTexte[w.luecke]}]`) : w.text) + (w.zeichen || '')).join(' ');
    }
    function fachwortSatz(a, s) {
      if (a.typ === 'tabelle') return `Das ist das Präteritum von ${a.verb}.`;
      const teile = a.woerter.filter(w => w.luecke !== undefined && (!a.satzBau || w.verb)).map(w => (w.praefix || '') + s.loesungTexte[w.luecke]);
      if (a.zeit === 'perfekt') return `Das ist das Perfekt: ${teile.join(' + ')}.`;
      if (a.zeit === 'futur') return `Das ist das Futur: ${teile.join(' + ')}.`;
      return `Das ist das Präteritum: ${teile.join('')}.`;
    }

    /* Zeitfehler finden */
    function fehlerHtml(a, s) {
      const f = a.fehler[s.fehlerNr];
      const saetze = a.saetze.map((satz, i) => {
        const fx = a.fehler.find(x => x.satz === i);
        if (fx && s.korrigiert[i]) {
          const neu = SA().GESCHICHTEN.flatMap(g => g.saetze).find(g => g.praesens === satz);
          return satzHtml(neu ? neu.praeteritum : satz, { verbHervor: true });
        }
        const markiert = s.gefunden.includes(i) ? SA().zerlege(satz).map((w, j) => (w.verb ? j : -1)).filter(j => j >= 0) : [];
        return satzHtml(satz, { knoepfe: s.phase === 'suchen', markiert, satzNr: i });
      });
      let korr = '';
      if (s.phase === 'korrigieren') {
        const satz = a.saetze[f.satz];
        const woerter = A().lueckenWoerter(satz);
        const l = lueckenHtml(woerter);
        korr = `<div class="kachel-ort korrektur">
          <h3 class="frage-klein">Verbessere den Satz: Er soll von früher erzählen.</h3>
          <p class="satz satz--gross"><span class="nurvorlesen">${esc(l.text)}</span>${l.html}</p>
          ${K().ablage(esc, f.kacheln)}
          <p class="knopfreihe"><button type="button" class="knopf haupt" data-${P}="pruefen" disabled>Prüfen</button></p>
        </div>`;
      }
      const offen = a.fehler.length - Object.keys(s.korrigiert).length;
      return `
        <h2 class="frage-klein" id="${P}-frage">${s.fertig ? 'Geschafft' : s.phase === 'suchen' ? `Die Geschichte erzählt von früher. Ein Verb passt nicht${a.fehler.length > 1 ? ` (es sind ${a.fehler.length})` : ''}. Tippe es an.` : 'Gefunden.'}</h2>
        <p class="leise">${esc(a.geschichte)}${!s.fertig && a.fehler.length > 1 ? ` · noch ${offen} zu finden` : ''}</p>
        <div class="geschichte">${saetze.map(x => `<p class="satz">${x}</p>`).join('')}</div>
        ${korr}
        ${rueckHtml(s)}
        ${s.fertig ? `<p class="fachwort">${T().zeitSymbol('praeteritum')}<span>Jetzt steht die ganze Geschichte im <b>Präteritum</b>.</span></p>${weiterKnopf()}` : ''}`;
    }

    /* Kann das stimmen? */
    function stimmtHtml(a, s) {
      return `
        <div class="nuri-aussage">${ctx.nuriKlein}<div><p class="nurvorlesen">Nuri sagt:</p><p class="aussage" id="${P}-frage">${esc(a.behauptung)}</p></div></div>
        <h2 class="frage-klein">Kann das stimmen?</h2>
        <div class="antworten antworten--zwei" role="group" aria-label="Antworten">
          ${[['ja', 'Das stimmt.'], ['nein', 'Das stimmt nicht.']].map(([id, t]) => `<button type="button" class="knopf antwort-knopf${s.phase !== 'antwort' && (id === 'ja') === a.stimmt ? ' ist-richtig' : ''}" data-${P}="antwort" data-id="${id}"${s.phase !== 'antwort' ? ' disabled' : ''}>${esc(t)}</button>`).join('')}
        </div>
        ${rueckHtml(s)}
        ${s.phase === 'begr' || s.phase === 'ende' ? `
          <h2 class="frage-klein">Warum? Tippe den passenden Satz an.</h2>
          <div class="begruendungen" role="group" aria-label="Begründungen">
            ${a.begruendungen.map((b, i) => `<button type="button" class="knopf begr-knopf${s.phase === 'ende' && b.richtig ? ' ist-richtig' : ''}" data-${P}="begr" data-i="${i}"${s.phase !== 'begr' ? ' disabled' : ''}>${esc(b.text)}</button>`).join('')}
          </div>` : ''}
        ${s.begrRueck ? `<p class="rueckmeldung" role="status">${esc(s.begrRueck)}</p>` : ''}
        ${s.fertig ? `<div class="tipp tipp--schluss">${ctx.nuriKlein}<p>${esc(a.schluss)}</p></div>${weiterKnopf()}` : ''}`;
    }

    /* ---------- Bewerten ---------- */
    function zaehlen(a) {
      const s = a.zustand;
      if (s.geschafft || z.geschafft[z.i]) return;
      s.geschafft = true; z.geschafft[z.i] = true;
      if (!ST().istVorschau && ST().rundeGeschafft(def.id, z.stufe) === false) z.gespeichertFehler = true;
    }
    function fertig(a, geschafft) {
      const s = a.zustand;
      s.fertig = true; s.phase = 'ende';
      if (geschafft) zaehlen(a);
    }
    const nachher = (sel, text) => { zeichne(); if (text) ctx.ansagen(text); if (sel) fokusAuf(sel); };

    /* Zeitform erkennen: Verb antippen */
    function wort(satzNr, j) {
      const a = aufgabe(), s = a.zustand;
      if (a.typ === 'fehler') return fehlerWort(satzNr, j);
      if (s.phase !== 'verb') return;
      const w = SA().zerlege(a.satz);
      const verbJ = w.map((x, k) => (x.verb ? k : -1)).filter(k => k >= 0);
      if (verbJ.includes(j)) {
        if (!s.teilGefunden.includes(j)) s.teilGefunden.push(j);
        if (a.beideTeile && verbJ.length > 1 && s.teilGefunden.length < verbJ.length) {
          s.rueck = 'Gut. Das Verb hat hier zwei Teile. Finde den zweiten Teil.';
          return nachher('.wort-knopf', s.rueck);
        }
        s.phase = 'zeit';
        s.verbOk = s.fehlversuche < 2;
        s.rueck = verbJ.length > 1 ? `Genau. Das Verb hat zwei Teile: ${verbJ.map(k => w[k].text).join(' … ')}.` : `Genau. „${w[j].text}“ ist das Verb.`;
        s.fehlversuche = 0;
        return nachher('.zeit-knopf', s.rueck + ' Wann passiert das?');
      }
      s.fehlversuche++;
      if (s.fehlversuche >= 2) {
        s.phase = 'zeit'; s.verbOk = false; s.fehlversuche = 0; s.teilGefunden = verbJ;
        s.rueck = `Das Verb ist: ${verbJ.map(k => w[k].text).join(' … ')}. Es sagt, was jemand tut.`;
        return nachher('.zeit-knopf', s.rueck);
      }
      s.rueck = `„${w[j].text}“ ist kein Verb. Such das Wort, das sagt, was jemand tut oder was passiert.`;
      nachher('.wort-knopf', s.rueck);
    }
    function zeitWahl(zeit) {
      const a = aufgabe(), s = a.zustand;
      if (s.phase !== 'zeit') return;
      const teile = SA().verbteile(a.satz);
      if (zeit === a.zeit) {
        s.rueck = `Genau. ${a.zeit === 'praesens' ? `„${teile[0]}“ erzählt von jetzt.` : a.zeit === 'praeteritum' ? `„${teile[0]}“ erzählt von früher. Das Verb ist ein Wort.` : a.zeit === 'futur' ? `„${teile.join(' … ')}“ erzählt von später. Das Verb hat zwei Teile: werden und die Grundform.` : `„${teile.join(' … ')}“ erzählt von früher. Das Verb hat zwei Teile.`}`;
        fertig(a, s.verbOk !== false && s.fehlversuche < 2);
        return nachher(`[data-${P}="weiter"]`, s.rueck + ` Das ist das ${A().FACH[a.zeit]}.`);
      }
      s.fehlversuche++;
      if (s.fehlversuche >= 2) {
        s.rueck = `Hier ist die Lösung: ${T().ZEIT_WORT[a.zeit]}.`;
        fertig(a, false);
        return nachher(`[data-${P}="weiter"]`, s.rueck + ` Das ist das ${A().FACH[a.zeit]}.`);
      }
      s.rueck = a.zeit === 'futur' ? 'Schau genau: Steht da werden mit einem zweiten Verb? Dann passiert es später.'
        : zeit === 'futur' ? 'Schau genau: Steht da wirklich werden?'
        : zeit === 'perfekt' ? 'Schau genau: Hat das Verb zwei Teile, mit haben oder sein?'
        : a.zeit === 'perfekt' ? 'Schau genau: Das Verb hat zwei Teile. Was zeigt das?'
          : 'Lies den Satz noch einmal leise. Passiert es gerade, oder ist es vorbei?';
      nachher('.zeit-knopf:not([disabled])', s.rueck);
    }

    /* Lücken prüfen: jede Lücke gegen die Formen aus der Verbtabelle */
    function pruefen() {
      const a = aufgabe(), s = a.zustand;
      if (!steuer || !steuer.voll()) return;
      if (a.typ === 'fehler') return korrekturPruefen();
      const praefix = i => { const w = (a.woerter || []).find(x => x.luecke === i); return (w && w.praefix) || ''; };
      const ergebnis = a.loesung.map((erl, i) => A().richtig(praefix(i) + steuer.text(i), erl));
      s.versuche++;
      if (ergebnis.every(Boolean)) {
        s.loesungTexte = a.loesung.map((_, i) => steuer.text(i));
        s.rueck = s.versuche === 1 ? 'Genau. Das passt.' : 'Richtig. Jetzt passt es.';
        fertig(a, s.versuche <= 2);
        return nachher(`[data-${P}="weiter"]`, s.rueck + ' ' + fachwortSatz(a, s));
      }
      if (s.versuche >= 2) {
        s.loesungTexte = a.loesung.map((erl, i) => { const k = a.kacheln.find(x => A().richtig(praefix(i) + x.text, erl)); return k ? k.text : erl[0]; });
        s.rueck = 'Hier ist die Lösung. Lies den Satz einmal leise.';
        fertig(a, false);
        return nachher(`[data-${P}="weiter"]`, s.rueck + ' ' + fachwortSatz(a, s));
      }
      /* Erster Fehlversuch: richtige Kacheln bleiben, falsche gehen zurück; Tipp passend zur gewählten Form */
      s.behalten = {};
      const belegung = steuer.belegung();
      ergebnis.forEach((ok, i) => { if (ok) s.behalten[i] = belegung[i]; });
      const falschI = ergebnis.findIndex(x => !x);
      s.rueck = tippZurForm(a, steuer.text(falschI), falschI);
      nachher(`.kachel:not([disabled])`, s.rueck);
    }
    function tippZurForm(a, gewaehlt, i) {
      const v = V().gib(a.verb), p = a.person;
      const g = (gewaehlt || '').toLowerCase();
      if (a.typ === 'tabelle') return 'Noch nicht ganz. Schau, welche Person in der Zeile steht: ich, du, er/sie/es, wir, ihr oder sie.';
      if (a.bauen) return 'Noch nicht ganz. Schau, wer es tut. Die Endung passt zur Person.';
      if (a.satzBau) {
        const teil = a.verbStellen.indexOf(i);
        if (teil < 0 && a.zeit === 'futur') return 'Die Reihenfolge stimmt noch nicht. werden steht an der Stelle des Verbs, die Grundform ganz am Ende.';
        if (teil < 0) return a.zeit === 'perfekt' ? 'Die Reihenfolge stimmt noch nicht. Beim Perfekt steht haben oder sein vorn, der zweite Teil ganz am Ende.' : 'Die Reihenfolge stimmt noch nicht. Schau auf den Satz für jetzt: Die Wörter stehen fast genauso.';
        i = teil;
      }
      if (a.zeit === 'futur' && i === 0) return 'Der erste Teil passt noch nicht. Für später brauchst du werden: werde, wirst, wird …';
      if (a.zeit === 'futur') return 'Der zweite Teil passt noch nicht. Es ist die Grundform, so wie im Wörterbuch.';
      if (a.zeit === 'perfekt' && i === 0) return 'Der erste Teil passt noch nicht. Sprich leise: habe oder bin? hat oder ist?';
      if (a.zeit === 'perfekt') return 'Der zweite Teil passt noch nicht. Er fängt oft mit ge- an.';
      if (v && v.praesens[p].includes(g)) return 'Das ist die Form für jetzt. Gesucht ist die Form für früher.';
      if (v && g === v.partizip) return 'Dieses Wort braucht noch haben oder sein. Gesucht ist ein Wort allein.';
      return 'Noch nicht ganz. Schau, wer es tut: ich, du, er, wir, ihr oder sie.';
    }

    /* Zeitfehler: Wort antippen, dann verbessern */
    function fehlerWort(satzNr, j) {
      const a = aufgabe(), s = a.zustand;
      if (s.phase !== 'suchen') return;
      const fx = a.fehler.find(x => x.satz === satzNr && !s.korrigiert[satzNr]);
      const w = SA().zerlege(a.saetze[satzNr]);
      if (fx && w[j] && w[j].verb) {
        s.gefunden.push(satzNr);
        s.fehlerNr = a.fehler.indexOf(fx);
        s.phase = 'korrigieren'; s.behalten = null; s.korrVersuche = 0;
        s.rueck = `Genau. „${w[j].text}“ erzählt von jetzt. Die Geschichte erzählt aber von früher.`;
        return nachher('.kachel', s.rueck);
      }
      s.fehlversuche++;
      if (s.fehlversuche >= 2) {
        const naechster = a.fehler.find(x => !s.korrigiert[x.satz]);
        s.gefunden.push(naechster.satz); s.fehlerNr = a.fehler.indexOf(naechster);
        s.phase = 'korrigieren'; s.behalten = null; s.korrVersuche = 0; s.geholfen = true; s.fehlversuche = 0;
        s.rueck = `Hier ist der Zeitfehler: „${SA().verbteile(a.saetze[naechster.satz])[0]}“ erzählt von jetzt. Verbessere ihn.`;
        return nachher('.kachel', s.rueck);
      }
      s.rueck = w[j] && w[j].verb ? `„${w[j].text}“ erzählt schon von früher. Such ein anderes Verb.` : `„${w[j] ? w[j].text : ''}“ ist kein Verb. Such ein Verb, das von jetzt erzählt.`;
      nachher('.wort-knopf', s.rueck);
    }
    function korrekturPruefen() {
      const a = aufgabe(), s = a.zustand, f = a.fehler[s.fehlerNr];
      s.korrVersuche = (s.korrVersuche || 0) + 1;
      const ok = A().richtig(steuer.text(0), f.loesung);
      if (!ok && s.korrVersuche < 2) {
        s.rueck = tippZurForm({ verb: f.verb, person: f.person, zeit: 'praeteritum' }, steuer.text(0), 0);
        return nachher('.kachel:not([disabled])', s.rueck);
      }
      if (!ok) s.geholfen = true;
      s.korrigiert[f.satz] = true;
      s.rueck = ok ? `Genau. „${steuer.text(0)}“ erzählt von früher.` : `Hier ist die Lösung: „${f.loesung[0]}“.`;
      if (Object.keys(s.korrigiert).length === a.fehler.length) {
        fertig(a, !s.geholfen);
        return nachher(`[data-${P}="weiter"]`, s.rueck + ' Jetzt steht die ganze Geschichte im Präteritum.');
      }
      s.phase = 'suchen'; s.fehlversuche = 0;
      s.rueck += ' Such den nächsten Zeitfehler.';
      nachher('.wort-knopf', s.rueck);
    }

    /* Kann das stimmen? */
    function antwort(id) {
      const a = aufgabe(), s = a.zustand;
      if (s.phase !== 'antwort') return;
      s.versuche++;
      const ok = (id === 'ja') === a.stimmt;
      if (ok || s.versuche >= 2) {
        s.phase = 'begr';
        s.rueck = ok ? 'Gut geprüft.' : `Hier ist die Lösung: ${a.stimmt ? 'Das stimmt.' : 'Das stimmt nicht.'}`;
        if (ok) zaehlen(a);
        return nachher('.begr-knopf', s.rueck + ' Warum? Tippe den passenden Satz an.');
      }
      s.rueck = 'Schau noch einmal genau auf das Verb.';
      nachher('.antwort-knopf:not([disabled])', s.rueck);
    }
    function begruendung(i) {
      const a = aufgabe(), s = a.zustand;
      if (s.phase !== 'begr') return;
      const b = a.begruendungen[i];
      s.begrVersuche = (s.begrVersuche || 0) + 1;
      if (b.richtig || s.begrVersuche >= 2) {
        s.begrRueck = b.richtig ? 'Genau.' : 'Dieser Satz passt: ' + a.begruendungen.find(x => x.richtig).text;
        s.fertig = true; s.phase = 'ende';
        return nachher(`[data-${P}="weiter"]`, s.begrRueck + ' ' + a.schluss);
      }
      s.begrRueck = 'Noch nicht ganz. Lies die Sätze noch einmal.';
      nachher('.begr-knopf:not([disabled])', s.begrRueck);
    }

    function weiter() {
      if (z.i + 1 < z.aufgaben.length) { z.i++; aufgabeZeigen(); return; }
      const r = T().rundenende(ctx, { id: def.id, praefix: P, stufe: z.stufe, geschafft: z.geschafft.filter(Boolean).length, anzahl: z.aufgaben.length, stempelSvg: stempelSvg(), gespeichertFehler: z.gespeichertFehler });
      ctx.zeigen(`${kopf(`Stufe ${T().STUFENNAME[z.stufe]} · Rundenende`)}${r.html}${amTisch(false)}`, 'Rundenende – ' + def.titel);
      ctx.ansagen(r.text);
      if (r.fehler) ctx.melden(ctx.speicherFehlt);
    }

    /* Alle Formen eines Verbs als echte Tabelle (Dialog) */
    function formenZeigen() {
      const a = aufgabe(), v = a && V().gib(a.verb);
      if (!v) return;
      const perfekt = p => `${V().HILFSVERB[v.hilfsverb][p]} ${v.partizip}`;
      const mitFutur = def.id === 'futur';
      T().dialog(ctx, {
        titel: `Alle Formen von ${v.grundform}`,
        inhalt: `<div class="formen-tabelle"><table>
          <thead><tr><th scope="col">Person</th><th scope="col">${T().zeitSymbol('praesens')} Präsens</th><th scope="col">${T().zeitSymbol('praeteritum')} Präteritum</th><th scope="col">${T().zeitSymbol('perfekt')} Perfekt</th>${mitFutur ? `<th scope="col">${T().zeitSymbol('futur')} Futur</th>` : ''}</tr></thead>
          <tbody>${V().PERSONEN.map((pers, p) => `<tr><th scope="row">${esc(pers)}</th><td>${esc(v.praesens[p].join(' / '))}</td><td>${esc(v.praeteritum[p].join(' / '))}</td><td>${esc(perfekt(p))}</td>${mitFutur ? `<td>${esc(V().WERDEN[p] + ' ' + v.grundform)}</td>` : ''}</tr>`).join('')}</tbody>
        </table></div>`,
        knoepfe: '<button type="button" class="knopf haupt" data-dialog="zu">Schließen</button>'
      });
    }

    /* ---------- Hilfe ---------- */
    const TIPPS = {
      zeitform: ['Such das Wort, das sagt, was jemand tut.', 'Frag dich: Passiert es gerade, oder ist es vorbei?', 'Stehen haben oder sein mit einem zweiten Verb da? Dann hat das Verb zwei Teile.'],
      luecken: ['Lies den Satz für jetzt. Wer tut etwas?', 'Gesucht ist die Form für früher.', 'Sag leise: heute ich gehe, gestern ich …'],
      bauen: ['Der Wortstamm steht schon da.', 'Schau, wer es tut: ich, du, er, wir, ihr oder sie.', 'ich malte, du maltest, wir malten, ihr maltet.'],
      perfekt: ['Das Verb hat hier zwei Teile.', 'Erster Teil: haben oder sein? Sprich beides leise.', 'Der zweite Teil fängt oft mit ge- an.'],
      satz: ['Lies den Satz für jetzt. Die Wörter bleiben fast alle gleich.', 'Nur das Verb ändert sich. Welche Kachel erzählt von früher?', 'Leg die Kacheln in der Reihenfolge des Satzes für jetzt.'],
      satzPerfekt: ['Lies den Satz für jetzt. Die meisten Wörter bleiben gleich.', 'Das Verb hat jetzt zwei Teile: haben oder sein, und einen zweiten Teil.', 'haben oder sein steht an der Stelle des Verbs, der zweite Teil ganz am Ende.'],
      futur: ['Das Verb hat hier zwei Teile.', 'Erster Teil: eine Form von werden. Wer tut es?', 'Der zweite Teil ist die Grundform, so wie im Wörterbuch.'],
      satzFutur: ['Lies den Satz für jetzt. Die meisten Wörter bleiben gleich.', 'Das Verb hat jetzt zwei Teile: werden und die Grundform.', 'werden steht an der Stelle des Verbs, die Grundform ganz am Ende.'],
      tabelle: ['Schau auf die Zeilen, die schon fertig sind.', 'Bei ich und bei er/sie/es ist die Form im Präteritum gleich.', 'Bei wir und bei sie ist die Form auch gleich.'],
      fehler: ['Die Geschichte erzählt von früher.', 'Such ein Verb, das von jetzt erzählt.', 'Lies Satz für Satz leise. Klingt einer wie heute?'],
      stimmt: ['Lies Nuris Satz genau.', 'Schau auf das Verb.', 'Denk an die Wörter: jetzt, früher, haben oder sein.']
    };
    function hilfeZeigen() {
      const a = aufgabe();
      if (!a) {
        T().dialog(ctx, { titel: 'Tipp von Nuri', inhalt: `<div class="tipp">${ctx.nuriKlein}<p>Wähle eine Stufe. Ich empfehle dir die Stufe mit dem Wort „empfohlen“.</p></div>`, knoepfe: '<button type="button" class="knopf haupt" data-dialog="zu">Ich probiere es</button>' });
        return;
      }
      const s = a.zustand;
      const art = a.typ === 'luecken' ? (a.satzBau ? (a.zeit === 'perfekt' ? 'satzPerfekt' : a.zeit === 'futur' ? 'satzFutur' : 'satz') : a.bauen ? 'bauen' : a.zeit === 'perfekt' ? 'perfekt' : a.zeit === 'futur' ? 'futur' : 'luecken') : a.typ;
      const liste = TIPPS[art];
      const erlaubt = !(s.versuche || s.fehlversuche) ? 2 : 3;
      const bis = Math.min(hilfeStufe, erlaubt - 1);
      T().tippDialog(ctx, { liste, bis, erlaubt, fertig: s.fertig, weiter: () => { hilfeStufe++; hilfeZeigen(); } });
    }

    /* ---------- Bedienung ---------- */
    function bedienen(e) {
      const b = e.target.closest(`[data-${P}]`);
      if (!b || b.disabled) return false;
      const w = b.dataset[P];
      if (w === 'stufe') rundeStarten(b.dataset.stufe);
      else if (w === 'stufen') ansichtStufen();
      else if (w === 'hilfe') hilfeZeigen();
      else if (w === 'woerter') T().woerter(ctx, def.id === 'futur');
      else if (w === 'wort') wort(Number(b.dataset.satz), Number(b.dataset.j));
      else if (w === 'zeit') zeitWahl(b.dataset.zeit);
      else if (w === 'pruefen') pruefen();
      else if (w === 'antwort') antwort(b.dataset.id);
      else if (w === 'begr') begruendung(Number(b.dataset.i));
      else if (w === 'formen') formenZeigen();
      else if (w === 'weiter') weiter();
      else return false;
      return true;
    }

    ZE.stationen[def.id] = { id: def.id, stempelSvg, oeffnen(c) { ctx = c; ansichtStufen(); }, bedienen, aufgabe, zustand: () => z, steuerung: () => steuer };
  }

  ZE.station = { eintragen };
})();
