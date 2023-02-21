import auth from '../middleware/auth';
import express from 'express';
import { asyncRouteHandler } from '../helper/other';
const router = express.Router();

router.get(
  '/me',
  [auth],
  asyncRouteHandler(async (req, res) => {
    const { username, isAdmin, instance, sidebar } = req.user;
    const domain = username.split('.')[0];
    return res.send({ data: { username, domain, isAdmin, instance, sidebar } });
  })
);

export default router;
