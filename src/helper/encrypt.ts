import { CONSTS as consts } from './other';
import SimpleCrypto from 'simple-crypto-js';
const _secretKey = consts.JWT_PRIVATE_KEY;

export const encrypt = data => {
  const crypto = new SimpleCrypto(_secretKey);
  return crypto.encrypt(data);
};

export const decrypt = data => {
  const crypto = new SimpleCrypto(_secretKey);
  return crypto.decrypt(data);
};
