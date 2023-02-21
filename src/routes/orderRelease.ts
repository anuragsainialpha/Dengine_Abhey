import express from 'express';
const router = express.Router();
import { CONSTS as consts, asyncHandler, asyncRouteHandler } from '../helper/other';
import { getReleasePropsfromGtm } from '../helper/dbXmlQuery';
import { getReleaseData, getReleaseSchema, getUpdatedProp } from '../helper/Release/getReleaseData';
import { dbXml } from '../api/gtm';
import { Release as ReleaseModel } from '../models/release';
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
      const release = await ReleaseModel(domain, instance).find({ display: display }).sort({ _id: 1 });
      if (release.length) return res.status(200).json({ data: release });
    }
    const gtmVersion = getGtmVersion(req);
    const schemaRelease = await getReleaseSchema(gtmVersion);
    if (!schemaRelease) return res.status(400).send(`gtmVersion:${gtmVersion} schema not available!`);
    const { data: gtmData, error } = await asyncHandler(dbXml(url, getReleasePropsfromGtm, username, password));
    if (error) return res.status(400).send(error);
    const Release = await getReleaseData(schemaRelease, gtmVersion, gtmData, domain);
    let release = await ReleaseModel(domain, instance).find({}).sort({ _id: 1 });
    if (!release || release.length === 0) return res.status(200).json({ data: await ReleaseModel(domain, instance).insertMany(Release) });
    release = await getUpdatedProp(Release, release, instance, domain);
    if (display) return res.status(200).json({ data: release.filter((d) => d.display) });
    return res.status(200).json({ data: release });
  })
);

router.put(
  '/',
  [auth],
  asyncRouteHandler(async (req: RequestUser, res) => {
    let { release } = req.body;
    const { username, instance } = req.user;
    const domain = username.split('.')[0];
    if (!release) return res.status(400).send('Release prop value missing!');
    release = await ReleaseModel(domain, instance).findByIdAndUpdate(release._id, release, { new: true });
    return res.status(200).json({ data: release });
  })
);

function getGtmVersion(req: RequestUser) {
  return req.query.gtmVersion ? +req.query.gtmVersion : +consts.GTMVERSION;
}

export default router;
