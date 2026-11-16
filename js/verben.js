/* Zeitenstrom: die Verbtabelle (Etappe 1b).
   Klassisches Skript, legt window.ZE.verben an.

   VON INGO FREIGEGEBEN (16.11.2026), nach Abgleich mit duden.de. Neue oder geänderte Zeilen muss Ingo wieder bestätigen.
   Abgleich mit duden.de (Konjugationstabellen, 16.11.2026): Präsens, Präteritum und Perfekt (ich) aller Verben außer „sehen“
   stimmen mit Duden überein. Für „sehen“ hat duden.de keine Konjugationstabelle (nicht abgeglichen).
   Zwei Formen laut Duden: du aßest/aßt, du fandest/fandst, du lasest/last („seltener last“). klettern und springen:
   Duden-Tabelle „bin/habe“, im Wörterbucheintrag für Bewegung zu einem Ort „ist“ (so in allen Sätzen hier).
   Die Liste ist selbst geschrieben, nicht aus dem Zebra-Buch und nicht maschinell gebeugt.
   Liste zum Prüfen: Dateien/Beispiele-Entwuerfe/verbliste.md (wird aus dieser Datei erzeugt, tools/verbliste.html).

   Eine Zeile: Grundform, Art, Hilfsverb, Partizip II, Präsens (6 Personen), Präteritum (6 Personen).
   Personen in dieser Reihenfolge: ich, du, er/sie/es, wir, ihr, sie.
   Gibt es für eine Person zwei richtige Formen, stehen beide mit | getrennt (die erste wird gezeigt, beide zählen).
   Bewusst NICHT in der Liste (regional „hat“ oder „ist“): sitzen, stehen, liegen, schwimmen.
   Bewusst nicht in der Liste (Hilfsverb hängt vom Objekt ab): fahren, fliegen.
   Bewusst nicht in der Liste: trennbare Verben (aufstehen, mitbringen) und Verben ohne ge- (besuchen, erzählen).
   Fehlformen („gehte“, „gegangt“) gibt es in dieser Datei nicht. */
