import * as bip39 from 'bip39';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export function generateRecoveryPhrase(): string {
  return bip39.generateMnemonic();
}

export async function hashRecoveryPhrase(phrase: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(phrase, saltRounds);
}

export function hashWords(phrase: string): Record<number, string> {
  const words = phrase.split(' ');
  const wordHashes: Record<number, string> = {};

  words.forEach((word, index) => {
    const wordHash = crypto.createHash('sha256').update(word).digest('hex');
    wordHashes[index + 1] = wordHash;
  });

  return wordHashes;
}