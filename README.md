Er is gekozen om de applicatie te maken in Javascript omdat ik hier niet  heel vaak in kan programmeeren en ik vind het wel een leuke taal. Ik wil bij deze opdracht er ook een visuele voorkant bij maken, dus kan dat direct in html/ css met javascript.


Ik heb gekozen om Web Crypto API en subtle crypto te gebruiken. 
Dit doe ik omdat het een simpele symmetrische encryptie is die gebruikt maakt van een ingebouwde algoritme in de browser.

ik kies voor AES-GCM omdat er in de documentatie word aangegeven dat er een ingebouwde authenticatie in zit om te kijken of het bericht niet veranderd is door iemand anders.
https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt



## Sleutelbeheer
In een ideale cryptografische omgeving wordt symmetrische encryptie (zoals AES-256) uitgevoerd met volledig willekeurige sleutels. 
Dit brengt echter het *sleuteldistributieprobleem* met zich mee: 
hoe krijg je die geheime sleutel veilig bij de ontvanger zonder dat een aanvaller deze onderschept?


### De oplossing in deze applicatie:
Omdat deze webapp lokaal in de browser draait zonder complexe server-infrastructuur, is gekozen voor een **wachtwoord-gebaseerd sleutelbeheer**:
- **Sleutelgeneratie via PBKDF2:** De gebruiker voert een zelfgekozen wachtwoord (passphrase) in. De Web Crypto API (`window.crypto.subtle.deriveKey`) zet dit wachtwoord om in een sterke AES-GCM cryptografische sleutel.
- **Geen permanente opslag:** De sleutel wordt nergens opgeslagen in een database of op de harde schijf; deze bestaat tijdelijk in het geheugen van de browser tijdens het versleutelen of ontsleutelen.
- **Uitwisseling:** Om een bericht te ontcijferen, moeten de verzender en ontvanger vooraf hetzelfde wachtwoord met elkaar afspreken (out-of-band, bijvoorbeeld via een beveiligd kanaal). De gegenereerde IV (Initialization Vector) wordt samen met de versleutelde data meegestuurd, aangezien een IV bij AES-GCM niet geheim hoeft te zijn.

### Beveiligingsimplicaties:
De sterkte van de encryptie is direct afhankelijk van de sterkte van het gekozen wachtwoord. Een zwak wachtwoord maakt de applicatie vatbaar voor brute-force aanvallen. Het gebruik van PBKDF2 helpt hiertegen door het afleiden van de sleutel computationeel iets zwaarder te maken, wat brute-force pogingen vertraagt.

https://share.gemini.google/0sRJboaggiV2 

gebruikte bronnen:
https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto
https://developer.mozilla.org/en-US/docs/Web/API/Crypto
https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt
https://developer.mozilla.org/en-US/docs/Web/API/CryptoKey
https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/generateKey