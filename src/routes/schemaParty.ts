import { ROOT_DIR } from './../index';
import express from 'express';
const router = express.Router();
import path from 'path';
import parser from 'fast-xml-parser';
import flatten from 'flat';

import { getFileData, getXMlVersion, asyncRouteHandler, CONSTS } from '../helper/other';

import { getChilds } from '../helper/Party/schemaPartyProps';
import { SchemaParty } from '../models/schemaParty';

router.post(
  '/',
  asyncRouteHandler(async (req, res) => {
    const itemXmlPath = path.join(ROOT_DIR, 'XMLs', 'Party.xml');
    const fileData = await getFileData(itemXmlPath);
    const tObj = parser.getTraversalObj(fileData, {});
    const jsonObj = parser.convertToJson(tObj, {});
    const flattenJson = flatten(jsonObj);
    const PartySchema = getChilds(flattenJson);
    const { gtmVersion, xmlNsOtm, xmlNsGtm } = getXMlVersion(fileData);
    if (!gtmVersion) return res.status(400).send('XML must contain Namespace');
    let party = await SchemaParty.findOne({ gtmVersion: gtmVersion });
    if (party) {
      const inboundSchema = JSON.stringify(party.GtmContact);
      const outboundSchema = JSON.stringify(PartySchema.GtmContact);
      if (inboundSchema === outboundSchema) return res.status(200).send(party);
      await SchemaParty.findByIdAndRemove(party._id);
    }
    party = new SchemaParty({ xmlNs: [xmlNsOtm, xmlNsGtm], gtmVersion, ...PartySchema });
    party = await party.save();
    return res.status(200).send(party);
  })
);

router.get(
  '/',
  asyncRouteHandler(async (req, res) => {
    const { gtmVersion } = req.query;
    if (!gtmVersion) {
      const party = await SchemaParty.find().sort({ gtmVersion: -1 });
      return res.status(200).send(party);
    }
    const party = await SchemaParty.findOne({ gtmVersion: gtmVersion });
    if (!party) return res.status(400).send(`gtmVersion:${gtmVersion} schema not available!`);
    return res.status(200).send(party);
  })
);

export default router;

export async function generatePartySchema() {
  const itemXmlPath = path.join(ROOT_DIR, 'XMLs', 'Party.xml');
  const fileData = await getFileData(itemXmlPath);
  const tObj = parser.getTraversalObj(fileData, {});
  const jsonObj = parser.convertToJson(tObj, {});
  const flattenJson = flatten(jsonObj);
  const PartySchema = getChilds(flattenJson);
  let { gtmVersion, xmlNsOtm, xmlNsGtm } = getXMlVersion(fileData);
  if (!gtmVersion) gtmVersion = Number(CONSTS.GTMVERSION);
  let party = new SchemaParty({ xmlNs: [xmlNsOtm, xmlNsGtm], gtmVersion, ...PartySchema });
  return party.save();
}
