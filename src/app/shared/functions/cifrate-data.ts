import * as Forge from 'node-forge';

function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  return btoa(String.fromCharCode(...bytes));
}

export async function cifrateData<T>(publicKey: string, body: T): Promise<string> {
  const rawKey = crypto.getRandomValues(new Uint8Array(32));

  const publickey = Forge.pki.publicKeyFromPem(publicKey);
  const rawKeyBinary = String.fromCharCode(...rawKey);
  const encryptedKey = publickey.encrypt(rawKeyBinary, 'RSA-OAEP');
  const rsaData = Forge.util.encode64(encryptedKey);

  const cryptoKey = await crypto.subtle.importKey('raw', rawKey, 'AES-GCM', false, ['encrypt']);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const bodyBytes = new TextEncoder().encode(JSON.stringify(body));
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cryptoKey, bodyBytes);

  return `${rsaData}.${bufferToBase64(iv)}.${bufferToBase64(encrypted)}`;
}
