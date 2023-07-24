import { createCipheriv, createDecipheriv } from 'node:crypto';

export const encrypt = (data: object) => {
  const cipher = createCipheriv(
    process.env.ENCRYPT_METHOD,
    process.env.CRYPTO_SECRET.slice(0, 32),
    process.env.CRYPTO_IV_SECRET.slice(0, 16),
  );

  const stringifyData = JSON.stringify(data);

  return Buffer.from(
    cipher.update(stringifyData, 'utf8', 'hex') + cipher.final('hex'),
  ).toString('base64');
};

export const decrypt = (encryptedData) => {
  const buff = Buffer.from(encryptedData, 'base64');
  const decipher = createDecipheriv(
    process.env.ENCRYPT_METHOD,
    process.env.CRYPTO_SECRET.slice(0, 32),
    process.env.CRYPTO_IV_SECRET.slice(0, 16),
  );

  const decrypted =
    decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
    decipher.final('utf8');

  return JSON.parse(decrypted);
};
