/* Zeitenstrom: Logbuch (Etappe 5e) mit Stempel-Tafel, „Das kann ich schon“ und Urkunde.
   Klassisches Skript, legt window.ZE.logbuch an. Braucht ZE.config, ZE.stand, ZE.teile, ZE.stationen (stempelSvg), ZE.urkunde.
   Texte: Dateien/Beispiele-Entwuerfe/logbuch-erwachsene-urkunde.md, von Ingo freigegeben am 16.11.2026.
   Gelesen wird nur stempel. Es gibt keine Zahlen (keine Aufgaben, keine Zeit, Ingos Entscheidung).
   Urkunde ab leicht und mittel in allen sechs Stationen (12 Stempel, wie Chancenbucht, Ingo 16.11.2026).
   Der Vorname kommt nur über textContent auf die Seite und nur in die Urkunde auf dem Gerät. */
(() => {
  'use strict';
  const ZE = window.ZE = window.ZE || {};
  const C = () => ZE.config;
  const ST = () => ZE.stand;
  const T = () => ZE.teile;
  const URKUNDE_STUFEN = ['leicht', 'mittel'];

  /* „Das kann ich schon“: ein Satz je Station und Stufe (von Ingo freigegeben, 16.11.2026) */
  const SAETZE = {
    erkennen: { leicht: 'Ich finde das Verb und erkenne mit „gestern“ oder „gerade“, ob etwas jetzt passiert oder vorbei ist.', mittel: 'Ich erkenne die Zeitform auch ohne Hinweiswort.', knifflig: 'Ich kenne die Fachwörter Präsens, Präteritum und Perfekt.' },
    praeteritum: { leicht: 'Ich bilde das Präteritum mit -te: ich malte, wir malten.', mittel: 'Ich kenne Verben, bei denen sich der Wortstamm ändert: ging, fand, sang.', knifflig: 'Ich ergänze eine Tabelle im Präteritum für alle Personen.' },
    perfekt: { leicht: 'Ich bilde das Perfekt mit haben: ich habe gemalt.', mittel: 'Ich weiß, wann sein kommt: ich bin gegangen.', knifflig: 'Ich setze beide Teile des Perfekts richtig ein.' },
    umschreiben: { leicht: 'Ich schreibe eine Geschichte ins Präteritum um.', mittel: 'Ich schreibe auch schwierige Verben ins Präteritum um.', knifflig: 'Ich schreibe eine Geschichte ins Perfekt um.' },
    zeitfehler: { leicht: 'Ich finde einen Zeitfehler in einer kurzen Geschichte.', mittel: 'Ich finde einen Zeitfehler in einer langen Geschichte.', knifflig: 'Ich finde und verbessere zwei Zeitfehler.' },
    stimmt: { leicht: 'Ich prüfe, ob Nuri die Zeitform richtig nennt.', mittel: 'Ich prüfe, ob eine Verbform stimmt.', knifflig: 'Ich prüfe Regeln über Zeitformen und begründe.' },
    /* futur: von Ingo freigegeben 16.11.2026 */
    futur: { leicht: 'Ich bilde das Futur mit werden: ich werde malen.', mittel: 'Ich erkenne alle vier Zeitformen, auch das Futur.', knifflig: 'Ich baue einen Satz im Futur, die Grundform kommt ans Ende.' }
  };
  /* Nur Stationen, die es gibt (live). Das Futur (Zusatz Klasse 4) erscheint im Logbuch, zählt aber nicht für die Urkunde. */
  const stationen = () => C().stationen.filter(s => s.live);

  const anzahlStempel = () => stationen().reduce((n, s) => n + C().stufen.filter(st => ST().hatStempel(s.id, st)).length, 0);
  const moeglich = () => stationen().length * C().stufen.length;
  /* Urkunde nur aus den Stationen für Klasse 3; das Futur ist Zusatz und zählt nicht mit */
  const fehlend = () => stationen().filter(s => !s.zusatz).flatMap(s => URKUNDE_STUFEN.filter(st => !ST().hatStempel(s.id, st)).map(st => `${s.name} (${st})`));
  const urkundeBereit = () => fehlend().length === 0;
  const verdienteSaetze = () => stationen().flatMap(s => C().stufen.filter(st => ST().hatStempel(s.id, st)).map(st => ({ station: s.id, stufe: st, satz: SAETZE[s.id][st] })));

  let ctx = null, urkundeUrl = null, urkundeDatei = null;
  function zeigen(c) {
    ctx = c;
    const esc = ctx.esc;
    const liste = stationen();
    const motiv = id => (ZE.stationen && ZE.stationen[id] && ZE.stationen[id].stempelSvg) ? ZE.stationen[id].stempelSvg() : T().stempel('');
    const saetze = verdienteSaetze();
    const fehlt = fehlend();
    /* B14: Die Urkunde steht oben, sobald sie bereit ist; vorher unten mit dem, was noch fehlt */
    const urkundeHtml = `
      <section class="papier logbuch" aria-labelledby="lb-urkunde">
        <h2 id="lb-urkunde">Urkunde</h2>
        ${fehlt.length ? `<p>Die Urkunde gibt es, wenn du in jeder Station leicht und mittel geschafft hast. Das Futur ist ein Zusatz und zählt nicht mit.</p><p>Dir fehlen noch: ${esc(fehlt.join(', '))}.</p>`
          : `<p>Du hast in jeder Station leicht und mittel geschafft. Du kannst dir eine Urkunde machen.</p>
             <p class="knopfreihe"><button type="button" class="knopf haupt" data-lb="urkunde">Urkunde erstellen</button></p>
             <p id="lb-status" role="status"></p>
             <p class="knopfreihe" id="lb-fertig" hidden>
               <a class="knopf haupt" id="lb-ansehen" href="#" target="_blank" rel="noopener">Urkunde ansehen</a>
               <button type="button" class="knopf" data-lb="teilen" id="lb-teilen" hidden>Teilen</button>
             </p>
             <p class="leise">Die Urkunde macht das Gerät selbst. Sie wird nicht gespeichert und nicht verschickt.</p>`}
      </section>`;
    ctx.zeigen(`
      <header class="kopf kopf--station">
        <div class="kopf__reihe">
          ${T().PFEIL}
          <div class="kopf__mitte">
            <h1>Mein Logbuch</h1>
            <p class="unterzeile">Hier steht, was du schon kannst.</p>
          </div>
          <div class="kopf__werkzeug"></div>
        </div>
      </header>
      ${fehlt.length ? '' : urkundeHtml}
      <section class="papier logbuch" aria-labelledby="lb-stempel">
        <h2 id="lb-stempel">Meine Stempel</h2>
        <ul class="logbuch__tafel">
          ${liste.map(s => `
            <li class="logbuch__zeile">
              <h3 class="logbuch__station">${esc(s.name)}</h3>
              <ul class="logbuch__stempel" aria-label="${esc(s.name)}: ${C().stufen.map(st => `${st} ${ST().hatStempel(s.id, st) ? 'geschafft' : 'noch offen'}`).join(', ')}">
                ${C().stufen.map(st => `<li class="logbuch__stufe${ST().hatStempel(s.id, st) ? ' logbuch__stufe--voll' : ''}" aria-hidden="true">
                  <span class="logbuch__bild">${ST().hatStempel(s.id, st) ? motiv(s.id) : ''}</span>
                  <span class="logbuch__wort">${esc(st)}</span>
                  ${ST().hatStempel(s.id, st) ? '' : '<span class="logbuch__offen">noch offen</span>'}
                </li>`).join('')}
              </ul>
              <button type="button" class="knopf logbuch__hin" data-aktion="station" data-id="${esc(s.id)}">Zur Station</button>
            </li>`).join('')}
        </ul>
      </section>
      <section class="papier logbuch" aria-labelledby="lb-kann">
        <h2 id="lb-kann">Das kann ich schon</h2>
        ${saetze.length ? `<ul class="logbuch__kann">${liste.filter(s => saetze.some(x => x.station === s.id)).map(s => `
          <li><h3>${esc(s.name)}</h3><ul>${saetze.filter(x => x.station === s.id).map(x => `<li>${esc(x.satz)}</li>`).join('')}</ul></li>`).join('')}</ul>`
          : '<p>Hier stehen bald deine ersten Sätze. Such dir eine Station aus.</p>'}
      </section>
      ${fehlt.length ? urkundeHtml : ''}`, 'Mein Logbuch');
  }

  async function urkundeErstellen(knopf) {
    if (!urkundeBereit()) return;
    const status = ctx.app.querySelector('#lb-status'), fertig = ctx.app.querySelector('#lb-fertig');
    const ansehen = ctx.app.querySelector('#lb-ansehen'), teilen = ctx.app.querySelector('#lb-teilen');
    knopf.disabled = true;
    status.textContent = 'Deine Urkunde wird gemacht …';
    try {
      const k = ST().aktiv();
      const r = await ZE.urkunde.erstellen({
        name: (k && k.name) || 'Verbforscherin oder Verbforscher', datum: new Date(),
        /* Urkunde: die Stationen für Klasse 3, das Futur (Zusatz) nur, wenn es schon einen Stempel hat */
        stationen: stationen().filter(s => !s.zusatz || C().stufen.some(st => ST().hatStempel(s.id, st))).map(s => ({ id: s.id, name: s.name })), stufen: C().stufen.slice(),
        hat: (id, st) => ST().hatStempel(id, st), saetze: verdienteSaetze(),
        nuriSrc: `bilder/nuri-512.jpg?b=${C().bildStand}`,
        motiv: id => (ZE.stationen && ZE.stationen[id] && ZE.stationen[id].stempelSvg) ? ZE.stationen[id].stempelSvg() : null
      });
      if (urkundeUrl) URL.revokeObjectURL(urkundeUrl);
      urkundeUrl = URL.createObjectURL(r.blob);
      ansehen.href = urkundeUrl;
      ansehen.setAttribute('download', r.dateiname);
      urkundeDatei = typeof File === 'function' ? new File([r.blob], r.dateiname, { type: 'application/pdf' }) : null;
      teilen.hidden = !(urkundeDatei && navigator.canShare && navigator.canShare({ files: [urkundeDatei] }));
      fertig.hidden = false;
      status.textContent = 'Deine Urkunde ist fertig.';
      ZE.urkunde.letzte = r;   /* nur für den Rauchtest */
      ansehen.focus();
    } catch (e) {
      status.textContent = 'Die Urkunde konnte gerade nicht gemacht werden. Versuch es noch einmal.';
    }
    knopf.disabled = false;
  }
  async function urkundeTeilen() {
    const status = ctx.app.querySelector('#lb-status');
    if (!urkundeDatei || !navigator.share) return;
    try { await navigator.share({ files: [urkundeDatei], title: 'Meine Urkunde' }); status.textContent = 'Geteilt.'; }
    catch (e) { if (!e || e.name !== 'AbortError') status.textContent = 'Teilen klappt hier gerade nicht. Tippe auf „Urkunde ansehen“.'; }
  }

  function bedienen(e) {
    const b = e.target.closest('[data-lb]');
    if (!b || b.disabled) return false;
    if (b.dataset.lb === 'urkunde') urkundeErstellen(b);
    else if (b.dataset.lb === 'teilen') urkundeTeilen();
    else return false;
    return true;
  }

  ZE.logbuch = { SAETZE, URKUNDE_STUFEN, zeigen, bedienen, anzahlStempel, moeglich, fehlend, urkundeBereit, verdienteSaetze };
})();
