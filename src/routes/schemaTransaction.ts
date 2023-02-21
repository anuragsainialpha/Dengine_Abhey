import { ROOT_DIR } from './../index';
import express from 'express';
const router = express.Router();
import path from 'path';
import parser from 'fast-xml-parser';
import flatten from 'flat';

import { getFileData, getXMlVersion, asyncRouteHandler, CONSTS } from '../helper/other';

import { getChilds } from '../helper/Transaction/schemaTransactionProps';
import { SchemaTransaction } from '../models/schemaTransaction';

router.post(
  '/',
  asyncRouteHandler(async (req, res) => {
    const itemXmlPath = path.join(ROOT_DIR, 'XMLs', 'GtmTransaction.xml');
    const fileData = await getFileData(itemXmlPath);
    const tObj = parser.getTraversalObj(fileData, {});
    const jsonObj = parser.convertToJson(tObj, {});
    const flattenJson = flatten(jsonObj);
    const Transaction = getChilds(flattenJson);
    const { gtmVersion, xmlNsOtm, xmlNsGtm } = getXMlVersion(fileData);
    if (!gtmVersion) return res.status(400).send('XML must contain Namespace');
    let transaction = await SchemaTransaction.findOne({ gtmVersion: gtmVersion });
    if (transaction) {
      const inboundSchema = JSON.stringify(transaction.GtmTransaction);
      const outboundSchema = JSON.stringify(Transaction.GtmTransaction);
      if (inboundSchema === outboundSchema) return res.status(200).send(transaction);
      await SchemaTransaction.findByIdAndRemove(transaction._id);
    }
    transaction = new SchemaTransaction({ xmlNs: [xmlNsOtm, xmlNsGtm], gtmVersion, ...Transaction });
    transaction = await transaction.save();
    return res.status(200).send(transaction);
  })
);

router.get(
  '/',
  asyncRouteHandler(async (req, res) => {
    const { gtmVersion } = req.query;
    if (!gtmVersion) {
      const transaction = await SchemaTransaction.find().sort({ gtmVersion: -1 });
      return res.status(200).send(transaction);
    }
    const transaction = await SchemaTransaction.findOne({ gtmVersion: gtmVersion });
    if (!transaction) return res.status(400).send(`gtmVersion:${gtmVersion} schema not available!`);
    return res.status(200).send(transaction);
  })
);

export default router;

export async function generateTrxSchema() {
  const itemXmlPath = path.join(ROOT_DIR, 'XMLs', 'GtmTransaction.xml');
  const fileData = await getFileData(itemXmlPath);
  const tObj = parser.getTraversalObj(fileData, {});
  const jsonObj = parser.convertToJson(tObj, {});
  const flattenJson = flatten(jsonObj);
  const Transaction = getChilds(flattenJson);
  let { gtmVersion, xmlNsOtm, xmlNsGtm } = getXMlVersion(fileData);
  if (!gtmVersion) gtmVersion = Number(CONSTS.GTMVERSION);
  const transaction = new SchemaTransaction({ xmlNs: [xmlNsOtm, xmlNsGtm], gtmVersion, ...Transaction });
  return transaction.save();
}
