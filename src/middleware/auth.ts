import jwt from 'jsonwebtoken';
import { CONSTS as consts } from '../helper/other';
import { decrypt } from '../helper/encrypt';
import { RequestUser } from '../interfaces/User';

export default async function(req: RequestUser, res, next) {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided.');
  const route = req.baseUrl.split('/');
  if (!consts.SUBSCIPTION.includes(route[route.length - 1])) return res.status(401).send("Sorry, you don't have access.");
  try {
    const decoded = jwt.verify(token, consts.JWT_PRIVATE_KEY) as any;
    req.user = decoded;
    req.user.url = getInstanceURL(decoded);
    if (req.user.crypto) req.user.password = decrypt(decoded.crypto).toString();
    next();
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
}

const getInstanceURL = decoded => {
  const { instance } = decoded;
  if (instance === 'test') return consts.TEST_INSTANCEURL;
  if (instance === 'prod') return consts.PROD_INSTANCEURL;
  return consts.DEV_INSTANCEURL;
};
