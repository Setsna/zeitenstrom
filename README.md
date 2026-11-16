# Zeitenstrom

Lernplattform zu den **Zeitformen der Verben** für die Klasse 3 (8 bis 9 Jahre): Präsens, Präteritum und Perfekt. Das Futur folgt als Zusatz für Klasse 4.
Die Kinder finden das Verb, setzen Formen aus Kacheln zusammen, schreiben Geschichten Satz für Satz in die Vergangenheit um und finden Zeitfehler.
Begleiter ist Nuri, ein Nautilus. Es gibt keine Punkte, keinen Zeitdruck und keine Ranglisten.

**Adresse:** https://setsna.github.io/zeitenstrom/ (noch nicht veröffentlicht)

Schwesterseite der [Lernlagune](https://lernlagune.de).

## Stationen

Jede Station hat drei Stufen (leicht, mittel, knifflig). Eine Runde hat sechs Aufgaben, ab fünf geschafften gibt es einen Stempel.

| Station | Was geübt wird |
|---|---|
| Zeitform erkennen | Verb antippen, Zeitform wählen (erst Alltagswort, dann Fachwort), beim Perfekt beide Teile finden |
| Präteritum bilden | Endung wählen (mal + te), Formen mit Stammänderung (ging), Tabelle mit sechs Personen |
| Perfekt bilden | haben oder sein und den zweiten Teil einsetzen |
| Geschichte umschreiben | Geschichte Satz für Satz ins Präteritum, knifflig ins Perfekt |
| Zeitfehler finden | in einer Geschichte von gestern das Verb für jetzt finden und verbessern |
| Kann das stimmen? | Nuri behauptet etwas über Verben, das Kind prüft es und begründet |

Dazu ein Logbuch mit allen Stempeln und „Das kann ich schon“ und eine Urkunde als PDF, die auf dem Gerät entsteht.

Grundlage ist der Lehrplan Thüringen Deutsch Grundschule (Lernbereich „Sprache und Sprachgebrauch untersuchen“). Alle Texte, Sätze und Aufgaben sind selbst geschrieben.

## Fachliche Grundsätze

- Alle Formen stehen in einer Verbtabelle (`js/verben.js`). Jede Antwort wird gegen diese Tabelle geprüft, nie gegen den Aufgabentext.
- Jeder Satz ist von Hand in allen drei Zeitformen geschrieben (`js/saetze.js`) und wird automatisch gegen die Tabelle geprüft.
- Kacheln sind nur echte Formen. Fehlformen kommen nicht vor.
- Erst probieren, dann das Fachwort.

## Was liegt wo?

| Datei | Inhalt |
|---|---|
| `index.html` | Grundgerüst der Seite (eine Seite für Anmeldung, Startseite, Stationen, Logbuch) |
| `js/config.js` | Alle Einstellungen: Stationen, Stufen, Aufgaben je Runde |
| `js/verben.js`, `js/saetze.js` | Verbtabelle, Sätze, Geschichten, Behauptungen |
| `js/aufgaben.js`, `js/zufall.js` | Aufgaben aller Stationen und Prüflogik, Zufall für die Auswahl |
| `js/kacheln.js` | Kacheln in Lücken setzen (Tippen, Tasten, Ziehen) |
| `js/station-lauf.js`, `js/station-teile.js` | gemeinsamer Ablauf und gemeinsame Teile der Stationen |
| `js/stationen/` | je Station eine kurze Beschreibung, die sich einträgt |
| `js/logbuch.js`, `js/urkunde.js` | Logbuch und Urkunde (PDF ohne Bibliothek) |
| `js/ze-stand.js`, `js/konto-*.js` | Stand des Kindes und gemeinsames Konto der Lernlagune |
| `js/app.js`, `js/erwachsene.js` | Ansichten, Bedienung, Erwachsenenbereich |
| `css/` | Farben und Maße (`tokens.css`), Seite, Stationen |
| `bilder/`, `schriften/` | Nuri, Hintergrund, App-Symbole; Andika und Libre Caslon Text (OFL, Lizenztexte liegen bei) |

## Anmeldung und Daten

Die Kinder melden sich mit demselben Zugangscode an wie im Perlentaucher. Gespeichert werden in Firebase (`ze_stand/<code>`) nur Stempel und die Zahl der geschafften Aufgaben je Station und Stufe, kein Vorname, keine Antworten. Die Datenbankregeln erlauben genau die 21 festen Schlüssel (7 Stationen mit Futur, je 3 Stufen). Zurücksetzen und Löschen gehen über den Lehrerbereich des Perlentauchers. Einzelheiten stehen in `datenschutz.html`.

## Veröffentlichen

- Hinter jeder lokalen `js`- und `css`-Datei steht `?v=N`. Bei jeder Änderung wird die Zahl in allen HTML-Dateien hochgezählt, sonst laden Geräte alte Fassungen.
- Die `.gitignore` sperrt alles und gibt nur die fertige Seite frei. Neue Dateien oder Ordner auf oberster Ebene dort eintragen.
- Werkzeuge und Tests liegen außerhalb dieses Repositorys und gehen nicht ins Netz.
