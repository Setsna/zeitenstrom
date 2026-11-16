/* Zeitenstrom: Kacheln in Lücken setzen (Tippen, Tasten und Ziehen).
   Klassisches Skript, legt window.ZE.kacheln an.

   Bedienung (CLAUDE.md, „Technik“): Ziehen ist nie die einzige Bedienung.
   - Tippen/Enter auf eine Kachel: Sie kommt in die aktive Lücke (zuerst die erste leere).
   - Tippen/Enter auf eine leere Lücke: Diese Lücke wird aktiv. Auf eine volle Lücke: Die Kachel geht zurück.
   - Ziehen mit Finger oder Maus (Pointer-Events): Kachel auf eine Lücke ziehen und loslassen.
   Alles sind echte <button>. Die Lücken sagen ihren Stand an („Lücke 1: leer“ / „Lücke 1: ging“).
   Bei reduzierter Bewegung folgt die gezogene Kachel ohne Nachfedern; es gibt keine Animation. */
(() => {
  'use strict';
  const ZE = window.ZE = window.ZE || {};

  /* ort: Element, das die .luecke-Knöpfe (data-luecke) und die .kachel-Knöpfe (data-kachel) enthält.
     kacheln: [{ id, text }]. beiAenderung(belegung) wird nach jeder Änderung gerufen. */
  function steuerung(ort, { kacheln, beiAenderung, ansagen }) {
    const luecken = () => [...ort.querySelectorAll('.luecke')];
    const kachelKnopf = id => ort.querySelector(`.kachel[data-kachel="${id}"]`);
    const belegung = {};     /* Lückennummer -> Kachel-Id */
    let aktiv = 0, gesperrt = false;

    function zeichne() {
      for (const l of luecken()) {
        const i = Number(l.dataset.luecke);
        const k = kacheln.find(x => x.id === belegung[i]);
        const feld = l.querySelector('.luecke__feld');
        feld.textContent = k ? k.text : '';
        l.classList.toggle('luecke--voll', !!k);
        if (k) l.classList.remove('luecke--falsch');
        l.classList.toggle('luecke--aktiv', !gesperrt && !k && i === aktiv);
        l.setAttribute('aria-label', `Lücke ${i + 1}: ${k ? (l.dataset.praefix || '') + k.text : 'leer'}`);
        l.disabled = gesperrt;
      }
      for (const k of kacheln) {
        const b = kachelKnopf(k.id);
        if (!b) continue;
        const benutzt = Object.values(belegung).includes(k.id);
        b.classList.toggle('kachel--benutzt', benutzt);
        b.disabled = gesperrt || benutzt;
        b.setAttribute('aria-hidden', benutzt ? 'true' : 'false');
      }
    }
    function naechsteLeere() {
      const nr = luecken().map(l => Number(l.dataset.luecke));
      return nr.find(i => !belegung[i]);
    }
    function setze(kachelId, i) {
      if (gesperrt) return;
      if (i === undefined) i = belegung[aktiv] ? naechsteLeere() : aktiv;
      if (i === undefined) return;
      belegung[i] = kachelId;
      const n = naechsteLeere();
      if (n !== undefined) aktiv = n;
      zeichne();
      const k = kacheln.find(x => x.id === kachelId);
      if (ansagen && k) ansagen(`${k.text} in Lücke ${i + 1}.`);
      beiAenderung(Object.assign({}, belegung));
    }
    function leere(i) {
      if (gesperrt) return;
      delete belegung[i];
      aktiv = i;
      zeichne();
      beiAenderung(Object.assign({}, belegung));
    }

    /* Ziehen: kleine Wegstrecke, dann folgt die Kachel dem Finger; Loslassen über einer Lücke setzt sie. */
    let zug = null, klickSperre = false;
    ort.addEventListener('pointerdown', e => {
      const b = e.target.closest('.kachel');
      if (!b || b.disabled || gesperrt || (e.button !== undefined && e.button !== 0)) return;
      zug = { b, id: b.dataset.kachel, x: e.clientX, y: e.clientY, an: false, pid: e.pointerId };
    });
    ort.addEventListener('pointermove', e => {
      if (!zug || e.pointerId !== zug.pid) return;
      const dx = e.clientX - zug.x, dy = e.clientY - zug.y;
      if (!zug.an && Math.hypot(dx, dy) > 8) {
        zug.an = true;
        zug.b.classList.add('kachel--zieht');
        try { zug.b.setPointerCapture(zug.pid); } catch (err) { /* egal */ }
      }
      if (zug.an) {
        e.preventDefault();
        zug.b.style.setProperty('--zx', dx + 'px');
        zug.b.style.setProperty('--zy', dy + 'px');
        const unter = treffer(e);
        for (const l of luecken()) l.classList.toggle('luecke--ziel', l === unter);
      }
    });
    function treffer(e) {
      zug.b.classList.add('kachel--durch');
      const el = document.elementFromPoint(e.clientX, e.clientY);
      zug.b.classList.remove('kachel--durch');
      return el && el.closest ? el.closest('.luecke') : null;
    }
    function zugEnde(e, abbrechen) {
      if (!zug || e.pointerId !== zug.pid) return;
      const z = zug;
      zug = null;
      if (!z.an) return;
      const ziel = abbrechen ? null : (() => { zug = z; const t = treffer(e); zug = null; return t; })();
      z.b.classList.remove('kachel--zieht');
      z.b.style.removeProperty('--zx');
      z.b.style.removeProperty('--zy');
      for (const l of luecken()) l.classList.remove('luecke--ziel');
      klickSperre = true;
      setTimeout(() => { klickSperre = false; }, 0);
      if (ziel && ort.contains(ziel) && !ziel.disabled) setze(z.id, Number(ziel.dataset.luecke));
    }
    ort.addEventListener('pointerup', e => zugEnde(e, false));
    ort.addEventListener('pointercancel', e => zugEnde(e, true));

    /* Tippen und Tasten (Enter/Leertaste lösen bei <button> einen Klick aus) */
    ort.addEventListener('click', e => {
      if (klickSperre) { e.stopPropagation(); return; }
      const k = e.target.closest('.kachel');
      if (k && !k.disabled) { setze(k.dataset.kachel); e.stopPropagation(); return; }
      const l = e.target.closest('.luecke');
      if (l && !l.disabled) {
        const i = Number(l.dataset.luecke);
        if (belegung[i]) leere(i); else { aktiv = i; zeichne(); }
        e.stopPropagation();
      }
    });

    zeichne();
    return {
      belegung: () => Object.assign({}, belegung),
      /* Text in Lücke i (mit festem Wortstamm davor) */
      text: i => { const k = kacheln.find(x => x.id === belegung[i]); return k ? k.text : ''; },
      voll: () => luecken().every(l => belegung[Number(l.dataset.luecke)]),
      leere,
      setze,
      sperren: () => { gesperrt = true; zeichne(); },
      /* Lösung zeigen: die richtigen Texte direkt in die Lücken schreiben */
      zeigeLoesung: texte => {
        gesperrt = true;
        for (const l of luecken()) {
          const i = Number(l.dataset.luecke);
          const k = kacheln.find(x => x.text === texte[i]);
          if (k) belegung[i] = k.id;
        }
        zeichne();
      },
      neuZeichnen: zeichne
    };
  }

  /* HTML für eine Lücke (mit festem Wortstamm davor, z. B. „mal“ + Kachel) */
  const luecke = (esc, i, praefix = '', zeichen = '') => `<button type="button" class="luecke" data-luecke="${i}" data-praefix="${esc(praefix)}">${praefix ? `<span class="luecke__stamm">${esc(praefix)}</span>` : ''}<span class="luecke__feld"></span></button>${esc(zeichen)}`;
  /* HTML für die Ablage mit den Kacheln */
  const ablage = (esc, kacheln) => `<div class="kachel-ablage" role="group" aria-label="Kacheln">${kacheln.map(k => `<button type="button" class="kachel" data-kachel="${esc(k.id)}">${esc(k.text)}</button>`).join('')}</div>`;

  ZE.kacheln = { steuerung, luecke, ablage };
})();
