import { ROOT_DIR } from './../index';
import express from 'express';
const router = express.Router();
import path from 'path';
import parser from 'fast-xml-parser';
import flatten from 'flat';

import { getFileData, getXMlVersion, asyncRouteHandler, CONSTS } from '../helper/other';

import { getChilds } from '../helper/Bom/schemaBomProps';
import { SchemaBom } from '../models/schemaBom';

router.post(
  '/',
  asyncRouteHandler(async (req, res) => {
    const itemXmlPath = path.join(ROOT_DIR, 'XMLs', 'GtmStructure.xml');
    const fileData = await getFileData(itemXmlPath);
    const tObj = parser.getTraversalObj(fileData, {});
    const jsonObj = parser.convertToJson(tObj, {});
    const flattenJson = flatten(jsonObj);
    const BomSchema = getChilds(flattenJson);
    const { gtmVersion, xmlNsOtm, xmlNsGtm } = getXMlVersion(fileData);
    if (!gtmVersion) return res.status(400).send('XML must contain Namespace');
    let bom = await SchemaBom.findOne({ gtmVersion: gtmVersion });
    if (bom) {
      const inboundSchema = JSON.stringify(bom.Bom);
      const outboundSchema = JSON.stringify(BomSchema.Bom);
      if (inboundSchema === outboundSchema) return res.status(200).send(bom);
      await SchemaBom.findByIdAndRemove(bom._id);
    }
    bom = new SchemaBom({ xmlNs: [xmlNsOtm, xmlNsGtm], gtmVersion, ...BomSchema });
    bom = await bom.save();
    return res.status(200).send(bom);
  })
);

router.get(
  '/',
  asyncRouteHandler(async (req, res) => {
    const { gtmVersion } = req.query;
    if (!gtmVersion) {
      const bom = await SchemaBom.find().sort({ gtmVersion: -1 });
      return res.status(200).send(bom);
    }
    const bom = await SchemaBom.findOne({ gtmVersion: gtmVersion });
    if (!bom) return res.status(400).send(`gtmVersion:${gtmVersion} schema not available!`);
    return res.status(200).send(bom);
  })
);

export default router;

export async function generateBomSchema() {
  const itemXmlPath = path.join(ROOT_DIR, 'XMLs', 'GtmStructure.xml');
  const fileData = await getFileData(itemXmlPath);
  const tObj = parser.getTraversalObj(fileData, {});
  const jsonObj = parser.convertToJson(tObj, {});
  const flattenJson = flatten(jsonObj);
  const BomSchema = getChilds(flattenJson);
  let { gtmVersion, xmlNsOtm, xmlNsGtm } = getXMlVersion(fileData);
  if (!gtmVersion) gtmVersion = Number(CONSTS.GTMVERSION);
  const bom = new SchemaBom({ xmlNs: [xmlNsOtm, xmlNsGtm], gtmVersion, ...BomSchema });
  return bom.save();
}
