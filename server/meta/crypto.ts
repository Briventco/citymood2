import "server-only";

import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

import { readMetaConfiguration } from "@/server/meta/config";

function key(): Buffer {
  const encoded = readMetaConfiguration().tokenEncryptionKey;
  if (!encoded) throw new Error("Meta token encryption is not configured.");
  const decoded = Buffer.from(encoded, "base64");
  if (decoded.length !== 32) throw new Error("META_TOKEN_ENCRYPTION_KEY must decode to 32 bytes.");
  return decoded;
}

export function encryptMetaToken(token: string): { ciphertext: string; nonce: string } {
  const nonce = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), nonce);
  const ciphertext = Buffer.concat([cipher.update(token, "utf8"), cipher.final(), cipher.getAuthTag()]);
  return { ciphertext: ciphertext.toString("base64"), nonce: nonce.toString("base64") };
}

export function decryptMetaToken(ciphertext: string, nonce: string): string {
  const encrypted = Buffer.from(ciphertext, "base64");
  const iv = Buffer.from(nonce, "base64");
  if (iv.length !== 12 || encrypted.length < 17) throw new Error("Invalid encrypted Meta token.");
  const decipher = createDecipheriv("aes-256-gcm", key(), iv);
  decipher.setAuthTag(encrypted.subarray(-16));
  return Buffer.concat([decipher.update(encrypted.subarray(0, -16)), decipher.final()]).toString("utf8");
}
