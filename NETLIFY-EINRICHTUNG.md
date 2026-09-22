# Netlify-Einrichtung

1. Dieses Projekt in ein GitHub-Repository hochladen und bei Netlify über **Add new project → Import an existing project** verbinden.
2. Netlify erkennt `netlify.toml`; es ist kein Build-Befehl nötig. Das Veröffentlichungsverzeichnis ist `.`.
3. `https://DEINE-SEITE.netlify.app/password-setup.html` öffnen, ein gemeinsames Passwort eingeben und den erzeugten Hash kopieren.
4. Unter **Project configuration → Environment variables** anlegen:
   - `APP_USERNAME`: gemeinsamer Benutzername
   - `APP_PASSWORD_HASH`: erzeugter Hash
   - `SESSION_SECRET`: zufällige Zeichenfolge mit mindestens 32 Zeichen
5. Für Passwort-Hash und Sitzungsschlüssel **Contains secret values** aktivieren und mindestens den Scope **Functions** sowie den Production-Kontext konfigurieren.
6. Unter **Deploys** einen neuen Deploy anstoßen.
7. Den normalen Link auf allen Geräten öffnen und die gemeinsamen Zugangsdaten über Apples Passwort-App speichern beziehungsweise teilen.
