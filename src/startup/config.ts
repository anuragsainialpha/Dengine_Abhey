import { CONSTS as consts } from '../helper/other';

export default function() {
  if (!consts.JWT_PRIVATE_KEY) {
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
  }
}
