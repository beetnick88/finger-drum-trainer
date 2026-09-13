import { existsSync, readFileSync, readdirSync } from "node:fs";
import { webcrypto } from "node:crypto";

const protectedPackPath = "assets/songs/protected-songs.enc.json";
const allowedSongFiles = new Set(["protected-songs.enc.json"]);
const protectedPasswordPath = "PRIVATE_SONG_PASSWORD.txt";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function decodeBase64(value) {
  return Uint8Array.from(Buffer.from(value, "base64"));
}

async function decryptPack(password, encrypted) {
  const passwordKey = await webcrypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  const key = await webcrypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: decodeBase64(encrypted.salt),
      iterations: encrypted.iterations,
      hash: "SHA-256",
    },
    passwordKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"],
  );
  const plaintext = await webcrypto.subtle.decrypt(
    { name: "AES-GCM", iv: decodeBase64(encrypted.iv) },
    key,
    decodeBase64(encrypted.ciphertext),
  );
  return JSON.parse(new TextDecoder().decode(plaintext));
}

const songFiles = readdirSync("assets/songs").filter((name) => !name.startsWith("."));
assert(songFiles.every((name) => allowedSongFiles.has(name)), `Unexpected public song file: ${songFiles.join(", ")}`);

const appSource = readFileSync("app.js", "utf8");
const htmlSource = readFileSync("index.html", "utf8");
assert(!appSource.includes("sourceJson:"), "app.js should not include public sourceJson song loading");
assert(!appSource.includes("modeLabel: \"Protected Song\""), "protected song metadata should stay encrypted");
assert(htmlSource.includes("loginScreen"), "login screen is missing");
assert(htmlSource.includes("appShell") && htmlSource.includes("hidden"), "app shell should be hidden before entry");

const encryptedSource = readFileSync(protectedPackPath, "utf8");
const encrypted = JSON.parse(encryptedSource);
assert(encrypted.algorithm === "AES-GCM", "protected pack should use AES-GCM");
assert(encrypted.kdf === "PBKDF2-SHA-256", "protected pack should use PBKDF2-SHA-256");
assert(Number.isInteger(encrypted.iterations) && encrypted.iterations >= 200000, "PBKDF2 iterations are too low");
assert(typeof encrypted.ciphertext === "string" && encrypted.ciphertext.length > 1000, "ciphertext is missing");

if (existsSync(protectedPasswordPath)) {
  const password = readFileSync(protectedPasswordPath, "utf8").trim();
  const pack = await decryptPack(password, encrypted);
  const songs = Object.values(pack.songs || {});
  assert(songs.length >= 2, "decrypted protected pack should contain songs");
  for (const song of songs) {
    assert(song.title && song.bpm, "decrypted song metadata is incomplete");
    assert(song.practice && Object.keys(song.practice).length > 0, "decrypted song practice data is missing");
    assert(Array.isArray(song.backing), "decrypted song backing data is missing");
  }
  console.log(`protected song verification ok: ${songs.length} encrypted songs`);
} else {
  console.log("protected song verification ok: encrypted pack schema only");
}
