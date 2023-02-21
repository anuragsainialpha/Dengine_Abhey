import express from 'express';
const router = express.Router();
import { CONSTS as consts, asyncHandler, asyncRouteHandler } from '../helper/other';
import { getOrderBasePropsfromGtm } from '../helper/dbXmlQuery';
import { getOrderBaseData, getOrderBaseSchema } from '../helper/OrderBase/getOrderBaseData';
import { dbXml } from '../api/gtm';
import { OrderBase as OrderBaseModel } from '../models/orderBase';
import auth from '../middleware/auth';
import { RequestUser } from '../interfaces/User';

router.get(
  '/',
  [auth],
  asyncRouteHandler(async (req: RequestUser, res) => {
    const { display } = req.query;
    const { username, password, instance, url } = req.user;
    const domain = username.split('.')[0];
    if (display) {
      const orderBase = await OrderBaseModel(domain, instance).find({ display: display }).sort({ _id: 1 });
      if (orderBase.length) return res.status(200).json({ data: orderBase });
    }
    const gtmVersion = getGtmVersion(req);
    const schemaOrderBase = await getOrderBaseSchema(gtmVersion);
    if (!schemaOrderBase) return res.status(400).send(`gtmVersion:${gtmVersion} schema not available!`);
    const { data: gtmData, error } = await asyncHandler(dbXml(url, getOrderBasePropsfromGtm, username, password));
    if (error) return res.status(400).send(error);
    const OrderBase = await getOrderBaseData(schemaOrderBase, gtmVersion, gtmData, domain);
    const orderBase = await OrderBaseModel(domain, instance).find({}).sort({ _id: 1 });
    if (!orderBase || orderBase.length === 0) {
      return res.status(200).json({ data: await OrderBaseModel(domain, instance).insertMany(OrderBase) });
    }
    // orderBase = await getUpdatedProp(OrderBase, orderBase, instance,domain);
    if (display) return res.status(200).json({ data: orderBase.filter((d) => d.display) });
    return res.status(200).json({ data: orderBase });
  })
);

router.put(
  '/',
  [auth],
  asyncRouteHandler(async (req: RequestUser, res) => {
    let { orderBase } = req.body;
    const { username, instance } = req.user;
    const domain = username.split('.')[0];
    if (!orderBase) return res.status(400).send('OrderBase prop value missing!');
    orderBase = await OrderBaseModel(domain, instance).findByIdAndUpdate(orderBase._id, orderBase, { new: true });
    return res.status(200).json({ data: orderBase });
  })
);

function getGtmVersion(req: RequestUser) {
  return req.query.gtmVersion ? +req.query.gtmVersion : +consts.GTMVERSION;
}

export default router;
