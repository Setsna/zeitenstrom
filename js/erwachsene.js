/* Zeitenstrom: Texte für den Erwachsenenbereich (zwei Aufklapper unter der Startseite, Aufbau wie Chancenbucht).
   VON INGO FREIGEGEBEN (16.11.2026). Zweitfassung zum Lesen: Dateien/Beispiele-Entwuerfe/logbuch-erwachsene-urkunde.md.
   Keine Seitenangaben zum Lehrwerk (Ingo, 16.11.2026). Keine Texte aus dem Lehrwerk.
   Abschnitte: titel, absaetze [Text], liste [[fett, Text]], tabelle { kopf: [..], zeilen: [[..]] }, datenschutzLink.
   Alles läuft in js/app.js durch esc(), es gibt kein HTML in den Texten. */
(() => {
  'use strict';
  const ZE = window.ZE = window.ZE || {};
  const DATEN = 'Die Kinder melden sich mit ihrem Zugangscode an. Es ist derselbe wie beim Perlentaucher. Gespeichert werden unter diesem Code nur die Stempel und die Zahl der geschafften Aufgaben je Station und Stufe. Antworten, gebaute Sätze und Fehler werden nicht gespeichert. So ist der Stand auf jedem Gerät da, in der Schule und zu Hause. Der Stand liegt zusätzlich im Browser des Geräts, damit auch ohne Internet gearbeitet werden kann. Andere Kinder sehen ihn nicht, eine Auswertung für die Lehrkraft gibt es nicht. Löschen lassen können Sie den Stand über die Lehrkraft.';
  const DATEN_URKUNDE = 'Die Urkunde entsteht auf dem Gerät und wird weder gespeichert noch verschickt.';

  ZE.erwachsene = {
    eltern: {
      titel: 'Für Eltern',
      abschnitte: [
        { titel: 'Worum es geht', absaetze: [
          'Im Zeitenstrom üben Kinder der Klasse 3 die Zeitformen der Verben: Präsens (jetzt), Präteritum und Perfekt (beides für früher).',
          'Viele Kinder tun sich mit dem Präteritum schwer, zum Beispiel mit „ging“, „fand“ oder „aß“. Darauf liegt der Schwerpunkt.',
          'Die Kinder lesen keine Regeln, sie tun etwas: Sie finden das Verb, setzen Formen aus Kacheln zusammen und schreiben Sätze in die Vergangenheit um.'
        ] },
        { titel: 'Die Stationen', liste: [
          ['Zeitform erkennen', 'Das Verb finden und sagen, ob etwas jetzt passiert oder schon vorbei ist.'],
          ['Präteritum bilden', 'Formen wie „malte“ und „ging“ bilden, zuletzt eine ganze Tabelle.'],
          ['Perfekt bilden', 'haben oder sein und den zweiten Teil einsetzen: „habe gemalt“, „bin gegangen“.'],
          ['Geschichte umschreiben', 'Eine kurze Geschichte Satz für Satz in die Vergangenheit setzen.'],
          ['Zeitfehler finden', 'In einer Geschichte von gestern das Verb finden, das nicht passt, und es verbessern.'],
          ['Kann das stimmen?', 'Nuri behauptet etwas über Verben, Ihr Kind prüft es und begründet.'],
          ['Futur (Zusatz für Klasse 4)', 'Mit werden von später erzählen: „Ich werde malen.“ Zählt nicht für die Urkunde.']
        ] },
        { titel: 'Gut zu wissen', absaetze: [
          'Es gibt keinen Zeitdruck und keine Rangliste.',
          'Jede Station hat drei Stufen: leicht, mittel und knifflig. Die Seite empfiehlt eine, Ihr Kind wählt.',
          'Ihr Kind sieht nur richtige Verbformen. Falsche Formen wie „gehte“ kommen nicht vor.'
        ] },
        { titel: 'Tipp für zu Hause', absaetze: [
          'Lassen Sie Ihr Kind vom Wochenende erzählen. Beim Erzählen kommt meist das Perfekt: „Wir sind in den Park gegangen.“',
          'Bitten Sie es danach, zwei Sätze davon so aufzuschreiben wie in einem Buch: „Wir gingen in den Park.“',
          'Spielen Sie „heute und gestern“: Sie sagen „Heute gehe ich“, Ihr Kind antwortet „Gestern ging ich“.'
        ] },
        { titel: 'Daten', absaetze: [DATEN, DATEN_URKUNDE], datenschutzLink: true },
        { titel: 'Der Code', absaetze: [
          'Der Code gehört Ihrem Kind. Wer ihn kennt, kann sich damit anmelden. Auf einem fremden Gerät am Ende bitte auf „Abmelden“ tippen.'
        ] }
      ]
    },
    lehrkraefte: {
      titel: 'Für Lehrkräfte',
      abschnitte: [
        { titel: 'Konzept', absaetze: [
          'Lernbereich „Sprache und Sprachgebrauch untersuchen“: Verben in ausgewählte Tempusformen setzen und die Zeitformen benennen (Präsens, Präteritum, Perfekt; Futur als Zusatz für Klasse 4).',
          'Die Reihenfolge folgt dem Lehrplan: erst mit Sprache probieren, dann betrachten, dann begründen, zuletzt das Fachwort. Die Kinder wählen zuerst mit Alltagswörtern (jetzt, früher, früher mit haben oder sein), das Fachwort erscheint nach der Antwort.',
          'Alle Verbformen stehen in einer eigenen, geprüften Verbtabelle. Jede Antwort wird gegen diese Tabelle geprüft. Jeder Satz ist von Hand in allen drei Zeitformen geschrieben.'
        ] },
        { titel: 'Prinzip und Umsetzung', tabelle: { kopf: ['Prinzip', 'Umsetzung'], zeilen: [
          ['Erst probieren, dann das Fachwort', 'Auswahl mit Alltagswörtern, das Fachwort steht nach der Antwort. In der Stufe knifflig nur noch Fachwörter.'],
          ['Tun statt Regeln lesen', 'Verb antippen, Kacheln in Lücken setzen, Geschichten umschreiben, Fehler finden.'],
          ['Nur richtige Formen', 'Kacheln sind echte Formen des Verbs (andere Zeitform oder Person). Fehlformen wie „gehte“ kommen nicht vor.'],
          ['Zeitform nicht nur über Farbe', 'Jede Zeitform hat ein Wort und ein Zeichen: ein Punkt im Strom vorn (jetzt), hinten (früher), zwei Punkte hinten (zwei Teile).'],
          ['Präteritum als Schwerpunkt', 'Getrennt geübt: mit -te (malte) und mit Stammänderung (ging), dann gemischt in der Tabelle.'],
          ['Regionale Formen', 'Verben, bei denen das Perfekt regional schwankt (sitzen, stehen, liegen, schwimmen), sind nicht in der Liste.'],
          ['Differenzierung', 'Drei Stufen je Station. Gestufte Tipps von Nuri ohne Lösung. Nach zwei Versuchen zeigt die Seite die Lösung.'],
          ['Bedienung', 'Kacheln lassen sich tippen und ziehen, alles geht auch mit der Tastatur.']
        ] } },
        { titel: 'Die Stationen und das Heft', absaetze: [
          'Jede Station hat einen Aufklapper „Am Tisch“ mit einer Idee ohne Gerät, zum Beispiel Verb-Kärtchen, eine Erzählkette oder Fehlerdetektive mit dem eigenen Heft.',
          'Gut passt ein Wechsel: Wochenende mündlich im Perfekt erzählen, dann im Präteritum aufschreiben, dann mit dem Zeitenstrom üben.'
        ] },
        { titel: 'Lehrplanbezug', absaetze: [
          'Lehrplan Thüringen Deutsch Grundschule (Erprobungsfassung), Lernbereich „Sprache und Sprachgebrauch untersuchen“: Verben in ausgewählte Tempusformen setzen; Fachwortschatz Zeitform, Gegenwart/Präsens, Vergangenheit/Präteritum, Perfekt, Zukunft/Futur.',
          'Der Lehrplan trennt hier nicht nach Klasse 3 und 4. Die Zuordnung (Klasse 3: Präsens, Präteritum, Perfekt; Klasse 4: Futur) ist Schulcurriculum.'
        ] },
        { titel: 'Einsatz', absaetze: [
          'Für iPads hoch und quer und für die Tafel. Eine Runde hat sechs Aufgaben.',
          'Stempel gibt es ab fünf geschafften Aufgaben einer Runde. Das Logbuch zeigt, was ein Kind schon kann; mit leicht und mittel in allen Stationen gibt es eine Urkunde.'
        ] },
        { titel: 'Daten', absaetze: [DATEN, 'Zurücksetzen und Löschen gehen über den Lehrerbereich des Perlentauchers.'], datenschutzLink: true }
      ]
    }
  };
})();
