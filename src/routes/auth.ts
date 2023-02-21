import Joi from 'joi';
import { generateAuthToken, asyncHandler, CONSTS as consts, getSidebar, asyncRouteHandler } from './../helper/other';
import { encrypt } from './../helper/encrypt';
import express from 'express';
import { authDengineUser } from '../helper/gtmAuth';
const router = express.Router();

router.post(
  '/',
  asyncRouteHandler(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let { username, password, instance } = req.body;
    if (!instance) instance = consts.CURRENT_INSTANCE;
    const auth = { username, password, url: getInstanceURL(instance) };
    const { data, error: gtmError } = await asyncHandler(authDengineUser(auth));
    if (data.includes('Unauthorized')) return res.status(403).send("Sorry, you don't have access!");
    if (gtmError) return res.status(500).send(gtmError);
    if (data.toString().includes('error')) return res.status(500).send(data.match('<error>(.*)</error>')[1]);
    const userRole = data.match('GTM - DATA_UPLOAD_(.*)"')[1].trim();
    if (userRole !== 'ADMIN' && userRole !== 'USER') return res.status(403).send("Sorry, you don't have access!");
    const isAdmin = userRole === 'ADMIN';
    const crypto = encrypt(password);
    const sidebar = getSidebar(isAdmin).filter(d =>
      consts.SUBSCIPTION.includes(
        d.name
          .trim()
          .toLowerCase()
          .replace(' ', '-')
      )
    );
    const domain = username.split('.')[0];
    const token = generateAuthToken({ username, domain, isAdmin, crypto, instance, sidebar });
    return res.send({ data: token });
  })
);

function validate(req) {
  const schema = {
    username: Joi.string()
      .min(1)
      .max(30)
      .required(),
    password: Joi.string()
      .min(1)
      .max(255)
      .required()
  };
  return Joi.validate(req, schema);
}

const getInstanceURL = instance => {
  if (instance === 'dev') return consts.DEV_INSTANCEURL;
  if (instance === 'test') return consts.TEST_INSTANCEURL;
  if (instance === 'prod') return consts.PROD_INSTANCEURL;
};

export default router;
