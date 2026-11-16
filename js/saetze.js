/* Zeitenstrom: Sätze, Geschichten und Behauptungen (Etappe 1b und 5).
   Klassisches Skript, legt window.ZE.saetze an.

   VON INGO FREIGEGEBEN (16.11.2026). Jeder Satz ist von Hand in allen drei Zeitformen geschrieben. Neue oder geänderte Sätze brauchen wieder Ingos OK.
   „Hallo“ und „hallo“ sind laut Duden beide richtig (Ingo: beide gelten lassen; Kinder tippen hier nicht, es betrifft nur die Anzeige).
   Das Verb steht in eckigen Klammern, beim Perfekt beide Teile: „Ich [habe] ein Bild [gemalt].“
   tools/tests.html prüft jeden Satz gegen die Verbtabelle (js/verben.js): Die Form in der Klammer muss genau
   die Form aus der Tabelle für Verb, Person und Zeitform sein. So fällt ein Schreibfehler in Satz ODER Tabelle auf.
   Keine Sätze aus dem Zebra-Buch. Namen sind ausgedacht (keine Namen echter Kinder). Tom, Ben, Ana auf Ingos Wunsch ersetzt durch Finn, Noah, Emma (16.11.2026).
   Kein „Morgen …“ mit Präsens (Zukunftsbedeutung), keine trennbaren Verben, kein zweites Verb im Satz. */
