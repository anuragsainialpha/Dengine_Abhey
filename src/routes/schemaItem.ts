import { ROOT_DIR } from './../index';
import express from 'express';
const router = express.Router();
import path from 'path';
import parser from 'fast-xml-parser';
import flatten from 'flat';

import { getFileData, getXMlVersion, asyncRouteHandler, CONSTS } from '../helper/other';

import { getChilds } from '../helper/Item/schemaItemProps';
import { SchemaItem } from '../models/schemaItem';

router.post(
  '/',
  asyncRouteHandler(async (req, res) => {
    const itemXmlPath = path.join(ROOT_DIR, 'XMLs', 'Item.xml');
    const fileData = await getFileData(itemXmlPath);
    const tObj = parser.getTraversalObj(fileData, {});
    const jsonObj = parser.convertToJson(tObj, {});
    const flattenJson = flatten(jsonObj);
    const ItemSchema = getChilds(flattenJson);
    const { gtmVersion, xmlNsOtm, xmlNsGtm } = getXMlVersion(fileData);
    if (!gtmVersion) return res.status(400).send('XML must contain Namespace');
    let item = await SchemaItem.findOne({ gtmVersion: gtmVersion });
    if (item) {
      const inboundSchema = JSON.stringify(item.ItemMaster);
      const outboundSchema = JSON.stringify(ItemSchema.ItemMaster);
      if (inboundSchema === outboundSchema) return res.status(200).send(item);
      await SchemaItem.findByIdAndRemove(item._id);
    }
    item = new SchemaItem({ xmlNs: [xmlNsOtm, xmlNsGtm], gtmVersion, ...ItemSchema });
    item = await item.save();
    return res.status(200).send(item);
  })
);

router.get(
  '/',
  asyncRouteHandler(async (req, res) => {
    const { gtmVersion } = req.query;
    if (!gtmVersion) {
      const item = await SchemaItem.find().sort({ gtmVersion: -1 });
      return res.status(200).send(item);
    }
    const item = await SchemaItem.findOne({ gtmVersion: gtmVersion });
    if (!item) return res.status(400).send(`gtmVersion:${gtmVersion} schema not available!`);
    return res.status(200).send(item);
  })
);

export default router;

export async function generateItemSchema() {
  const itemXmlPath = path.join(ROOT_DIR, 'XMLs', 'Item.xml');
  const fileData = await getFileData(itemXmlPath);
  const tObj = parser.getTraversalObj(fileData, {});
  const jsonObj = parser.convertToJson(tObj, {});
  const flattenJson = flatten(jsonObj);
  const ItemSchema = getChilds(flattenJson);
  let { gtmVersion, xmlNsOtm, xmlNsGtm } = getXMlVersion(fileData);
  if (!gtmVersion) gtmVersion = Number(CONSTS.GTMVERSION);
  let item = new SchemaItem({ xmlNs: [xmlNsOtm, xmlNsGtm], gtmVersion, ...ItemSchema });
  return item.save();
}
