const { webcrypto } = require('crypto');

// Polyfill webcrypto if it's not global (available since Node v19+, and in older versions as webcrypto)
const cryptoObj = webcrypto || globalThis.crypto;

if (!cryptoObj || !cryptoObj.subtle) {
  console.error("Web Crypto API is not available in this Node.js version. Please run this script with Node.js v18 or later.");
  process.exit(1);
}

const password = process.argv[2];
if (!password) {
  console.log("\nUsage: node scripts/hash-password.js <password>");
  console.log("Example: node scripts/hash-password.js securePassword123\n");
  process.exit(1);
}

// Convert a string to a Uint8Array buffer
function stringToBuffer(str) {
  return new TextEncoder().encode(str);
}

// Convert bytes to a hexadecimal string
function bytesToHex(bytes) {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function hashPassword(pw) {
  const salt = cryptoObj.getRandomValues(new Uint8Array(16));
  const importedKey = await cryptoObj.subtle.importKey(
    'raw',
    stringToBuffer(pw),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const derivedBits = await cryptoObj.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    importedKey,
    256 // 32 bytes (256 bits)
  );

  const computedHashHex = bytesToHex(new Uint8Array(derivedBits));
  const computedSaltHex = bytesToHex(salt);

  return `pbkdf2$100000$${computedSaltHex}$${computedHashHex}`;
}

hashPassword(password)
  .then(hash => {
    console.log("\n============================================================");
    console.log("Generated Secure PBKDF2 Password Hash:");
    console.log("------------------------------------------------------------");
    console.log(hash);
    console.log("============================================================");
    console.log("\nCopy the hash above and paste it in your `.env` file as:");
    console.log("ADMIN_PASSWORD_HASH=" + hash);
    console.log("\nAlso, add a cryptographically secure JWT secret in `.env` as:");
    console.log("ADMIN_JWT_SECRET=your_long_random_string_here");
    console.log("============================================================\n");
  })
  .catch(err => {
    console.error("Error hashing password:", err);
  });
