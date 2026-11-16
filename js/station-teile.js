/* Zeitenstrom: gemeinsame Teile der Stationen (Aufbau aus der Chancenbucht übernommen).
   Klassisches Skript, legt window.ZE.teile an. Genutzt von js/station-lauf.js.
   Enthält nur Darstellung und Bedienhilfen, keine Fachlogik:
   Kopf, Stufenwahl, Rundenende mit Stempel, Dialog (Hilfe, Wörter, Formen), Zeit-Symbol (Lage im Strom), Fokus.
   Regeln: echte Knöpfe, Fokus in Dialoge hinein und zurück, keine style-Attribute, Texte durch esc(). */
(() => {
  'use strict';
  const ZE = window.ZE = window.ZE || {};
  const C = () => ZE.config;
  const ST = () => ZE.stand;
  const STUFENNAME = { leicht: 'leicht', mittel: 'mittel', knifflig: 'knifflig' };

  const PFEIL = '<button type="button" class="pfeil-knopf" data-aktion="start" aria-label="Zurück zur Startseite"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15 5l-7 7 7 7"/></svg></button>';

  /* Lage im Strom: eine Linie von früher (links) nach jetzt (rechts, Pfeil).
     Präsens: ein Punkt vorn. Präteritum: ein Punkt hinten. Perfekt: zwei Punkte hinten (zwei Teile).
     Futur (Klasse 4): zwei hohle Punkte vorn (zwei Teile, noch nicht passiert).
     Die Zeitform steht immer zusätzlich als Wort daneben, das Symbol ist nur eine Hilfe (nie Farbe allein). */
  const ZEIT_WORT = { praesens: 'jetzt', praeteritum: 'früher', perfekt: 'früher, mit haben oder sein', futur: 'später, mit werden' };
  function zeitSymbol(zeit) {
    const punkte = { praesens: '<circle class="strom__punkt" cx="40" cy="12" r="5"/>', praeteritum: '<circle class="strom__punkt" cx="12" cy="12" r="5"/>', perfekt: '<circle class="strom__punkt" cx="9" cy="12" r="4.2"/><circle class="strom__punkt" cx="21" cy="12" r="4.2"/>', futur: '<circle class="strom__punkt--hohl" cx="30" cy="12" r="4.2"/><circle class="strom__punkt--hohl" cx="41" cy="12" r="4.2"/>' }[zeit] || '';
    return `<svg class="zeit-symbol" viewBox="0 0 52 24" aria-hidden="true" focusable="false"><path class="strom__linie" d="M3 12h44"/><path class="strom__pfeil" d="M43 7l6 5-6 5"/>${punkte}</svg>`;
  }

  /* Kopf einer Station: Zurück, h1, Unterzeile, Wörter, Hilfe */
  function kopf(ctx, { titel, unterzeile, praefix }) {
    return `<header class="kopf kopf--station">
        <div class="kopf__reihe">
          ${PFEIL}
          <div class="kopf__mitte">
            <h1>${ctx.esc(titel)}</h1>
            ${unterzeile ? `<p class="unterzeile">${ctx.esc(unterzeile).replace(/(Aufgabe \d+ von \d+)/, '<span class="zusammen">$1</span>')}</p>` : ''}
          </div>
          <div class="kopf__werkzeug">
            <button type="button" class="knopf glas-knopf werkzeug-knopf" data-${praefix}="woerter" aria-haspopup="dialog">Wörter</button>
            <button type="button" class="knopf glas-knopf werkzeug-knopf hilfe-knopf" data-${praefix}="hilfe" aria-haspopup="dialog">${ctx.nuriKlein}<span>Hilfe</span></button>
          </div>
        </div>
      </header>`;
  }

  /* Aufklapper (So geht's, Am Tisch) */
  function aufklapper(ctx, { klasse, titel, schritte, notiz, offen }) {
    return `
      <details class="papier ${klasse}"${offen ? ' open' : ''}>
        <summary><h2>${ctx.esc(titel)}</h2></summary>
        <ol>${schritte.map(s => `<li>${ctx.esc(s)}</li>`).join('')}</ol>
        ${notiz ? `<p class="leise">${ctx.esc(notiz)}</p>` : ''}
      </details>`;
  }

  /* Stufenwahl: Empfehlung = erste Stufe ohne Stempel */
  const empfohlen = id => C().stufen.find(st => !ST().hatStempel(id, st)) || 'knifflig';
  const erstesMal = id => C().stufen.every(st => !ST().runden(id, st));
  function stufenListe(ctx, id, praefix, beschreibung = {}) {
    const emp = empfohlen(id);
    return `
      <section class="papier" aria-labelledby="h-stufe">
        <h2 id="h-stufe">Wähle eine Stufe</h2>
        <ul class="stufen-liste">
          ${C().stufen.map(st => `
            <li><button type="button" class="knopf stufe-knopf${st === emp ? ' stufe-knopf--empfohlen' : ''}" data-${praefix}="stufe" data-stufe="${st}">
              <span class="stufe-knopf__name">${ctx.esc(STUFENNAME[st])}</span>
              ${beschreibung[st] ? `<span class="stufe-knopf__was">${ctx.esc(beschreibung[st])}</span>` : ''}
              <span class="stufe-knopf__info">${ST().hatStempel(id, st) ? '<span class="stempel-punkt stempel-punkt--voll" aria-hidden="true"></span> Stempel geschafft' : '<span class="stempel-punkt" aria-hidden="true"></span> Noch kein Stempel'}${st === emp ? ' · empfohlen' : ''}</span>
            </button></li>`).join('')}
        </ul>
      </section>`;
  }

  /* Rundenende: Stempel geben (ab stempelAb geschafften), Text, Knöpfe. Gibt { html, text, fehler } zurück. */
  function rundenende(ctx, { id, praefix, stufe, geschafft, anzahl, stempelSvg, gespeichertFehler }) {
    const ab = C().runde.stempelAb;
    const hatteSchon = ST().hatStempel(id, stufe);
    let neu = false, fehler = gespeichertFehler;
    if (geschafft >= ab && !hatteSchon) {
      if (!ST().istVorschau && ST().stempelGeben(id, stufe) === false) fehler = true;
      neu = true;
    }
    const naechste = C().stufen[C().stufen.indexOf(stufe) + 1];
    let text;
    if (geschafft >= ab && neu) text = `Runde geschafft. Du bekommst einen Stempel für die Stufe ${STUFENNAME[stufe]}.`;
    else if (geschafft >= ab) text = 'Runde geschafft. Diesen Stempel hast du schon. Jede Runde übt trotzdem.';
    else text = `Du hast ${geschafft} von ${anzahl} geschafft. Für den Stempel brauchst du ${ab}. Probier noch eine Runde, die Aufgaben sind dann neu.`;
    const weiter = naechste && geschafft >= ab;
    const haupt = weiter ? { stufe: naechste, text: `Weiter mit ${STUFENNAME[naechste]}` } : { stufe, text: `Noch eine Runde ${STUFENNAME[stufe]}` };
    const html = `
      <section class="rundenende${geschafft >= ab ? ' rundenende--geschafft' : ''}" aria-labelledby="h-ende">
        <h2 id="h-ende" class="nurvorlesen">Rundenende</h2>
        <div class="stempel-gross${geschafft >= ab || hatteSchon ? ' stempel-gross--voll' : ''}${neu ? ' stempel-gross--neu' : ''}" aria-hidden="true">${stempelSvg}</div>
        <div class="rundenende__satz">${ctx.nuriKlein}<p class="rundenende__text">${ctx.esc(text)}</p></div>
        <p class="knopfreihe knopfreihe--mitte">
          <button type="button" class="knopf haupt rundenende__haupt" data-${praefix}="stufe" data-stufe="${haupt.stufe}">${ctx.esc(haupt.text)}</button>
        </p>
        <p class="knopfreihe knopfreihe--mitte rundenende__weitere">
          ${weiter ? `<button type="button" class="knopf knopf--klein" data-${praefix}="stufe" data-stufe="${stufe}">Noch eine Runde ${ctx.esc(STUFENNAME[stufe])}</button>` : ''}
          <button type="button" class="knopf knopf--klein" data-${praefix}="stufen">Andere Stufe</button>
          <button type="button" class="knopf knopf--klein" data-aktion="start">Zur Startseite</button>
        </p>
      </section>`;
    return { html, text, fehler };
  }
  /* Stempelrahmen (Doppelkreis) um ein eigenes Motiv */
  const stempel = motiv => `<svg class="stempel-bild" viewBox="0 0 100 100" focusable="false"><circle class="stempel__rand" cx="50" cy="50" r="44"/><circle class="stempel__rand stempel__rand--innen" cx="50" cy="50" r="36"/>${motiv}</svg>`;

  /* ---------- Dialog (ein gemeinsamer <dialog>) ---------- */
  let opener = null, beiTipp = null;
  function dialog(ctx, { titel, inhalt, knoepfe, tipp }) {
    let d = document.getElementById('station-dialog');
    if (!d) {
      d = document.createElement('dialog');
      d.id = 'station-dialog';
      d.className = 'dialog';
      d.setAttribute('aria-labelledby', 'station-dialog-titel');
      document.body.appendChild(d);
      d.addEventListener('close', () => { if (opener && document.contains(opener)) opener.focus(); opener = null; });
      d.addEventListener('click', e => {
        const b = e.target.closest('[data-dialog]');
        if (!b) return;
        if (b.dataset.dialog === 'zu') d.close();
        if (b.dataset.dialog === 'tipp' && beiTipp) beiTipp();
      });
    }
    beiTipp = tipp || null;
    d.innerHTML = `<h2 id="station-dialog-titel">${ctx.esc(titel)}</h2>${inhalt}<p class="knopfreihe">${knoepfe}</p>`;
    if (!d.open) { opener = document.activeElement; d.showModal(); }
    const erster = d.querySelector('[data-dialog="tipp"]:not([disabled]), [data-dialog="zu"]');
    if (erster) erster.focus();
    return d;
  }
  /* Gestufte Tipps. liste: alle Tipps, bis: Index des letzten gezeigten, erlaubt: wie viele gerade erlaubt sind */
  function tippDialog(ctx, { liste, bis, erlaubt, fertig, weiter }) {
    const zu = '<button type="button" class="knopf haupt" data-dialog="zu">Ich probiere es</button>';
    if (fertig) return dialog(ctx, { titel: 'Tipp von Nuri', inhalt: `<div class="tipp">${ctx.nuriKlein}<p>Du hast es schon geschafft. Tippe auf Weiter.</p></div>`, knoepfe: zu });
    const mehr = bis < erlaubt - 1;
    const wartet = !mehr && erlaubt < liste.length;
    return dialog(ctx, {
      titel: 'Tipp von Nuri',
      inhalt: `<div class="tipp">${ctx.nuriKlein}<ol class="tipp-liste">${liste.slice(0, bis + 1).map(t => `<li>${ctx.esc(t)}</li>`).join('')}</ol></div>${wartet ? '<p class="leise">Probier es einmal. Danach habe ich noch einen Tipp.</p>' : ''}`,
      knoepfe: `${mehr ? '<button type="button" class="knopf" data-dialog="tipp">Noch ein Tipp</button>' : ''}${zu}`,
      tipp: weiter
    });
  }
  /* Wortspeicher: die Zeitformen und die Fachwörter der Bücher (Grundform, Wortstamm, Endung) */
  function woerter(ctx, mitFutur = false) {
    const Z = [
      ['praesens', 'Präsens (Gegenwart)', 'Es passiert jetzt oder immer wieder.', 'ich male, ich gehe'],
      ['praeteritum', 'Präteritum (Vergangenheit)', 'Es ist vorbei. Das Verb ist ein Wort. Oft in geschriebenen Geschichten.', 'ich malte, ich ging'],
      ['perfekt', 'Perfekt (Vergangenheit)', 'Es ist vorbei. Das Verb hat zwei Teile, mit haben oder sein. Oft beim Erzählen.', 'ich habe gemalt, ich bin gegangen']
    ].concat(mitFutur ? [['futur', 'Futur (Zukunft)', 'Es passiert später. Das Verb hat zwei Teile: werden und die Grundform.', 'ich werde malen, du wirst gehen']] : []);
    return dialog(ctx, {
      titel: 'Wörter: die Zeitformen',
      inhalt: `
      <div class="wortspeicher">
        <table class="wortspeicher__tabelle">
          <tbody>
            ${Z.map(([z, name, was, bsp]) => `<tr><th scope="row">${zeitSymbol(z)}<span>${ctx.esc(name)}</span></th><td>${ctx.esc(was)} <span class="beispiel">${ctx.esc(bsp)}</span></td></tr>`).join('')}
            <tr><th scope="row"><span>Grundform</span></th><td>So steht das Verb im Wörterbuch: <span class="beispiel">malen, gehen</span></td></tr>
            <tr><th scope="row"><span>Wortstamm</span></th><td>Der Kern des Verbs: <span class="beispiel">mal-en</span>. Bei manchen Verben ändert er sich: <span class="beispiel">gehen, ging</span></td></tr>
            <tr><th scope="row"><span>Endung</span></th><td>Das Stück am Ende: <span class="beispiel">ich mal-te, wir mal-ten</span></td></tr>
          </tbody>
        </table>
      </div>`,
      knoepfe: '<button type="button" class="knopf haupt" data-dialog="zu">Schließen</button>'
    });
  }

  function fokus(ctx, sel) {
    const el = ctx.app.querySelector(sel);
    if (el && !el.disabled) el.focus({ preventScroll: false });
  }

  /* Nach jedem Zeichnen einer Aufgabe:
     - „Lösung gezeigt“ sieht anders aus als „richtig gelöst“ (Klasse loesung-gezeigt am Aufgabenblatt).
     - Bei einer richtigen Antwort leuchtet die Rückmeldung einmal ruhig auf: nur transform, kurz,
       nicht bei reduzierter Bewegung, je Rückmeldung nur einmal. */
  const RICHTIG = /^(Genau\.|Richtig\.|Gut geprüft\.)/;
  function nachZeichnen(ziel, s) {
    if (!ziel || !s) return;
    ziel.classList.toggle('loesung-gezeigt', !!(s.fertig && !s.geschafft));
    if (!s.rueck || s.rueck === s._geleuchtet || !RICHTIG.test(s.rueck)) return;
    s._geleuchtet = s.rueck;
    const ruhig = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = [...ziel.querySelectorAll('.ist-richtig')].pop() || ziel.querySelector('.rueckmeldung');
    if (el && !ruhig && typeof el.animate === 'function') {
      el.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.045)' }, { transform: 'scale(1)' }], { duration: 520, easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)' });
    }
  }

  ZE.teile = { nachZeichnen, PFEIL, STUFENNAME, kopf, aufklapper, empfohlen, erstesMal, stufenListe, rundenende, stempel, dialog, tippDialog, woerter, zeitSymbol, ZEIT_WORT, fokus };
})();
