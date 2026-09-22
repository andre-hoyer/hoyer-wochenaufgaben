# Netlify-Einrichtung

1. Dieses Projekt in ein GitHub-Repository hochladen und bei Netlify über **Add new project → Import an existing project** verbinden.
2. Netlify erkennt `netlify.toml`; es ist kein Build-Befehl nötig. Das Veröffentlichungsverzeichnis ist `.`.
3. Unter **Project configuration → Environment variables** eine Variable anlegen:
   - Name: `FAMILY_KEY`
   - Wert: eine zufällige Zeichenfolge mit mindestens 32 Zeichen
4. Danach unter **Deploys** einen neuen Deploy anstoßen, damit die Variable verfügbar ist.
5. Die App einmal mit der Familienkennung hinter `#` öffnen, zum Beispiel:
   `https://DEINE-SEITE.netlify.app/#DEINE-FAMILIENKENNUNG`
6. Genau diesen vollständigen Link auf allen Geräten verwenden oder als App zum Home-Bildschirm hinzufügen.

Die Familienkennung gehört nicht in das GitHub-Repository. Sie muss exakt mit `FAMILY_KEY` in Netlify übereinstimmen.
