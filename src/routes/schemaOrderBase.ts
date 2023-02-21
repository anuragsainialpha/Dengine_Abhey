import { ROOT_DIR } from './../index';
import express from 'express';
const router = express.Router();
import path from 'path';
import parser from 'fast-xml-parser';
import flatten from 'flat';

import { getFileData, getXMlVersion, asyncRouteHandler } from '../helper/other';

import { getChilds } from '../helper/OrderBase/schemaOrderBaseProps';
import { SchemaOrderBase } from '../models/schemaOrderBase';

router.post(
  '/',
  asyncRouteHandler(async (req, res) => {
    const itemXmlPath = path.join(ROOT_DIR, 'XMLs', 'OrderBase.xml');
    const fileData = await getFileData(itemXmlPath);
    const tObj = parser.getTraversalObj(fileData, {});
    const jsonObj = parser.convertToJson(tObj, {});
    const flattenJson = flatten(jsonObj);
    const TransOrder = getChilds(flattenJson);
    const { gtmVersion, xmlNsOtm, xmlNsGtm } = getXMlVersion(fileData);
    if (!gtmVersion) return res.status(400).send('XML must contain Namespace');
    // Updating to Database
    let transorder = await SchemaOrderBase.findOne({ gtmVersion: gtmVersion });
    if (transorder) {
      const inboundSchema = JSON.stringify(transorder.TransOrder);
      const outboundSchema = JSON.stringify(TransOrder.TransOrder);
      if (inboundSchema === outboundSchema) return res.status(200).send(transorder);
      await SchemaOrderBase.findByIdAndRemove(transorder._id);
    }
    transorder = new SchemaOrderBase({ xmlNs: [xmlNsOtm, xmlNsGtm], gtmVersion, ...TransOrder });
    transorder = await transorder.save();
    // Updating to Database
    return res.status(200).send(transorder);
  })
);

router.get(
  '/',
  asyncRouteHandler(async (req, res) => {
    const { gtmVersion } = req.query;
    if (!gtmVersion) {
      const orderbase = await SchemaOrderBase.find().sort({ gtmVersion: -1 });
      return res.status(200).send(orderbase);
    }
    const orderbase = await SchemaOrderBase.findOne({ gtmVersion: gtmVersion });
    if (!orderbase) return res.status(400).send(`gtmVersion:${gtmVersion} schema not available!`);
    return res.status(200).send(orderbase);
  })
);

export default router;
