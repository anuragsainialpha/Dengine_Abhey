import express from 'express';
const router = express.Router();
import { CONSTS as consts, asyncRouteHandler } from '../helper/other';
import { Setting } from '../models/setting';
import auth from '../middleware/auth';
import { RequestUser } from '../interfaces/User';

router.get(
  '/',
  [auth],
  asyncRouteHandler(async (req: RequestUser, res) => {
    const { instance, url } = req.user;
    let setting = await Setting(instance).findOne();
    if (setting) return res.status(200).json({ data: setting });
    setting = await Setting(instance).create({ url, version: +consts.GTMVERSION });
    return res.status(200).json({ data: setting });
  })
);

router.put(
  '/',
  [auth],
  asyncRouteHandler(async (req, res) => {
    const { instance } = req.user;
    let { setting } = req.body;
    setting = await Setting(instance).findByIdAndUpdate(setting._id, setting, { new: true });
    return res.status(200).json({ data: setting });
  })
);

export default router;
