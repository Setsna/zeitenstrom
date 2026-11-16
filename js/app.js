/* Zeitenstrom: Ansichten und Bedienung.
   Aufbau aus der Chancenbucht: Anmeldung mit dem Code, Startseite mit den Stationen, Abmelden, Erwachsenenbereich.
   Vorbild für die Anmeldung: Flaschenpost js/app.js (Konto-Umbau, 14.11.2026).
   Sicherheit: Fremde Werte (Vorname, Stand, Adresse) kommen nie ungeprüft in innerHTML.
   Feste Texte laufen durch esc(), der Vorname wird mit textContent gesetzt. */
(() => {
  'use strict';
  const ZE = window.ZE;
  const C = ZE.config;
  const ST = ZE.stand;
  const S = ST.S;
  const cloud = ST.cloud;

  const app = document.getElementById('app');
  const meldung = document.getElementById('meldung');
  const live = document.getElementById('live');
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  ZE.esc = esc;

  /* Sichtbare Meldung unten, wird von Screenreadern angesagt (role=status). */
  let meldungUhr = 0;
  function melden(text) {
    clearTimeout(meldungUhr);
    meldung.textContent = '';
    if (!text) return;
    setTimeout(() => { meldung.textContent = text; }, 30);
    if (text.length < 80) meldungUhr = setTimeout(() => { meldung.textContent = ''; }, 9000);
  }
  /* Nur für Screenreader: Rückmeldung jeder Antwort („Genau. Das ist das Präteritum.“) */
  function ansagen(text) {
    live.textContent = '';
    setTimeout(() => { live.textContent = text; }, 30);
  }
  ZE.melden = melden;
  ZE.ansagen = ansagen;

  const SPEICHER_FEHLT = 'Dein Stand konnte gerade nicht gespeichert werden. Vielleicht ist der Speicher voll oder ausgeschaltet. Bitte sag deiner Lehrkraft Bescheid.';
  const LADEN_FEHLT = 'Der gespeicherte Stand auf diesem Gerät konnte nicht gelesen werden. Damit nichts verloren geht, speichert die Seite gerade nichts. Bitte sag deiner Lehrkraft Bescheid.';
  const MOMENT = 'Einen Moment …';

  /* ---------- Ansichten ---------- */
  let ersterAufruf = true;
  let ansicht = '';
  function zeigen(html, titel) {
    melden('');
    app.innerHTML = html;
    document.title = titel ? `${titel} – ${C.name}` : C.name;
    const h1 = app.querySelector('h1');
    if (h1 && !ersterAufruf) { h1.tabIndex = -1; h1.focus({ preventScroll: true }); }
    ersterAufruf = false;
    window.scrollTo(0, 0);
  }

  const WELLE = '<svg class="welle" viewBox="0 0 62 14" aria-hidden="true" focusable="false"><path d="M2 5c5-4 9-4 14 0s9 4 14 0 9-4 14 0 9 4 14 0M10 11c4-3 8-3 12 0s8 3 12 0 8-3 12 0" fill="none" stroke-width="1.6" stroke-linecap="round"/></svg>';
  const NURI = `<picture><source srcset="bilder/nuri-512.webp?b=${C.bildStand}" type="image/webp"><img class="nuri" src="bilder/nuri-512.jpg?b=${C.bildStand}" alt="Nuri, ein freundlicher Nautilus mit perlmuttweißer, rostbraun gestreifter Spiralschale, schwimmt ruhig im hellblauen Wasser." width="512" height="512"></picture>`;
  function kopf(titel, mitNuri = false) {
    return `<header class="kopf">
        <p class="wortmarke">${esc(C.name)}${WELLE}</p>
        <h1>${titel}</h1>
        ${mitNuri ? NURI : ''}
      </header>`;
  }

  /* Ergebnis von cloud.anmelden() oder cloud.start() anzeigen */
  function nachAnmelden(r) {
    if (!r.ok) {
      if (ansicht === 'code' && app.querySelector('#code')) {
        app.querySelector('#code-form button[type="submit"]').disabled = false;
        app.querySelector('#code-hinweis').textContent = r.grund || '';
        app.querySelector('#code').focus();
      } else ansichtCode(r.grund);
      return;
    }
    ansichtStart();
    if (r.gespeichert === false) melden(SPEICHER_FEHLT);
  }

  function ansichtCode(hinweis = '') {
    zeigen(`
      ${kopf(esc(C.unterzeile), true)}
      <section class="papier" aria-labelledby="h-code">
        <p>Ich bin ${esc(C.maskottchen)}, ein Nautilus. Hier geht es um <b>Verben</b> und ihre <b>Zeitform</b>: Was passiert jetzt, was ist schon vorbei? Du probierst es aus.</p>
        <h2 id="h-code">Wie lautet dein Code?</h2>
        <form id="code-form" novalidate>
          <label for="code">Dein Code</label>
          <input type="text" id="code" name="code" class="code-feld" autocomplete="off" autocapitalize="characters" autocorrect="off" spellcheck="false" maxlength="${C.codeLaenge + 4}" aria-describedby="code-hinweis code-info">
          <p id="code-hinweis" class="hinweis-feld" aria-live="polite"></p>
          <p class="knopfreihe"><button type="submit" class="knopf haupt">Weiter</button></p>
        </form>
        <p id="code-info" class="leise">Dein Code hat ${C.codeLaenge} Zeichen: Buchstaben und Zahlen. Es ist derselbe Code wie beim Perlentaucher.</p>
      </section>
      ${erwachsene()}`, '');
    ansicht = 'code';
    app.querySelector('#code-hinweis').textContent = hinweis || '';
    app.querySelector('#code-form').addEventListener('submit', e => {
      e.preventDefault();
      const knopf = e.target.querySelector('button[type="submit"]');
      if (knopf.disabled) return;
      knopf.disabled = true;
      app.querySelector('#code-hinweis').textContent = MOMENT;
      cloud.anmelden(app.querySelector('#code').value).then(nachAnmelden, () => nachAnmelden({ ok: false, grund: cloud.TEXT.sonst }));
    });
  }

  /* Zeile auf der Startseite, wenn der Stand gerade nicht in der Datenbank ankommt */
  function netzText() {
    const z = cloud.zustand().art;
    if (z === 'lokal') return 'Gerade ohne Internet. Dein Stand bleibt auf diesem Gerät und wird später abgeglichen.';
    if (z === 'fehler') return 'Dein Stand konnte gerade nicht im Internet gespeichert werden. Er bleibt auf diesem Gerät. Bitte sag deiner Lehrkraft Bescheid.';
    return '';
  }
  cloud.beiZustand(() => {
    const p = app.querySelector('#netz-zeile');
    if (p) { p.textContent = netzText(); p.hidden = !p.textContent; }
  });

  /* Kleine Stationsbilder als Code-Grafik (Zierde, aria-hidden): der Strom von früher nach jetzt und Kacheln.
     Die Zeitform steht nie nur als Farbe da, die Bilder sind reine Zierde (die Karte nennt die Station als Text). */
  const SVG = inhalt => `<svg class="station__bild sym" viewBox="0 0 96 72" aria-hidden="true" focusable="false">${inhalt}</svg>`;
  const STROM = '<path class="sym-strom" d="M8 58c14-6 26 6 40 0s26-6 40 0"/><path class="sym-strom sym-strom--pfeil" d="M82 52l7 6-7 6"/>';
  const KACHEL = (x, y, b, t) => `<rect class="sym-kachel" x="${x}" y="${y}" width="${b}" height="18" rx="5"/><text class="sym-text" x="${x + b / 2}" y="${y + 13}">${t}</text>`;
  const STATIONSBILD = {
    erkennen: SVG(`${STROM}<circle class="sym-punkt" cx="20" cy="57" r="5"/><circle class="sym-punkt sym-punkt--hohl" cx="76" cy="57" r="5"/>${KACHEL(24, 14, 48, 'malte')}`),
    praeteritum: SVG(`${STROM}${KACHEL(10, 18, 34, 'mal')}<path class="sym-plus" d="M48 27h6M51 24v6"/>${KACHEL(58, 18, 28, 'te')}`),
    perfekt: SVG(`${STROM}${KACHEL(8, 18, 38, 'habe')}${KACHEL(50, 18, 40, 'gemalt')}`),
    umschreiben: SVG(`${STROM}<path class="sym-zeile" d="M14 14h52M14 24h40M14 34h56"/>${KACHEL(58, 26, 30, 'lief')}`),
    zeitfehler: SVG(`${STROM}<path class="sym-zeile" d="M12 16h30M12 28h22"/><circle class="sym-lupe" cx="60" cy="26" r="13"/><path class="sym-lupe sym-lupe--griff" d="M69 35l10 10"/>`),
    stimmt: SVG(`${STROM}<path class="sym-frage" d="M40 16a8 8 0 1 1 12 7c-3 2-5 4-5 8"/><circle class="sym-punkt" cx="47" cy="40" r="2.6"/>`),
    futur: SVG(`${STROM}${KACHEL(8, 18, 40, 'werde')}${KACHEL(52, 18, 36, 'malen')}`)
  };
  const BUCH = '<svg class="buch" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 5c3-1.5 5.5-1.5 8 0v14c-2.5-1.5-5-1.5-8 0z"/><path d="M12 5c2.5-1.5 5-1.5 8 0v14c-3-1.5-5.5-1.5-8 0"/></svg>';
  const SCHLOSS = '<svg class="schloss" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';

  /* Live ist eine Station, wenn config.js es sagt und ihr Modul geladen ist (ZE.stationen[id]) */
  const istLive = s => !!(s.live && ZE.stationen && ZE.stationen[s.id]);
  /* Stempel als Form (gefüllter oder gestrichelter Kreis je Stufe), nicht als Zahl */
  function stempelPunkte(id) {
    return `<span class="stempel-punkte" aria-hidden="true">${C.stufen.map(st => `<span class="stempel-punkt${ST.hatStempel(id, st) ? ' stempel-punkt--voll' : ''}"></span>`).join('')}</span>`;
  }
  function stempelText(id) {
    const n = C.stufen.filter(st => ST.hatStempel(id, st)).length;
    return n ? `${n} von ${C.stufen.length} Stempeln.` : 'Noch kein Stempel.';
  }

  /* Startseite: Begrüßung, Stationen, Abmelden */
  function ansichtStart() {
    const k = ST.aktiv();
    if (!k) { ansichtCode(); return; }
    zeigen(`
      ${kopf('Hallo, <span id="vorname"></span>!')}
      <p id="netz-zeile" class="netz-zeile" role="status" hidden></p>
      <section aria-labelledby="h-stationen">
        <h2 id="h-stationen" class="nurvorlesen">Stationen</h2>
        <ul class="stationen">
          ${C.stationen.map(s => istLive(s) ? `
            <li>
              <button type="button" class="station station--live" data-aktion="station" data-id="${esc(s.id)}" aria-label="${esc(s.name)}: ${esc(s.kurz)}. ${stempelText(s.id)}">
                <span class="station__name">${esc(s.name)}</span>
                <span class="station__linie" aria-hidden="true"></span>
                <span class="station__kurz">${esc(s.kurz)}</span>
                ${STATIONSBILD[s.id] || ''}
                ${stempelPunkte(s.id)}
              </button>
            </li>` : `
            <li>
              <div class="station station--bald">
                <h3 class="station__name">${esc(s.name)}</h3>
                <span class="station__linie" aria-hidden="true"></span>
                <p class="station__kurz">${esc(s.kurz)}</p>
                ${STATIONSBILD[s.id] || ''}
                <p class="station__bald">${SCHLOSS}Kommt bald</p>
              </div>
            </li>`).join('')}
        </ul>
      </section>
      <p class="knopfreihe knopfreihe--mitte"><button type="button" class="knopf glas-knopf logbuch-knopf" data-aktion="logbuch">${BUCH}<span>Mein Logbuch</span><span class="logbuch-knopf__zahl">${ZE.logbuch.anzahlStempel()} von ${ZE.logbuch.moeglich()} Stempeln</span></button></p>
      ${ST.istVorschau ? '' : '<p class="knopfreihe knopfreihe--mitte"><button type="button" class="knopf glas-knopf" data-aktion="abmelden">Abmelden</button></p>'}
      ${erwachsene()}`, '');
    app.querySelector('#vorname').textContent = k.name || 'du';
    const n = app.querySelector('#netz-zeile');
    n.textContent = netzText(); n.hidden = !n.textContent;
    ansicht = 'start';
    aktiveStation = null;
    adresse('');
  }

  /* ---------- Stationen ---------- */
  /* Adresse mitführen (#erkennen), damit Neuladen dort bleibt */
  function adresse(h) {
    try { history.replaceState(null, '', location.pathname + location.search + (h ? '#' + h : '')); } catch (e) { /* egal */ }
  }
  let aktiveStation = null;
  const SPEICHER_FEHLT_KURZ = SPEICHER_FEHLT;
  /* Was eine Station von der App braucht */
  const ctx = {
    app, esc, zeigen: (h, t) => zeigen(h, t), melden: t => melden(t), ansagen: t => ansagen(t), adresse,
    zurueck: () => ansichtStart(),
    speicherFehlt: SPEICHER_FEHLT_KURZ,
    nuriKlein: `<picture><source srcset="bilder/nuri-160.webp?b=${C.bildStand}" type="image/webp"><img class="nuri-klein" src="bilder/nuri-160.jpg?b=${C.bildStand}" alt="" width="160" height="160"></picture>`,
    welle: WELLE
  };
  function stationOeffnen(id) {
    const s = ZE.stationen && ZE.stationen[id];
    if (!s || !ST.aktiv()) { ansichtStart(); return; }
    aktiveStation = s;
    ansicht = 'station';
    adresse(id);
    s.oeffnen(ctx);
  }

  /* Logbuch: eigene Ansicht #logbuch, Klicks gehen an ZE.logbuch (Urkunde) */
  function logbuchOeffnen() {
    if (!ST.aktiv()) { ansichtStart(); return; }
    aktiveStation = ZE.logbuch;
    ansicht = 'logbuch';
    adresse('logbuch');
    ZE.logbuch.zeigen(ctx);
  }

  function abmelden(knopf) {
    knopf.disabled = true;
    cloud.abmelden().then(() => { ansichtCode(); }, () => { ansichtCode(); });
  }

  /* ---------- Erwachsenenbereich: zwei Aufklapper (Texte in js/erwachsene.js) ---------- */
  function erwachsenenTeil(bereich, klasse) {
    const abschnitt = x => `
        <h3>${esc(x.titel)}</h3>
        ${(x.absaetze || []).map(t => `<p>${esc(t)}</p>`).join('')}
        ${x.liste ? `<ul class="erwachsene__liste">${x.liste.map(([f, t]) => `<li><b>${esc(f)}:</b> ${esc(t)}</li>`).join('')}</ul>` : ''}
        ${x.tabelle ? `<div class="erwachsene__tabelle"><table><thead><tr>${x.tabelle.kopf.map(k => `<th scope="col">${esc(k)}</th>`).join('')}</tr></thead><tbody>${x.tabelle.zeilen.map(([p, u]) => `<tr><th scope="row">${esc(p)}</th><td>${esc(u)}</td></tr>`).join('')}</tbody></table></div>` : ''}
        ${x.datenschutzLink ? '<p>Mehr steht unter <a href="datenschutz.html">Datenschutz</a>.</p>' : ''}`;
    return `
      <details class="papier erwachsene ${klasse}">
        <summary><h2>${esc(bereich.titel)}</h2></summary>
        ${bereich.abschnitte.map(abschnitt).join('')}
      </details>`;
  }
  function erwachsene() {
    const E = ZE.erwachsene;
    return erwachsenenTeil(E.eltern, 'erwachsene--eltern') + erwachsenenTeil(E.lehrkraefte, 'erwachsene--lehrkraefte');
  }

  /* ---------- Bedienung ---------- */
  app.addEventListener('click', e => {
    if (aktiveStation && aktiveStation.bedienen && aktiveStation.bedienen(e)) return;
    const b = e.target.closest('[data-aktion]');
    if (!b || b.disabled) return;
    const a = b.dataset.aktion;
    if (a === 'abmelden') abmelden(b);
    else if (a === 'start') ansichtStart();
    else if (a === 'station') stationOeffnen(b.dataset.id);
    else if (a === 'logbuch') logbuchOeffnen();
  });

  /* ---------- Start ---------- */
  if (ST.istVorschau) {
    const h = document.getElementById('vorschau-hinweis');
    h.textContent = 'Vorschau: Hier wird nichts gespeichert.';
    h.hidden = false;
  }

  /* Die Lehrkraft hat den Stand zurückgesetzt: Das Gerät hat seinen Stand verworfen (js/konto-cloud.js). */
  cloud.beiNeustart(() => {
    if (ansicht === 'start') ansichtStart();
    melden('Deine Lehrkraft hat deinen Zeitenstrom neu gestartet. Du fängst von vorn an.');
  });

  /* Was das Gerät schon weiß, steht sofort da. Die Antwort aus dem Netz kommt nach.
     Gewechselt wird nur auf der Code- oder Startseite, nie mitten in einer Aufgabe. */
  const darfWechseln = () => ['code', 'start'].includes(ansicht);
  function anzeigen() {
    const ziel = location.hash.slice(1);
    if (ST.aktiv()) {
      if (ZE.stationen && ZE.stationen[ziel] && C.stationen.some(s => s.id === ziel && s.live)) stationOeffnen(ziel);
      else if (ziel === 'logbuch') logbuchOeffnen();
      else ansichtStart();
    } else ansichtCode();
    if (ST.zustand.ladeFehler) melden(LADEN_FEHLT);
  }
  function starten() {
    if (ST.istVorschau) { anzeigen(); return; }
    const LA = window.LagunenKonto.adresse;
    const qr = LA.code(), spur = LA.spur();
    LA.saeubern();
    if (qr) {
      /* Ein gescannter Code hat Vorrang vor dem Kind, das auf dem Gerät noch angemeldet ist. */
      if (ST.aktiv() && ST.code() !== qr) S.abmelden();
      if (ST.aktiv()) ansichtStart(); else ansichtCode(MOMENT);
      cloud.anmelden(qr).then(r => { if (darfWechseln()) { if (!r.ok) ansichtCode(r.grund); else nachAnmelden(r); } }, () => {});
      return;
    }
    anzeigen();
    if (spur && ansicht === 'code') app.querySelector('#code-hinweis').textContent = 'Der Code wurde nicht ganz gelesen. Tippe ihn bitte ein.';
    const gemerkt = ST.code();
    cloud.start().then(r => {
      if (r.ok) { if (darfWechseln()) nachAnmelden(r); return null; }
      if (r.grund) return r;
      /* Firebase kennt niemanden, der Tab aber schon: mit dem gemerkten Code anmelden */
      return gemerkt && ST.code() === gemerkt ? cloud.anmelden(gemerkt) : null;
    }).then(r => {
      if (!r) return;
      if (r.ok) { if (ansicht === 'start' && darfWechseln()) ansichtStart(); return; }
      /* Die Lehrkraft hat den Code gesperrt: nicht auf dem Gerät weiterarbeiten lassen */
      if (r.grund === cloud.TEXT.gesperrt && ST.aktiv()) { S.abmelden(); if (darfWechseln()) ansichtCode(r.grund); }
    }, () => {});
  }
  starten();

  /* Für Rauchtest und Vorschau */
  window.ZE.bereit = true;
})();
