import { ROOT_DIR } from './../index';
import express from 'express';
const router = express.Router();
import path from 'path';
import parser from 'fast-xml-parser';
import flatten from 'flat';

import { getFileData, getXMlVersion, asyncRouteHandler } from '../helper/other';

import { getChilds } from '../helper/Release/schemaReleaseProps';
import { SchemaRelease } from '../models/schemaRelease';

router.post(
  '/',
  asyncRouteHandler(async (req, res) => {
    const itemXmlPath = path.join(ROOT_DIR, 'XMLs', 'OrderRelease.xml');
    const fileData = await getFileData(itemXmlPath);
    const tObj = parser.getTraversalObj(fileData, {});
    const jsonObj = parser.convertToJson(tObj, {});
    const flattenJson = flatten(jsonObj);
    const Release = getChilds(flattenJson);
    const { gtmVersion, xmlNsOtm, xmlNsGtm } = getXMlVersion(fileData);
    if (!gtmVersion) return res.status(400).send('XML must contain Namespace');
    // Updating to Database
    let release = await SchemaRelease.findOne({ gtmVersion: gtmVersion });
    if (release) {
      const inboundSchema = JSON.stringify(release.Release);
      const outboundSchema = JSON.stringify(Release.Release);
      if (inboundSchema === outboundSchema) return res.status(200).send(release);
      await SchemaRelease.findByIdAndRemove(release._id);
    }
    release = new SchemaRelease({ xmlNs: [xmlNsOtm, xmlNsGtm], gtmVersion, ...Release });
    release = await release.save();
    // Updating to Database
    return res.status(200).send(release);
  })
);

router.get(
  '/',
  asyncRouteHandler(async (req, res) => {
    const { gtmVersion } = req.query;
    if (!gtmVersion) {
      const release = await SchemaRelease.find().sort({ gtmVersion: -1 });
      return res.status(200).send(release);
    }
    const release = await SchemaRelease.findOne({ gtmVersion: gtmVersion });
    if (!release) return res.status(400).send(`gtmVersion:${gtmVersion} schema not available!`);
    return res.status(200).send(release);
  })
);

export default router;
