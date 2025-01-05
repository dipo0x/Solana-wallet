import crypto from 'crypto';
import { Security } from '../modules/user/models/user.security.model';
import { User } from '../modules/user/models/user.model';
import bcrypt from 'bcrypt'

export async function validateRecoveryPhrase(submittedPhrase: string): Promise<any> {
  const words = submittedPhrase.split(' ');
  if (words.length !== 12) {
    throw new Error('Recovery phrase must contain exactly 12 words.');
  }

  const wordHashes: Record<number, string> = {};
  words.forEach((word, index) => {
    const wordHash = crypto.createHash('sha256').update(word).digest('hex');
    wordHashes[index + 1] = wordHash;
  });

  const securityRecord = await Security.findOne({
    recoveryWordHashes: wordHashes,
  });

  console.log(securityRecord)
  if (!securityRecord) {
    return null
  }

  const isFullHashValid = await bcrypt.compare(submittedPhrase, securityRecord.recoveryPhraseHash);
  console.log(isFullHashValid)
  if (!isFullHashValid) {
    return null
  }

  const user = await User.findById(securityRecord.userId);
  if (!user) {
    return null
  }

  return user;
}
