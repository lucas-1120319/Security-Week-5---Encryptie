
// hiermee doe ik net alsof het over het netwerk gaat
let simulatedNetworkPayload = null;
function showDecryptForm() {
    document.getElementById('decryptSection').classList.remove('hidden');
}

//verander de bytes naar base64 zodat het in JSON kan
 function bufferToBase64(buffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}
//zet de base64 weer terug naar bytes zodat het kan worden ontsleuteld
function base64ToBuffer(base64) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}


async function handleEncrypt() {
    const messageText = document.getElementById('message').value;
    const encryptPassword = document.getElementById('encryptPassword').value;

     if (!message || !encryptPassword) {
        alert("Vul a.u.b. een bericht en een wachtwoord in!");
        return;

    }

    try {
        const encoder = new TextEncoder();

        //zet het wachtwoord om naar bytes en dan maak daar een key van
        const encrptPasswordBuffer = encoder.encode(encryptPassword);
        const baseKey = await window.crypto.subtle.importKey(
            "raw",
            encrptPasswordBuffer,
            { name: "PBKDF2" },
            false,
            ["deriveKey"]
        );

        //gebruik salting zodat wachtwoorden hetzelfde kunnen zijn maar een andere key krijgt
        const salt = window.crypto.getRandomValues(new Uint8Array(16));

        // maak de key die gebruikt gaat worden voor encryptie en decryptie
        const key = await window.crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt: salt,
                iterations: 100000,
                hash: "SHA-256"
            },
            baseKey,
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );

        // Zet originele tekst om naar bytes voor de encryptie
        const encodedMessage =  encoder.encode(messageText);

        //  Genereer een unieke IV van 12 bytes
        const iv = window.crypto.getRandomValues(new Uint8Array(12));

        //  Voer de encryptie uit
        const encryptedBuffer = await window.crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: iv
            },
            key,
            encodedMessage
        );

        //maak een packet die de versleutelde tekst heeft en de salt + iv heeft.
        const packet = {
            encryptedData: bufferToBase64(encryptedBuffer),
            salt: bufferToBase64(salt),
            iv: bufferToBase64(iv)
        };
        //hiermee wil ik net doen alsof het over het internet gaat
        simulatedNetworkPayload = JSON.stringify(packet, null, 2);

        document.getElementById('inbox').classList.remove('hidden');
        document.getElementById('decryptSection').classList.add('hidden');
        document.getElementById('output').innerText = "";

        console.log("Encryptie met wachtwoord gelukt!", encryptedBuffer);
    } catch (error) {
        console.error("Fout tijdens encryptie:", error);
    }
}

async function handleDecrypt() {
    // Check of we wel iets hebben om te ontsleutelen
    if (!simulatedNetworkPayload) {
        alert("Er is geen bericht om te ontsleutelen!");
        return;
    }
    const DecryptPassword = document.getElementById('DecryptPassword').value;

    try {
        const encoder = new TextEncoder();

        //net alsof je het hebt ontvangen van het netwerk
        const packet = JSON.parse(simulatedNetworkPayload);
        const encryptedBuffer = base64ToBuffer(packet.encryptedData);
        const salt = base64ToBuffer(packet.salt);
        const iv = base64ToBuffer(packet.iv);

        const DecryptPasswordBuffer = encoder.encode(DecryptPassword);
        //zet het wachtwoord weer om naar een key die gebruikt kan worden voor decryptie
        const baseKey = await window.crypto.subtle.importKey(
            "raw",
            DecryptPasswordBuffer,
            { name: "PBKDF2" },
            false,
            ["deriveKey"]
        );

        // Decryptie uitvoeren met dezelfde sleutel, iv en buffer
       const decryptionKey = await window.crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt: salt,
                iterations: 100000,
                hash: "SHA-256"
            },
            baseKey,
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );
        // Decryptie uitvoeren met de sleutel en ontvangen IV
        const decryptedBuffer = await window.crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: iv
            },
            decryptionKey,
            encryptedBuffer
        );


        // 4. Bytes omzetten naar leesbare tekst
        const decryptedText = new TextDecoder().decode(decryptedBuffer);
        document.getElementById('output').innerText = decryptedText;

    } catch (error) {
        console.error("Fout tijdens decryptie:", error);
        document.getElementById('output').innerText = "Decryptie is mislukt";

        //hahahahh kleine verassing
        alert("Decryptie is mislukt, waarschijnlijk heb je geprobeerd te hacken. DAT MAG HELEMAAL NIET!");
        window.location.href = "https://www.youtube.com/watch?v=msX4oAXpvUE";
    }
}