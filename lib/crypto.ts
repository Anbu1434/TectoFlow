const DEFAULT_SECRET = 'tectoflow_fallback_secret_key_change_me_in_production';

function getSecretKey(): string {
  return process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET || DEFAULT_SECRET;
}

// Convert a string to an ArrayBuffer
function stringToBuffer(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

// Base64Url encode/decode helpers
function base64UrlEncode(str: Uint8Array): string {
  let binary = '';
  const len = str.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(str[i]);
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function base64UrlDecode(str: string): Uint8Array {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// Hex encode/decode helpers
function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Sign payload to create an HMAC-SHA256 JWT.
 */
export async function signJWT(payload: Record<string, any>, expiresInSec: number = 60 * 60 * 24 * 7): Promise<string> {
  const secret = getSecretKey();
  const header = { alg: 'HS256', typ: 'JWT' };
  
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSec,
  };

  const encodedHeader = base64UrlEncode(stringToBuffer(JSON.stringify(header)));
  const encodedPayload = base64UrlEncode(stringToBuffer(JSON.stringify(fullPayload)));
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const key = await crypto.subtle.importKey(
    'raw',
    stringToBuffer(secret) as any,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    stringToBuffer(dataToSign) as any
  );

  const encodedSignature = base64UrlEncode(new Uint8Array(signature));
  return `${dataToSign}.${encodedSignature}`;
}

/**
 * Verify HMAC-SHA256 JWT signature and check expiration.
 */
export async function verifyJWT(token: string): Promise<Record<string, any> | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const dataToVerify = `${encodedHeader}.${encodedPayload}`;
    const signatureBytes = base64UrlDecode(encodedSignature);

    const secret = getSecretKey();
    const key = await crypto.subtle.importKey(
      'raw',
      stringToBuffer(secret) as any,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes as any,
      stringToBuffer(dataToVerify) as any
    );

    if (!isValid) return null;

    const decodedPayloadStr = new TextDecoder().decode(base64UrlDecode(encodedPayload));
    const payload = JSON.parse(decodedPayloadStr);

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null; // Token has expired
    }

    return payload;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

/**
 * Hash a password using PBKDF2 with SHA-256 and a random salt.
 */
export async function hashPassword(password: string, saltHex?: string, iterations: number = 100000): Promise<string> {
  const salt = saltHex ? hexToBytes(saltHex) : crypto.getRandomValues(new Uint8Array(16));
  const importedKey = await crypto.subtle.importKey(
    'raw',
    stringToBuffer(password) as any,
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt as any,
      iterations: iterations,
      hash: 'SHA-256'
    },
    importedKey,
    256 // 32 bytes (256 bits)
  );

  const computedHashHex = bytesToHex(new Uint8Array(derivedBits));
  const computedSaltHex = bytesToHex(salt);

  return `pbkdf2$${iterations}$${computedSaltHex}$${computedHashHex}`;
}

/**
 * Verify password against stored PBKDF2 hash, or fallback to legacy plaintext check.
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    if (!storedHash.startsWith('pbkdf2$')) {
      // Fallback: Check if it's the legacy plain text password
      return password === storedHash;
    }

    const parts = storedHash.split('$');
    if (parts.length !== 4) return false;

    const [, iterationsStr, saltHex, hashHex] = parts;
    const iterations = parseInt(iterationsStr, 10);

    const computedHash = await hashPassword(password, saltHex, iterations);
    return computedHash === storedHash;
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}
