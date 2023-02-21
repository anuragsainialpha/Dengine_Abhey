import express from 'express';
const router = express.Router();
import { CONSTS as consts, asyncHandler, asyncRouteHandler } from '../helper/other';
import { getBomPropsfromGtm } from '../helper/dbXmlQuery';
import { getBomData, getUpdatedProp, getBomSchema } from '../helper/Bom/getBomData';
import { dbXml } from '../api/gtm';
import { Bom as BomModel } from '../models/bom';
import auth from '../middleware/auth';
import { RequestUser } from '../interfaces/User';
import { generateBomSchema } from './schemaBom';

router.get(
  '/',
  [auth],
  asyncRouteHandler(async (req: RequestUser, res) => {
    const { display } = req.query;
    const { username, password, instance, url } = req.user;
    const domain = username.split('.')[0];
    if (display) {
      const bom = await BomModel(domain, instance).find({ display: display }).sort({ _id: 1 });
      if (bom.length) return res.status(200).json({ data: bom });
    }
    const gtmVersion = getGtmVersion(req);
    let schemaBom = await getBomSchema(gtmVersion);
    if (!schemaBom) {
      schemaBom = await generateBomSchema();
    }
    const { data: gtmData, error } = await asyncHandler(dbXml(url, getBomPropsfromGtm, username, password));
    if (error) return res.status(400).send(error);
    const Boms = await getBomData(schemaBom, gtmVersion, gtmData, domain);
    let bom = await BomModel(domain, instance).find({}).sort({ _id: 1 });
    if (!bom || bom.length === 0) return res.status(200).json({ data: await BomModel(domain, instance).insertMany(Boms) });
    bom = await getUpdatedProp(Boms, bom, instance, domain);
    if (display) return res.status(200).json({ data: bom.filter((d) => d.display) });
    return res.status(200).json({ data: bom });
  })
);

router.put(
  '/',
  [auth],
  asyncRouteHandler(async (req: RequestUser, res) => {
    let { bom } = req.body;
    const { username, instance } = req.user;
    const domain = username.split('.')[0];
    if (!bom) return res.status(400).send('Bom prop value missing!');
    bom = await BomModel(domain, instance).findByIdAndUpdate(bom._id, bom, { new: true });
    return res.status(200).json({ data: bom });
  })
);

function getGtmVersion(req: RequestUser) {
  return req.query.gtmVersion ? +req.query.gtmVersion : +consts.GTMVERSION;
}

export default router;