(() => {
  'use strict';
  const ZE = window.ZE = window.ZE || {};

  const PERSONEN = ['ich', 'du', 'er/sie/es', 'wir', 'ihr', 'sie'];
  const HILFSVERB = {
    haben: ['habe', 'hast', 'hat', 'haben', 'habt', 'haben'],
    sein: ['bin', 'bist', 'ist', 'sind', 'seid', 'sind']
  };
  /* Futur (Zusatz Klasse 4): werden + Grundform. werden nach duden.de/konjugation/werden (16.11.2026 nicht eigens abgeglichen, Standardformen) */
  const WERDEN = ['werde', 'wirst', 'wird', 'werden', 'werdet', 'werden'];

  /* [Grundform, Art, Hilfsverb, Partizip, 'Präsens 6x', 'Präteritum 6x'] */
  const ZEILEN = [
    /* regelmäßig: Präteritum mit -te, Wortstamm bleibt */
    ['malen', 'regelmaessig', 'haben', 'gemalt', 'male malst malt malen malt malen', 'malte maltest malte malten maltet malten'],
    ['spielen', 'regelmaessig', 'haben', 'gespielt', 'spiele spielst spielt spielen spielt spielen', 'spielte spieltest spielte spielten spieltet spielten'],
    ['lachen', 'regelmaessig', 'haben', 'gelacht', 'lache lachst lacht lachen lacht lachen', 'lachte lachtest lachte lachten lachtet lachten'],
    ['kochen', 'regelmaessig', 'haben', 'gekocht', 'koche kochst kocht kochen kocht kochen', 'kochte kochtest kochte kochten kochtet kochten'],
    ['bauen', 'regelmaessig', 'haben', 'gebaut', 'baue baust baut bauen baut bauen', 'baute bautest baute bauten bautet bauten'],
    ['suchen', 'regelmaessig', 'haben', 'gesucht', 'suche suchst sucht suchen sucht suchen', 'suchte suchtest suchte suchten suchtet suchten'],
    ['holen', 'regelmaessig', 'haben', 'geholt', 'hole holst holt holen holt holen', 'holte holtest holte holten holtet holten'],
    ['hören', 'regelmaessig', 'haben', 'gehört', 'höre hörst hört hören hört hören', 'hörte hörtest hörte hörten hörtet hörten'],
    ['machen', 'regelmaessig', 'haben', 'gemacht', 'mache machst macht machen macht machen', 'machte machtest machte machten machtet machten'],
    ['lernen', 'regelmaessig', 'haben', 'gelernt', 'lerne lernst lernt lernen lernt lernen', 'lernte lerntest lernte lernten lerntet lernten'],
    ['tanzen', 'regelmaessig', 'haben', 'getanzt', 'tanze tanzt tanzt tanzen tanzt tanzen', 'tanzte tanztest tanzte tanzten tanztet tanzten'],
    ['kaufen', 'regelmaessig', 'haben', 'gekauft', 'kaufe kaufst kauft kaufen kauft kaufen', 'kaufte kauftest kaufte kauften kauftet kauften'],
    ['wohnen', 'regelmaessig', 'haben', 'gewohnt', 'wohne wohnst wohnt wohnen wohnt wohnen', 'wohnte wohntest wohnte wohnten wohntet wohnten'],
    ['fragen', 'regelmaessig', 'haben', 'gefragt', 'frage fragst fragt fragen fragt fragen', 'fragte fragtest fragte fragten fragtet fragten'],
    ['sagen', 'regelmaessig', 'haben', 'gesagt', 'sage sagst sagt sagen sagt sagen', 'sagte sagtest sagte sagten sagtet sagten'],
    ['putzen', 'regelmaessig', 'haben', 'geputzt', 'putze putzt putzt putzen putzt putzen', 'putzte putztest putzte putzten putztet putzten'],
    ['warten', 'regelmaessig', 'haben', 'gewartet', 'warte wartest wartet warten wartet warten', 'wartete wartetest wartete warteten wartetet warteten'],
    ['reisen', 'regelmaessig', 'sein', 'gereist', 'reise reist reist reisen reist reisen', 'reiste reistest reiste reisten reistet reisten'],
    ['wandern', 'regelmaessig', 'sein', 'gewandert', 'wandere wanderst wandert wandern wandert wandern', 'wanderte wandertest wanderte wanderten wandertet wanderten'],
    ['klettern', 'regelmaessig', 'sein', 'geklettert', 'klettere kletterst klettert klettern klettert klettern', 'kletterte klettertest kletterte kletterten klettertet kletterten'],

    /* mit Stammänderung: der Wortstamm ändert sich im Präteritum (bringen, denken: Stamm ändert sich, Endung -te) */
    ['gehen', 'stammaenderung', 'sein', 'gegangen', 'gehe gehst geht gehen geht gehen', 'ging gingst ging gingen gingt gingen'],
    ['laufen', 'stammaenderung', 'sein', 'gelaufen', 'laufe läufst läuft laufen lauft laufen', 'lief liefst lief liefen lieft liefen'],
    ['kommen', 'stammaenderung', 'sein', 'gekommen', 'komme kommst kommt kommen kommt kommen', 'kam kamst kam kamen kamt kamen'],
    ['springen', 'stammaenderung', 'sein', 'gesprungen', 'springe springst springt springen springt springen', 'sprang sprangst sprang sprangen sprangt sprangen'],
    ['fallen', 'stammaenderung', 'sein', 'gefallen', 'falle fällst fällt fallen fallt fallen', 'fiel fielst fiel fielen fielt fielen'],
    ['bleiben', 'stammaenderung', 'sein', 'geblieben', 'bleibe bleibst bleibt bleiben bleibt bleiben', 'blieb bliebst blieb blieben bliebt blieben'],
    ['sein', 'stammaenderung', 'sein', 'gewesen', 'bin bist ist sind seid sind', 'war warst war waren wart waren'],
    ['essen', 'stammaenderung', 'haben', 'gegessen', 'esse isst isst essen esst essen', 'aß aßest|aßt aß aßen aßt aßen'],
    ['trinken', 'stammaenderung', 'haben', 'getrunken', 'trinke trinkst trinkt trinken trinkt trinken', 'trank trankst trank tranken trankt tranken'],
    ['finden', 'stammaenderung', 'haben', 'gefunden', 'finde findest findet finden findet finden', 'fand fandest|fandst fand fanden fandet fanden'],
    ['singen', 'stammaenderung', 'haben', 'gesungen', 'singe singst singt singen singt singen', 'sang sangst sang sangen sangt sangen'],
    ['schreiben', 'stammaenderung', 'haben', 'geschrieben', 'schreibe schreibst schreibt schreiben schreibt schreiben', 'schrieb schriebst schrieb schrieben schriebt schrieben'],
    ['lesen', 'stammaenderung', 'haben', 'gelesen', 'lese liest liest lesen lest lesen', 'las lasest|last las lasen last lasen'],
    ['sehen', 'stammaenderung', 'haben', 'gesehen', 'sehe siehst sieht sehen seht sehen', 'sah sahst sah sahen saht sahen'],
    ['geben', 'stammaenderung', 'haben', 'gegeben', 'gebe gibst gibt geben gebt geben', 'gab gabst gab gaben gabt gaben'],
    ['nehmen', 'stammaenderung', 'haben', 'genommen', 'nehme nimmst nimmt nehmen nehmt nehmen', 'nahm nahmst nahm nahmen nahmt nahmen'],
    ['rufen', 'stammaenderung', 'haben', 'gerufen', 'rufe rufst ruft rufen ruft rufen', 'rief riefst rief riefen rieft riefen'],
    ['schlafen', 'stammaenderung', 'haben', 'geschlafen', 'schlafe schläfst schläft schlafen schlaft schlafen', 'schlief schliefst schlief schliefen schlieft schliefen'],
    ['werfen', 'stammaenderung', 'haben', 'geworfen', 'werfe wirfst wirft werfen werft werfen', 'warf warfst warf warfen warft warfen'],
    ['helfen', 'stammaenderung', 'haben', 'geholfen', 'helfe hilfst hilft helfen helft helfen', 'half halfst half halfen halft halfen'],
    ['bringen', 'stammaenderung', 'haben', 'gebracht', 'bringe bringst bringt bringen bringt bringen', 'brachte brachtest brachte brachten brachtet brachten'],
    ['denken', 'stammaenderung', 'haben', 'gedacht', 'denke denkst denkt denken denkt denken', 'dachte dachtest dachte dachten dachtet dachten'],
    ['haben', 'stammaenderung', 'haben', 'gehabt', 'habe hast hat haben habt haben', 'hatte hattest hatte hatten hattet hatten']
  ];

  const zelle = s => s.split('|');
  const VERBEN = {};
  for (const [grundform, art, hilfsverb, partizip, praes, praet] of ZEILEN) {
    VERBEN[grundform] = {
      grundform, art, hilfsverb, partizip,
      praesens: praes.split(' ').map(zelle),
      praeteritum: praet.split(' ').map(zelle)
    };
  }

  /* Alle richtigen Formen (Liste) für Verb, Zeitform, Person (0 bis 5).
     zeit: 'praesens' | 'praeteritum' | 'perfekt' (dann zwei Teile: [Hilfsverb, Partizip]) */
  function formen(grundform, zeit, person) {
    const v = VERBEN[grundform];
    if (!v || !Number.isInteger(person) || person < 0 || person > 5) return [];
    if (zeit === 'praesens' || zeit === 'praeteritum') return v[zeit][person].slice();
    if (zeit === 'perfekt') return [HILFSVERB[v.hilfsverb][person] + ' ' + v.partizip];
    if (zeit === 'futur') return [WERDEN[person] + ' ' + v.grundform];
    return [];
  }
  /* Die gezeigte Form (die erste) */
  const form = (g, zeit, p) => formen(g, zeit, p)[0];

  /* Wortstamm einer regelmäßigen Präteritumform und die Endung je Person (für die Kacheln „mal + te“).
     Gilt nur, wenn die Form mit der Endung aufgeht (nicht bei warten: wart + ete). */
  const ENDUNG = ['te', 'test', 'te', 'ten', 'tet', 'ten'];
  function stammUndEndung(grundform) {
    const v = VERBEN[grundform];
    if (!v || v.art !== 'regelmaessig') return null;
    const f = v.praeteritum[0][0];
    if (!f.endsWith('te')) return null;
    const stamm = f.slice(0, -2);
    for (let p = 0; p < 6; p++) if (v.praeteritum[p][0] !== stamm + ENDUNG[p]) return null;
    return { stamm, endungen: ENDUNG.slice() };
  }

  ZE.verben = {
    PERSONEN, HILFSVERB, WERDEN, ENDUNG, ZEILEN, VERBEN,
    liste: () => Object.values(VERBEN),
    gib: g => VERBEN[g] || null,
    formen, form, stammUndEndung
  };
})();