(() => {
  'use strict';
  const ZE = window.ZE = window.ZE || {};

  /* Personen: 0 ich, 1 du, 2 er/sie/es, 3 wir, 4 ihr, 5 sie */
  /* futur (Zusatz Klasse 4): nur bei den Grundsätzen, von Ingo freigegeben 16.11.2026 (s11 „Taipei“ bleibt; s42/s43 haben/sein nicht in den Futur-Aufgaben) */
  const S = (id, verb, person, praesens, praeteritum, perfekt, futur) => (futur ? { id, verb, person, praesens, praeteritum, perfekt, futur } : { id, verb, person, praesens, praeteritum, perfekt });

  /* ---------- Grundsätze (ohne Hinweiswort) ---------- */
  const SAETZE = [
    S('s01', 'malen', 0, 'Ich [male] ein Bild von einem Wal.', 'Ich [malte] ein Bild von einem Wal.', 'Ich [habe] ein Bild von einem Wal [gemalt].', 'Ich [werde] ein Bild von einem Wal [malen].'),
    S('s02', 'spielen', 5, 'Die Kinder [spielen] auf dem Schulhof Fangen.', 'Die Kinder [spielten] auf dem Schulhof Fangen.', 'Die Kinder [haben] auf dem Schulhof Fangen [gespielt].', 'Die Kinder [werden] auf dem Schulhof Fangen [spielen].'),
    S('s03', 'lachen', 2, 'Lina [lacht] über den Witz.', 'Lina [lachte] über den Witz.', 'Lina [hat] über den Witz [gelacht].', 'Lina [wird] über den Witz [lachen].'),
    S('s04', 'kochen', 2, 'Papa [kocht] eine Nudelsuppe.', 'Papa [kochte] eine Nudelsuppe.', 'Papa [hat] eine Nudelsuppe [gekocht].', 'Papa [wird] eine Nudelsuppe [kochen].'),
    S('s05', 'bauen', 3, 'Wir [bauen] eine Burg aus Sand.', 'Wir [bauten] eine Burg aus Sand.', 'Wir [haben] eine Burg aus Sand [gebaut].', 'Wir [werden] eine Burg aus Sand [bauen].'),
    S('s06', 'suchen', 1, 'Du [suchst] deinen Turnbeutel.', 'Du [suchtest] deinen Turnbeutel.', 'Du [hast] deinen Turnbeutel [gesucht].', 'Du [wirst] deinen Turnbeutel [suchen].'),
    S('s07', 'hören', 0, 'Ich [höre] ein lautes Geräusch.', 'Ich [hörte] ein lautes Geräusch.', 'Ich [habe] ein lautes Geräusch [gehört].', 'Ich [werde] ein lautes Geräusch [hören].'),
    S('s08', 'lernen', 4, 'Ihr [lernt] ein neues Lied.', 'Ihr [lerntet] ein neues Lied.', 'Ihr [habt] ein neues Lied [gelernt].', 'Ihr [werdet] ein neues Lied [lernen].'),
    S('s09', 'tanzen', 5, 'Alle Kinder [tanzen] in der Turnhalle.', 'Alle Kinder [tanzten] in der Turnhalle.', 'Alle Kinder [haben] in der Turnhalle [getanzt].', 'Alle Kinder [werden] in der Turnhalle [tanzen].'),
    S('s10', 'kaufen', 2, 'Oma [kauft] frisches Obst auf dem Markt.', 'Oma [kaufte] frisches Obst auf dem Markt.', 'Oma [hat] frisches Obst auf dem Markt [gekauft].', 'Oma [wird] frisches Obst auf dem Markt [kaufen].'),
    S('s11', 'wohnen', 3, 'Wir [wohnen] in Taipei.', 'Wir [wohnten] in Taipei.', 'Wir [haben] in Taipei [gewohnt].', 'Wir [werden] in Taipei [wohnen].'),
    S('s12', 'fragen', 2, 'Noah [fragt] seine Lehrerin etwas.', 'Noah [fragte] seine Lehrerin etwas.', 'Noah [hat] seine Lehrerin etwas [gefragt].', 'Noah [wird] seine Lehrerin etwas [fragen].'),
    S('s13', 'warten', 0, 'Ich [warte] an der Bushaltestelle.', 'Ich [wartete] an der Bushaltestelle.', 'Ich [habe] an der Bushaltestelle [gewartet].', 'Ich [werde] an der Bushaltestelle [warten].'),
    S('s14', 'reisen', 3, 'Wir [reisen] mit dem Zug nach Tainan.', 'Wir [reisten] mit dem Zug nach Tainan.', 'Wir [sind] mit dem Zug nach Tainan [gereist].', 'Wir [werden] mit dem Zug nach Tainan [reisen].'),
    S('s15', 'wandern', 5, 'Meine Eltern [wandern] auf einen Berg.', 'Meine Eltern [wanderten] auf einen Berg.', 'Meine Eltern [sind] auf einen Berg [gewandert].', 'Meine Eltern [werden] auf einen Berg [wandern].'),
    S('s16', 'klettern', 2, 'Die Katze [klettert] auf den Baum.', 'Die Katze [kletterte] auf den Baum.', 'Die Katze [ist] auf den Baum [geklettert].', 'Die Katze [wird] auf den Baum [klettern].'),
    S('s17', 'putzen', 0, 'Ich [putze] meine Zähne.', 'Ich [putzte] meine Zähne.', 'Ich [habe] meine Zähne [geputzt].', 'Ich [werde] meine Zähne [putzen].'),
    S('s18', 'machen', 4, 'Ihr [macht] eure Hausaufgaben.', 'Ihr [machtet] eure Hausaufgaben.', 'Ihr [habt] eure Hausaufgaben [gemacht].', 'Ihr [werdet] eure Hausaufgaben [machen].'),
    S('s19', 'holen', 2, 'Emma [holt] ihr Fahrrad aus dem Keller.', 'Emma [holte] ihr Fahrrad aus dem Keller.', 'Emma [hat] ihr Fahrrad aus dem Keller [geholt].', 'Emma [wird] ihr Fahrrad aus dem Keller [holen].'),
    S('s20', 'sagen', 5, 'Die Kinder [sagen] laut Hallo.', 'Die Kinder [sagten] laut Hallo.', 'Die Kinder [haben] laut Hallo [gesagt].', 'Die Kinder [werden] laut Hallo [sagen].'),
    S('s21', 'gehen', 0, 'Ich [gehe] zu meiner Oma.', 'Ich [ging] zu meiner Oma.', 'Ich [bin] zu meiner Oma [gegangen].', 'Ich [werde] zu meiner Oma [gehen].'),
    S('s22', 'laufen', 2, 'Finn [läuft] schnell nach Hause.', 'Finn [lief] schnell nach Hause.', 'Finn [ist] schnell nach Hause [gelaufen].', 'Finn [wird] schnell nach Hause [laufen].'),
    S('s23', 'kommen', 4, 'Ihr [kommt] zu spät zum Training.', 'Ihr [kamt] zu spät zum Training.', 'Ihr [seid] zu spät zum Training [gekommen].', 'Ihr [werdet] zu spät zum Training [kommen].'),
    S('s24', 'essen', 3, 'Wir [essen] Reis mit Gemüse.', 'Wir [aßen] Reis mit Gemüse.', 'Wir [haben] Reis mit Gemüse [gegessen].', 'Wir [werden] Reis mit Gemüse [essen].'),
    S('s25', 'trinken', 2, 'Mei [trinkt] ein Glas Wasser.', 'Mei [trank] ein Glas Wasser.', 'Mei [hat] ein Glas Wasser [getrunken].', 'Mei [wird] ein Glas Wasser [trinken].'),
    S('s26', 'finden', 0, 'Ich [finde] eine Muschel am Strand.', 'Ich [fand] eine Muschel am Strand.', 'Ich [habe] eine Muschel am Strand [gefunden].', 'Ich [werde] eine Muschel am Strand [finden].'),
    S('s27', 'singen', 5, 'Die Kinder [singen] ein Geburtstagslied.', 'Die Kinder [sangen] ein Geburtstagslied.', 'Die Kinder [haben] ein Geburtstagslied [gesungen].', 'Die Kinder [werden] ein Geburtstagslied [singen].'),
    S('s28', 'schreiben', 2, 'Jonas [schreibt] einen Brief an seinen Opa.', 'Jonas [schrieb] einen Brief an seinen Opa.', 'Jonas [hat] einen Brief an seinen Opa [geschrieben].', 'Jonas [wird] einen Brief an seinen Opa [schreiben].'),
    S('s29', 'lesen', 0, 'Ich [lese] ein Buch über Haie.', 'Ich [las] ein Buch über Haie.', 'Ich [habe] ein Buch über Haie [gelesen].', 'Ich [werde] ein Buch über Haie [lesen].'),
    S('s30', 'sehen', 3, 'Wir [sehen] einen Regenbogen.', 'Wir [sahen] einen Regenbogen.', 'Wir [haben] einen Regenbogen [gesehen].', 'Wir [werden] einen Regenbogen [sehen].'),
    S('s31', 'geben', 2, 'Mama [gibt] mir einen Apfel.', 'Mama [gab] mir einen Apfel.', 'Mama [hat] mir einen Apfel [gegeben].', 'Mama [wird] mir einen Apfel [geben].'),
    S('s32', 'nehmen', 1, 'Du [nimmst] den großen Ball.', 'Du [nahmst] den großen Ball.', 'Du [hast] den großen Ball [genommen].', 'Du [wirst] den großen Ball [nehmen].'),
    S('s33', 'rufen', 2, 'Lina [ruft] ihren Hund.', 'Lina [rief] ihren Hund.', 'Lina [hat] ihren Hund [gerufen].', 'Lina [wird] ihren Hund [rufen].'),
    S('s34', 'schlafen', 2, 'Das Baby [schläft] im Kinderwagen.', 'Das Baby [schlief] im Kinderwagen.', 'Das Baby [hat] im Kinderwagen [geschlafen].', 'Das Baby [wird] im Kinderwagen [schlafen].'),
    S('s35', 'springen', 5, 'Die Kinder [springen] ins Wasser.', 'Die Kinder [sprangen] ins Wasser.', 'Die Kinder [sind] ins Wasser [gesprungen].', 'Die Kinder [werden] ins Wasser [springen].'),
    S('s36', 'fallen', 2, 'Ein Blatt [fällt] vom Baum.', 'Ein Blatt [fiel] vom Baum.', 'Ein Blatt [ist] vom Baum [gefallen].', 'Ein Blatt [wird] vom Baum [fallen].'),
    S('s37', 'bringen', 0, 'Ich [bringe] meiner Lehrerin ein Bild.', 'Ich [brachte] meiner Lehrerin ein Bild.', 'Ich [habe] meiner Lehrerin ein Bild [gebracht].', 'Ich [werde] meiner Lehrerin ein Bild [bringen].'),
    S('s38', 'denken', 0, 'Ich [denke] an meinen Freund.', 'Ich [dachte] an meinen Freund.', 'Ich [habe] an meinen Freund [gedacht].', 'Ich [werde] an meinen Freund [denken].'),
    S('s39', 'werfen', 2, 'Kai [wirft] den Ball ins Tor.', 'Kai [warf] den Ball ins Tor.', 'Kai [hat] den Ball ins Tor [geworfen].', 'Kai [wird] den Ball ins Tor [werfen].'),
    S('s40', 'helfen', 1, 'Du [hilfst] mir beim Aufräumen.', 'Du [halfst] mir beim Aufräumen.', 'Du [hast] mir beim Aufräumen [geholfen].', 'Du [wirst] mir beim Aufräumen [helfen].'),
    S('s41', 'bleiben', 3, 'Wir [bleiben] bei Regen im Haus.', 'Wir [blieben] bei Regen im Haus.', 'Wir [sind] bei Regen im Haus [geblieben].', 'Wir [werden] bei Regen im Haus [bleiben].'),
    S('s42', 'haben', 0, 'Ich [habe] großen Hunger.', 'Ich [hatte] großen Hunger.', 'Ich [habe] großen Hunger [gehabt].', 'Ich [werde] großen Hunger [haben].'),
    S('s43', 'sein', 2, 'Der Tee [ist] sehr heiß.', 'Der Tee [war] sehr heiß.', 'Der Tee [ist] sehr heiß [gewesen].', 'Der Tee [wird] sehr heiß [sein].')
  ];

  /* ---------- Sätze mit Hinweiswort (Zeitform erkennen, leicht) ---------- */
  const H = (id, verb, person, zeit, satz, hinweis) => ({ id, verb, person, zeit, satz, hinweis });
  const HINWEIS_SAETZE = [
    H('h01', 'malen', 0, 'praesens', 'Ich [male] gerade ein Bild.', 'gerade'),
    H('h02', 'spielen', 5, 'praesens', 'Jetzt [spielen] die Kinder Fangen.', 'Jetzt'),
    H('h03', 'trinken', 2, 'praesens', 'Mei [trinkt] jeden Morgen Tee.', 'jeden Morgen'),
    H('h04', 'lesen', 3, 'praesens', 'Wir [lesen] gerade ein Buch.', 'gerade'),
    H('h05', 'laufen', 2, 'praesens', 'Jetzt [läuft] Finn nach Hause.', 'Jetzt'),
    H('h06', 'malen', 0, 'praeteritum', 'Gestern [malte] ich ein Bild.', 'Gestern'),
    H('h07', 'spielen', 5, 'praeteritum', 'Gestern [spielten] die Kinder Fangen.', 'Gestern'),
    H('h08', 'essen', 0, 'praeteritum', 'Letzte Woche [aß] ich Nudeln.', 'Letzte Woche'),
    H('h09', 'gehen', 0, 'praeteritum', 'Am Sonntag [ging] ich zu meiner Oma.', 'Am Sonntag'),
    H('h10', 'finden', 2, 'praeteritum', 'Gestern [fand] Lina eine Muschel.', 'Gestern'),
    H('h11', 'malen', 0, 'perfekt', 'Gestern [habe] ich ein Bild [gemalt].', 'Gestern'),
    H('h12', 'gehen', 0, 'perfekt', 'Am Sonntag [bin] ich zu meiner Oma [gegangen].', 'Am Sonntag'),
    H('h13', 'bauen', 3, 'perfekt', 'Letzte Woche [haben] wir eine Burg [gebaut].', 'Letzte Woche'),
    H('h14', 'kochen', 2, 'perfekt', 'Gestern [hat] Mama Suppe [gekocht].', 'Gestern'),
    H('h15', 'springen', 3, 'perfekt', 'Am Samstag [sind] wir ins Meer [gesprungen].', 'Am Samstag')
  ];

  /* ---------- Geschichten (Umschreiben, Zeitfehler) ---------- */
  const GESCHICHTEN = [
    { id: 'strand', titel: 'Am Meer', art: 'regelmaessig', saetze: [
      S('g-strand-1', 'reisen', 3, 'Wir [reisen] ans Meer.', 'Wir [reisten] ans Meer.', 'Wir [sind] ans Meer [gereist].'),
      S('g-strand-2', 'bauen', 2, 'Papa [baut] eine Sandburg.', 'Papa [baute] eine Sandburg.', 'Papa [hat] eine Sandburg [gebaut].'),
      S('g-strand-3', 'suchen', 0, 'Ich [suche] Muscheln.', 'Ich [suchte] Muscheln.', 'Ich [habe] Muscheln [gesucht].'),
      S('g-strand-4', 'spielen', 2, 'Meine Schwester [spielt] im Wasser.', 'Meine Schwester [spielte] im Wasser.', 'Meine Schwester [hat] im Wasser [gespielt].'),
      S('g-strand-5', 'kaufen', 2, 'Mama [kauft] ein Eis für uns.', 'Mama [kaufte] ein Eis für uns.', 'Mama [hat] ein Eis für uns [gekauft].'),
      S('g-strand-6', 'lachen', 3, 'Wir [lachen] viel.', 'Wir [lachten] viel.', 'Wir [haben] viel [gelacht].')
    ] },
    { id: 'zoo', titel: 'Im Zoo', art: 'stammaenderung', saetze: [
      S('g-zoo-1', 'gehen', 2, 'Die Klasse [geht] in den Zoo.', 'Die Klasse [ging] in den Zoo.', 'Die Klasse [ist] in den Zoo [gegangen].'),
      S('g-zoo-2', 'sehen', 3, 'Wir [sehen] einen Tiger.', 'Wir [sahen] einen Tiger.', 'Wir [haben] einen Tiger [gesehen].'),
      S('g-zoo-3', 'schlafen', 2, 'Der Tiger [schläft] im Schatten.', 'Der Tiger [schlief] im Schatten.', 'Der Tiger [hat] im Schatten [geschlafen].'),
      S('g-zoo-4', 'finden', 2, 'Lina [findet] eine Feder.', 'Lina [fand] eine Feder.', 'Lina [hat] eine Feder [gefunden].'),
      S('g-zoo-5', 'essen', 3, 'Wir [essen] unser Brot auf einer Bank.', 'Wir [aßen] unser Brot auf einer Bank.', 'Wir [haben] unser Brot auf einer Bank [gegessen].'),
      S('g-zoo-6', 'singen', 3, 'Danach [singen] wir im Bus.', 'Danach [sangen] wir im Bus.', 'Danach [haben] wir im Bus [gesungen].')
    ] },
    { id: 'ball', titel: 'Der Ball im Teich', art: 'gemischt', saetze: [
      S('g-ball-1', 'spielen', 2, 'Finn [spielt] mit seinem Ball.', 'Finn [spielte] mit seinem Ball.', 'Finn [hat] mit seinem Ball [gespielt].'),
      S('g-ball-2', 'fallen', 2, 'Der Ball [fällt] in den Teich.', 'Der Ball [fiel] in den Teich.', 'Der Ball [ist] in den Teich [gefallen].'),
      S('g-ball-3', 'rufen', 2, 'Finn [ruft] seine Schwester.', 'Finn [rief] seine Schwester.', 'Finn [hat] seine Schwester [gerufen].'),
      S('g-ball-4', 'holen', 2, 'Sie [holt] einen langen Stock.', 'Sie [holte] einen langen Stock.', 'Sie [hat] einen langen Stock [geholt].'),
      S('g-ball-5', 'bringen', 5, 'Zusammen [bringen] sie den Ball ans Ufer.', 'Zusammen [brachten] sie den Ball ans Ufer.', 'Zusammen [haben] sie den Ball ans Ufer [gebracht].'),
      S('g-ball-6', 'lachen', 2, 'Finn [lacht] laut.', 'Finn [lachte] laut.', 'Finn [hat] laut [gelacht].')
    ] },
    { id: 'regen', titel: 'Ein Regentag', art: 'gemischt', saetze: [
      S('g-regen-1', 'bleiben', 3, 'Wir [bleiben] bei Regen im Haus.', 'Wir [blieben] bei Regen im Haus.', 'Wir [sind] bei Regen im Haus [geblieben].'),
      S('g-regen-2', 'lesen', 0, 'Ich [lese] ein Buch über Haie.', 'Ich [las] ein Buch über Haie.', 'Ich [habe] ein Buch über Haie [gelesen].'),
      S('g-regen-3', 'malen', 2, 'Mein Bruder [malt] einen Hai.', 'Mein Bruder [malte] einen Hai.', 'Mein Bruder [hat] einen Hai [gemalt].'),
      S('g-regen-4', 'kochen', 2, 'Mama [kocht] Tee für alle.', 'Mama [kochte] Tee für alle.', 'Mama [hat] Tee für alle [gekocht].'),
      S('g-regen-5', 'schreiben', 0, 'Am Abend [schreibe] ich in mein Tagebuch.', 'Am Abend [schrieb] ich in mein Tagebuch.', 'Am Abend [habe] ich in mein Tagebuch [geschrieben].'),
      S('g-regen-6', 'gehen', 0, 'Dann [gehe] ich ins Bett.', 'Dann [ging] ich ins Bett.', 'Dann [bin] ich ins Bett [gegangen].')
    ] }
  ];

  /* ---------- Behauptungen von Nuri (Kann das stimmen?, knifflig), von Hand geschrieben ---------- */
  const B = (id, behauptung, stimmt, richtig, falsch1, falsch2, schluss) => ({
    id, behauptung, stimmt,
    begruendungen: [{ text: richtig, richtig: true }, { text: falsch1, richtig: false }, { text: falsch2, richtig: false }],
    schluss
  });
  const BEHAUPTUNGEN = [
    B('b01', 'In dem Satz „Gestern gehe ich ins Kino.“ passt die Zeitform.', false,
      '„Gestern“ ist vorbei, aber „gehe“ ist Präsens. Richtig ist: Gestern ging ich ins Kino.',
      'Kino ist immer im Präsens.',
      'Der Satz ist zu kurz für eine Zeitform.',
      'Das Verb muss zur Zeit passen. Gestern ging ich ins Kino.'),
    B('b02', 'Ein Satz ohne „gestern“ kann trotzdem von früher erzählen.', true,
      'Das Verb zeigt die Zeitform, auch ohne Hinweiswort: Ich fand eine Muschel.',
      'Nur „gestern“ zeigt, dass etwas vorbei ist.',
      'Ohne Hinweiswort ist jeder Satz im Präsens.',
      'Hinweiswörter helfen. Aber das Verb verrät die Zeitform immer.'),
    B('b03', 'Im Perfekt brauche ich immer „haben“.', false,
      'Manche Verben brauchen „sein“: Ich bin gegangen. Wir sind gesprungen.',
      '„Haben“ und „sein“ sind dasselbe Wort.',
      'Im Perfekt gibt es weder haben noch sein.',
      'Im Perfekt steht „haben“ oder „sein“. Bei gehen, laufen und springen ist es „sein“.'),
    B('b04', 'Bei manchen Verben ändert sich im Präteritum der Wortstamm.', true,
      'Zum Beispiel: gehen – ging, finden – fand, singen – sang.',
      'Der Wortstamm bleibt immer gleich, nur die Endung kommt dazu.',
      'Der Wortstamm ändert sich nur im Präsens.',
      'Viele Verben bekommen -te: malte. Andere ändern den Stamm: ging.'),
    B('b05', '„Mei fand eine Muschel.“ Das ist Präteritum.', true,
      '„fand“ ist die Präteritumform von „finden“. Es ist vorbei.',
      '„fand“ ist Präsens, weil kein „gestern“ dasteht.',
      'Das ist Perfekt, weil es eine Muschel ist.',
      'Genau: fand ist Präteritum. Das Verb ist nur ein Wort.'),
    B('b06', '„Wir haben ein Lied gesungen.“ Das ist Präsens, weil „haben“ im Präsens steht.', false,
      '„haben“ und „gesungen“ gehören zusammen. Das ist das Perfekt.',
      'Ein Lied ist immer Präsens.',
      'Der Satz hat gar kein Verb.',
      'haben oder sein und das zweite Verb bilden zusammen das Perfekt. Es erzählt von früher.'),
    B('b07', 'Das Präteritum findet man oft in geschriebenen Geschichten.', true,
      'In Büchern und Geschichten steht oft: Es war einmal … Er lief los.',
      'Das Präteritum gibt es nur beim Sprechen.',
      'Geschichten stehen immer im Perfekt.',
      'Wer erzählt, sagt oft Perfekt. Wer schreibt, nimmt oft das Präteritum.'),
    B('b08', 'Im Präteritum hat das Verb immer zwei Teile.', false,
      'Im Präteritum ist das Verb ein Wort: ich lief, wir malten.',
      'Im Präteritum hat das Verb immer drei Teile.',
      'Im Präteritum gibt es kein Verb.',
      'Zwei Teile hat das Perfekt: ich bin gelaufen. Das Präteritum hat einen: ich lief.'),
    B('b09', '„ich malte“ und „ich habe gemalt“ erzählen beide von früher.', true,
      'Beides ist vorbei: einmal Präteritum, einmal Perfekt.',
      '„ich habe gemalt“ erzählt von jetzt.',
      '„ich malte“ erzählt von morgen.',
      'Präteritum und Perfekt sind zwei Wege, von früher zu erzählen.'),
    B('b10', 'Im Perfekt steht der zweite Teil des Verbs oft am Satzende.', true,
      'Zum Beispiel: Ich habe gestern ein Bild gemalt.',
      'Beide Teile stehen immer direkt nebeneinander.',
      'Der zweite Teil steht immer am Satzanfang.',
      'haben oder sein steht vorn, der zweite Teil wandert nach hinten.')
  ];

  /* ---------- Zerlegen: Satz → Wörter mit Kennzeichen ---------- */
  /* Ergebnis: [{ text, zeichen, verb, teil }], zeichen = Satzzeichen danach, teil = 0/1 bei zweiteiligem Verb */
  function zerlege(satz) {
    const aus = [];
    let teil = 0;
    for (const roh of satz.split(' ')) {
      const m = /^(\[)?([^\][.,!?]+)(\])?([.,!?]*)$/.exec(roh);
      if (!m) throw new Error('Satz nicht lesbar: ' + satz);
      const verb = !!(m[1] && m[3]);
      aus.push({ text: m[2], zeichen: m[4] || '', verb, teil: verb ? teil++ : -1 });
    }
    return aus;
  }
  /* Klammern weg: der Satz als Text */
  const text = satz => satz.replace(/[[\]]/g, '');
  /* Verbteile in der Klammer */
  const verbteile = satz => zerlege(satz).filter(w => w.verb).map(w => w.text);

  const alleSaetze = () => SAETZE.concat(...GESCHICHTEN.map(g => g.saetze));

  ZE.saetze = { SAETZE, HINWEIS_SAETZE, GESCHICHTEN, BEHAUPTUNGEN, zerlege, text, verbteile, alleSaetze };
})();
