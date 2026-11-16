/* Zeitenstrom: Urkunde als PDF, ganz auf dem Gerät (kein Server, keine Bibliothek).
   Klassisches Skript, legt window.ZE.urkunde an.
   Technik nach der Flaschenpost (js/urkunde.js, ursprünglich KI-Korallenriff): jede Seite auf ein Canvas
   (A4 hochkant, 150 dpi), als JPEG in ein eigenes kleines PDF. Gestaltung ruhig: Navy auf Weiß, Libre Caslon für
   Titel und Namen, Andika für Lesetext, kein Konfetti. Alle Zeichen (Stempel, Haken) sind gezeichnet, nicht aus der Schrift.
   Seite 1: Urkunde mit Name, Datum, Stempel-Tafel (6 Stationen × 3 Stufen, dazu das Futur, wenn es schon Stempel hat).
   Die Zeilenhöhe passt sich der Zahl der Stationen an, damit die Tafel nie in Nuri und das Datum ragt. Seite 2: „Das kann ich schon“.
   Passt eine Liste nicht, wird die Schrift kleiner, die Liste wird nie gekürzt.
   Die Urkunde ist ein Ausdruck: Sie wird nicht gespeichert und nicht verschickt. */
(() => {
  'use strict';
  const ZE = window.ZE = window.ZE || {};
  const B = 1240, H = 1754;
  const NAVY = '#0b3155', LEISE = '#4a6275', LINIE = '#d9d3c2', WELLE = '#2d6f98';
  const CASLON = '"Libre Caslon Text", Georgia, serif';
  const ANDIKA = '"Andika", "Trebuchet MS", sans-serif';

  function bild(src) {
    return new Promise((ok, nein) => { const img = new Image(); img.onload = () => ok(img); img.onerror = () => nein(new Error('Bild fehlt: ' + src)); img.src = src; });
  }
  async function schriftenLaden() {
    if (!document.fonts || !document.fonts.load) return;
    await Promise.all([`400 80px ${CASLON}`, `400 40px ${ANDIKA}`, `700 40px ${ANDIKA}`].map(f => document.fonts.load(f).catch(() => null)));
  }
  function neueSeite() {
    const c = document.createElement('canvas');
    c.width = B; c.height = H;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, B, H);
    return { c, ctx };
  }
  function zeile(ctx, text, x, y, schrift, groesse, maxB, farbe) {
    let g = groesse;
    do { ctx.font = schrift.replace('#', g); g -= 2; } while (ctx.measureText(text).width > maxB && g > 20);
    ctx.fillStyle = farbe; ctx.fillText(text, x, y);
  }
  function umbrechen(ctx, text, maxB) {
    const zeilen = []; let z = '';
    text.split(/\s+/).forEach(w => { const p = z ? z + ' ' + w : w; if (ctx.measureText(p).width > maxB && z) { zeilen.push(z); z = w; } else z = p; });
    if (z) zeilen.push(z);
    return zeilen;
  }
  function rahmen(ctx) {
    ctx.save();
    ctx.strokeStyle = NAVY; ctx.lineWidth = 3; ctx.strokeRect(70, 70, B - 140, H - 140);
    ctx.strokeStyle = LINIE; ctx.lineWidth = 2; ctx.strokeRect(92, 92, B - 184, H - 184);
    ctx.restore();
  }
  function welle(ctx, mx, y, breite) {
    ctx.save(); ctx.strokeStyle = WELLE; ctx.lineWidth = 3; ctx.lineCap = 'round';
    const n = 4, s = breite / n;
    ctx.beginPath(); ctx.moveTo(mx - breite / 2, y);
    for (let i = 0; i < n; i++) { const x0 = mx - breite / 2 + i * s; ctx.quadraticCurveTo(x0 + s / 4, y - 8, x0 + s / 2, y); ctx.quadraticCurveTo(x0 + 3 * s / 4, y + 8, x0 + s, y); }
    ctx.stroke(); ctx.restore();
  }
  /* Verdienter Stempel: Navy-Scheibe mit hellem Ring und gezeichnetem Haken. Offener Stempel: gestrichelter Kreis. */
  /* Stempelmotiv einer Station (SVG im Raster 100 × 100, wie im Logbuch) Form für Form aufs Canvas zeichnen.
     Kein eingebettetes Bild: Die CSP der Seite erlaubt keine data:- oder blob:-Bilder (B14, Etappe 6b). */
  const STIL = {
    stempel__rand: { strich: WELLE, breite: 4 }, 'stempel__rand--innen': { strich: WELLE, breite: 2, strichel: [4, 4] },
    stempel__welle: { strich: NAVY, breite: 3.5 }, stempel__kugel: { fuell: NAVY }
  };
  function motivZeichnen(ctx, svgText, x, y, r) {
    const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
    const k = r / 50;
    ctx.save();
    ctx.translate(x - 50 * k, y - 50 * k);
    ctx.scale(k, k);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (const e of doc.querySelectorAll('circle, rect, path, ellipse')) {
      const klassen = (e.getAttribute('class') || '').split(/\s+/);
      const stil = Object.assign({}, ...klassen.map(c => STIL[c] || {}));
      if (!stil.strich && !stil.fuell) continue;
      const n = a => Number(e.getAttribute(a) || 0);
      let p;
      if (e.tagName === 'circle') { p = new Path2D(); p.arc(n('cx'), n('cy'), n('r'), 0, Math.PI * 2); }
      else if (e.tagName === 'ellipse') { p = new Path2D(); p.ellipse(n('cx'), n('cy'), n('rx'), n('ry'), 0, 0, Math.PI * 2); }
      else if (e.tagName === 'rect') { p = new Path2D(); if (p.roundRect) p.roundRect(n('x'), n('y'), n('width'), n('height'), n('rx')); else p.rect(n('x'), n('y'), n('width'), n('height')); }
      else p = new Path2D(e.getAttribute('d') || '');
      ctx.setLineDash(stil.strichel || []);
      if (stil.fuell) { ctx.fillStyle = stil.fuell; ctx.fill(p); }
      if (stil.strich) { ctx.strokeStyle = stil.strich; ctx.lineWidth = stil.breite; ctx.stroke(p); }
    }
    ctx.restore();
  }
  function stempel(ctx, x, y, r, voll, motiv) {
    if (voll && motiv) { motivZeichnen(ctx, motiv, x, y, r * 1.12); return; }
    ctx.save();
    if (voll) {
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = NAVY; ctx.fill();
      ctx.beginPath(); ctx.arc(x, y, r * 0.74, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(245, 243, 236, 0.6)'; ctx.lineWidth = 2; ctx.stroke();
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = r * 0.16; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(x - r * 0.38, y); ctx.lineTo(x - r * 0.1, y + r * 0.3); ctx.lineTo(x + r * 0.42, y - r * 0.32); ctx.stroke();
    } else {
      ctx.setLineDash([7, 7]); ctx.strokeStyle = LEISE; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(x, y, r * 0.9, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore();
  }
  const datumText = d => d.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });

  /* daten: { name, datum, stationen: [{ id, name }], stufen: ['leicht', …], hat(id, stufe), saetze: [{ station, satz }], nuriSrc } */
  async function vorderseite(d) {
    await schriftenLaden();
    let nuri = null;
    try { nuri = await bild(d.nuriSrc); } catch (e) { nuri = null; }
    const { c, ctx } = neueSeite();
    rahmen(ctx);
    const m = B / 2;
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    zeile(ctx, 'Zeitenstrom', m, 210, `400 #px ${CASLON}`, 46, 700, NAVY);
    welle(ctx, m, 245, 120);
    zeile(ctx, 'Urkunde', m, 400, `400 #px ${CASLON}`, 120, 900, NAVY);
    zeile(ctx, d.name, m, 560, `400 #px ${CASLON}`, 92, 900, NAVY);
    ctx.font = `400 38px ${ANDIKA}`; ctx.fillStyle = LEISE;
    umbrechen(ctx, 'war im Zeitenstrom unterwegs und kennt sich mit Verben und ihren Zeitformen aus.', 860).forEach((z, i) => ctx.fillText(z, m, 650 + i * 54));

    /* Stempel-Tafel */
    /* Platz bis über Nuri (Bild ab 1420): letzte Zeile samt Stempel endet spätestens bei 1380 */
    const xs = [700, 850, 1000], y0 = 860, n = d.stationen.length;
    const dy = n > 1 ? Math.min(116, Math.floor((1340 - y0) / (n - 1))) : 116, r0 = Math.min(40, Math.floor(dy * 0.42));
    ctx.font = `700 30px ${ANDIKA}`; ctx.fillStyle = NAVY;
    d.stufen.forEach((st, i) => ctx.fillText(st, xs[i], y0 - 50));
    d.stationen.forEach((s, r) => {
      const y = y0 + r * dy;
      ctx.textAlign = 'left';
      zeile(ctx, s.name, 190, y + 12, `700 #px ${ANDIKA}`, 36, 440, NAVY);
      ctx.textAlign = 'center';
      d.stufen.forEach((st, i) => stempel(ctx, xs[i], y, r0, d.hat(s.id, st), d.motiv && d.motiv(s.id)));
      if (r < d.stationen.length - 1) { ctx.strokeStyle = LINIE; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(190, y + dy / 2); ctx.lineTo(1050, y + dy / 2); ctx.stroke(); }
    });

    /* Fuß: Nuri, Datum, Unterzeile */
    if (nuri) { ctx.save(); ctx.beginPath(); ctx.arc(m, 1490, 70, 0, Math.PI * 2); ctx.clip(); ctx.drawImage(nuri, m - 70, 1420, 140, 140); ctx.restore(); }
    ctx.textAlign = 'center';
    zeile(ctx, datumText(d.datum), m, 1610, `400 #px ${ANDIKA}`, 32, 700, LEISE);
    zeile(ctx, 'Verben von heute nach gestern.', m, 1655, `400 #px ${CASLON}`, 30, 700, NAVY);
    return c;
  }

  async function rueckseite(d) {
    await schriftenLaden();
    const { c, ctx } = neueSeite();
    rahmen(ctx);
    const m = B / 2, links = 170, breit = B - 2 * links - 30;
    ctx.textAlign = 'center';
    zeile(ctx, 'Das kann ich schon', m, 220, `400 #px ${CASLON}`, 72, 900, NAVY);
    zeile(ctx, d.name, m, 290, `400 #px ${CASLON}`, 40, 900, LEISE);
    welle(ctx, m, 325, 120);
    /* Gruppen nach Station; Schrift so groß wie möglich, bis alles zwischen 400 und 1620 passt */
    const gruppen = d.stationen.map(s => ({ name: s.name, saetze: d.saetze.filter(x => x.station === s.id).map(x => x.satz) })).filter(g => g.saetze.length);
    let g = 36, plan;
    for (; g >= 18; g -= 2) {
      ctx.font = `400 ${g}px ${ANDIKA}`;
      const zh = Math.round(g * 1.35);
      let y = 400; plan = [];
      for (const gr of gruppen) {
        plan.push({ typ: 'kopf', text: gr.name, y: y + g }); y += Math.round(g * 1.6);
        for (const s of gr.saetze) {
          const z = umbrechen(ctx, s, breit - 40);
          plan.push({ typ: 'satz', zeilen: z, y: y + g, zh }); y += z.length * zh + Math.round(g * 0.35);
        }
        y += Math.round(g * 0.5);
      }
      if (y <= 1620) break;
    }
    ctx.textAlign = 'left';
    for (const p of plan) {
      if (p.typ === 'kopf') { ctx.font = `700 ${g}px ${ANDIKA}`; ctx.fillStyle = NAVY; ctx.fillText(p.text, links, p.y); }
      else {
        ctx.font = `400 ${g}px ${ANDIKA}`; ctx.fillStyle = NAVY;
        /* Haken als Linie vor jedem Satz */
        ctx.save(); ctx.strokeStyle = WELLE; ctx.lineWidth = Math.max(2.5, g * 0.11); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        const hy = p.y - g * 0.32; ctx.beginPath(); ctx.moveTo(links + 4, hy); ctx.lineTo(links + 12, hy + g * 0.25); ctx.lineTo(links + 26, hy - g * 0.28); ctx.stroke(); ctx.restore();
        p.zeilen.forEach((z, i) => ctx.fillText(z, links + 40, p.y + i * p.zh));
      }
    }
    return c;
  }

  function jpegBytes(canvas) {
    const daten = atob(canvas.toDataURL('image/jpeg', 0.9).split(',')[1]);
    const b = new Uint8Array(daten.length);
    for (let i = 0; i < daten.length; i++) b[i] = daten.charCodeAt(i);
    return b;
  }
  /* Kleines PDF mit je einem JPEG pro Seite (A4) */
  function pdfAusSeiten(canvasse) {
    const teile = []; let laenge = 0; const offsets = [];
    const text = s => { const b = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) b[i] = s.charCodeAt(i) & 255; teile.push(b); laenge += b.length; };
    const roh = b => { teile.push(b); laenge += b.length; };
    const obj = (nr, inhalt) => { offsets[nr] = laenge; text(`${nr} 0 obj\n${inhalt}\nendobj\n`); };
    const W = 595.28, Hp = 841.89, n = canvasse.length, seitenNr = i => 3 + i * 3;
    text('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
    obj(1, '<< /Type /Catalog /Pages 2 0 R >>');
    obj(2, `<< /Type /Pages /Count ${n} /Kids [${canvasse.map((_, i) => `${seitenNr(i)} 0 R`).join(' ')}] >>`);
    canvasse.forEach((cv, i) => {
      const s = seitenNr(i);
      obj(s, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${Hp}] /Resources << /XObject << /Im${i} ${s + 2} 0 R >> >> /Contents ${s + 1} 0 R >>`);
      const strom = `q ${W} 0 0 ${Hp} 0 0 cm /Im${i} Do Q`;
      obj(s + 1, `<< /Length ${strom.length} >>\nstream\n${strom}\nendstream`);
      const jpg = jpegBytes(cv);
      offsets[s + 2] = laenge;
      text(`${s + 2} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${cv.width} /Height ${cv.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>\nstream\n`);
      roh(jpg); text('\nendstream\nendobj\n');
    });
    const anzahl = 3 + n * 3, xref = laenge;
    let x = `xref\n0 ${anzahl}\n0000000000 65535 f \n`;
    for (let i = 1; i < anzahl; i++) x += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
    text(`${x}trailer\n<< /Size ${anzahl} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
    return new Blob(teile, { type: 'application/pdf' });
  }

  /* Erstellt beide Seiten und das PDF. Gibt { blob, dateiname, seiten } zurück. */
  async function erstellen(daten) {
    const vorne = await vorderseite(daten);
    const hinten = await rueckseite(daten);
    const blob = pdfAusSeiten([vorne, hinten]);
    const dateiname = `Urkunde Zeitenstrom ${String(daten.name).replace(/[\\/:*?"<>|]/g, '')}.pdf`;
    return { blob, dateiname, seiten: [vorne, hinten] };
  }

  ZE.urkunde = { erstellen, vorderseite, rueckseite, pdfAusSeiten };
})();
