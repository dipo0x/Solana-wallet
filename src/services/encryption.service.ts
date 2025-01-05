import { KeyManagementServiceClient } from '@google-cloud/kms';
import dotenv from 'dotenv';
dotenv.config();

const client = new KeyManagementServiceClient();

const location = 'global';
const keyRing = process.env.GOOGLE_CLOUD_KEY_RING!
const key = process.env.GOOGLE_CLOUD_KEY!
const project_id = process.env.PROJECT_ID!

export async function encryptData(plaintext: string) {
    const keyName = client.cryptoKeyPath(project_id, location, keyRing, key);

    const [result] = await client.encrypt({
        name: keyName,
        plaintext: Buffer.from(plaintext).toString('base64'),
    });

    return result.ciphertext;
}

export async function decryptData(ciphertext: string) {
    const keyName = client.cryptoKeyPath(project_id, location, keyRing, key);

    const [result] = await client.decrypt({
        name: keyName,
        ciphertext,
    });

    if (!result.plaintext) {
        throw new Error('Decryption failed: Plaintext is undefined.');
    }

    const plaintextBuffer =
        result.plaintext instanceof Uint8Array
            ? Buffer.from(result.plaintext)
            : Buffer.from(result.plaintext, 'base64');

    return plaintextBuffer.toString('utf8');
}