import express from 'express';
const router = express.Router();
import { CONSTS as consts, asyncHandler, asyncRouteHandler } from '../helper/other';
import { getLocationPropfromOtm } from '../helper/dbXmlQuery';
import { getLocationData, getUpdatedProp, getLocationSchema } from '../helper/Location/getLocationData';
import { dbXml } from '../api/gtm';
import { Location } from '../models/location';
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
      const location = await Location(domain, instance).find({ display: display }).sort({ _id: 1 });
      if (location.length) return res.status(200).json({ data: location });
    }
    const gtmVersion = getGtmVersion(req);
    const schemaLocation = await getLocationSchema(gtmVersion);
    if (!schemaLocation) return res.status(400).send(`gtmVersion:${gtmVersion} schema not available!`);
    const { data: gtmData, error } = await asyncHandler(dbXml(url, getLocationPropfromOtm, username, password));
    if (error) return res.status(400).send(error);
    const Locations = await getLocationData(schemaLocation, gtmVersion, gtmData, domain);
    let location = await Location(domain, instance).find({}).sort({ _id: 1 });
    if (!location || location.length === 0) return res.status(200).json({ data: await Location(domain, instance).insertMany(Locations) });
    location = await getUpdatedProp(Locations, location, instance, domain);
    if (display) return res.status(200).json({ data: location.filter((d) => d.display) });
    return res.status(200).json({ data: location });
  })
);

router.put(
  '/',
  [auth],
  asyncRouteHandler(async (req: RequestUser, res) => {
    let { location } = req.body;
    const { username, instance } = req.user;
    const domain = username.split('.')[0];
    if (!location) return res.status(400).send('Location prop value missing!');
    location = await Location(domain, instance).findByIdAndUpdate(location._id, location, { new: true });
    return res.status(200).json({ data: location });
  })
);

function getGtmVersion(req: RequestUser) {
  return req.query.gtmVersion ? +req.query.gtmVersion : +consts.GTMVERSION;
}

export default router;
