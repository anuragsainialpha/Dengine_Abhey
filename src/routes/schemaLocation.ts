import { ROOT_DIR } from './../index';
import express from 'express';
const router = express.Router();
import path from 'path';
import parser from 'fast-xml-parser';
import flatten from 'flat';

import { getFileData, getXMlVersion, asyncRouteHandler } from '../helper/other';

import { getChilds } from '../helper/Location/schemaLocationProps';
import { SchemaLocation } from '../models/schemaLocation';

router.post(
  '/',
  asyncRouteHandler(async (req, res) => {
    const locationXmlPath = path.join(ROOT_DIR, 'XMLs', 'Location.xml');
    const fileData = await getFileData(locationXmlPath);
    const tObj = parser.getTraversalObj(fileData, {});
    const jsonObj = parser.convertToJson(tObj, {});
    const flattenJson = flatten(jsonObj);
    const LocationSchema = getChilds(flattenJson);
    const { gtmVersion, xmlNsOtm, xmlNsGtm } = getXMlVersion(fileData);
    if (!gtmVersion) return res.status(400).send('XML must contain Namespace');
    let location = await SchemaLocation.findOne({ gtmVersion: gtmVersion });
    if (location) {
      const inboundSchema = JSON.stringify(location.Location);
      const outboundSchema = JSON.stringify(LocationSchema.Location);
      if (inboundSchema === outboundSchema) return res.status(200).send(location);
      await SchemaLocation.findByIdAndRemove(location._id);
    }
    location = new SchemaLocation({ xmlNs: [xmlNsOtm, xmlNsGtm], gtmVersion, ...LocationSchema });
    location = await location.save();
    return res.status(200).send(location);
  })
);

router.get(
  '/',
  asyncRouteHandler(async (req, res) => {
    const { gtmVersion } = req.query;
    if (!gtmVersion) {
      const location = await SchemaLocation.find().sort({ gtmVersion: -1 });
      return res.status(200).send(location);
    }
    const location = await SchemaLocation.findOne({ gtmVersion: gtmVersion });
    if (!location) return res.status(400).send(`gtmVersion:${gtmVersion} schema not available!`);
    return res.status(200).send(location);
  })
);

export default router;
