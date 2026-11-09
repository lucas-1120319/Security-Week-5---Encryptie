Gebruikte Technologieën & Keuzes

HTML, CSS & JavaScript: Ik heb gekozen om de applicatie in JavaScript te maken omdat ik hier niet heel vaak in programmeer en het een leuke taal vind. Ik wilde bij deze opdracht direct een visuele voorkant maken, dus dat kon mooi direct in HTML/CSS met JavaScript.

Web Crypto API: Ik heb gekozen om de ingebouwde Web Crypto API (window.crypto.subtle) van de browser te gebruiken. Dit sluit aan bij het principe "Don't roll your own crypto", omdat je gebruikmaakt van een goed geteste en veilige library in plaats van zelf een algoritme te bedenken.

AES-GCM (256-bit): Ik kies voor AES-GCM omdat er in de documentatie wordt aangegeven dat er een ingebouwde authenticatiecontrole in zit. Hierdoor kan de app meteen kijken of het bericht niet veranderd is door iemand anders of dat er een verkeerd wachtwoord is ingevuld.

Hoe de applicatie te starten
Kloon of download deze GitHub repository naar je eigen computer.
Open het bestand index.html direct in je browser (zoals Chrome, Edge of Firefox).
Er is geen ingewikkelde server of npm installatie nodig, alles draait lokaal in de browser.
 Korte uitleg Sleutelbeheer

Omdat de app lokaal in de browser draait zonder server, is gekozen voor wachtwoord-gebaseerd sleutelbeheer:

Sleutel afleiden: Van het ingevulde wachtwoord wordt een basekey gemaakt. Met PBKDF2, SHA-256 en 100.000 iteraties wordt hier een cryptografische sleutel van gemaakt.

Salt & IV: Er wordt een random salt en een IV (Initialization Vector van 12 bytes) gebruikt. De salt zorgt ervoor dat hetzelfde wachtwoord niet dezelfde sleutel geeft, en de IV voorkomt herhalingsaanvallen. De IV en salt hoeven niet geheim te zijn en worden meegegeven in het JSON-packet.

Opslag: De sleutel wordt nergens opgeslagen op de harde schijf of in een database, maar bestaat alleen tijdelijk in het geheugen tijdens het versleutelen of ontsleutelen


gebruikte bronnen:
https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto
https://developer.mozilla.org/en-US/docs/Web/API/Crypto
https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt
https://developer.mozilla.org/en-US/docs/Web/API/CryptoKey
https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/generateKey