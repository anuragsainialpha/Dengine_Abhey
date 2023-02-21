import { ROOT_DIR } from './../index';
import express from 'express';
const router = express.Router();
import path from 'path';
import parser from 'fast-xml-parser';
import flatten from 'flat';

import { getFileData, getXMlVersion, asyncRouteHandler } from '../helper/other';

import { getChilds } from '../helper/Shipment/schemaShipmentProps';
import { SchemaShipment } from '../models/schemaShipment';

router.post(
  '/',
  asyncRouteHandler(async (req, res) => {
    const itemXmlPath = path.join(ROOT_DIR, 'XMLs', 'ActualShipment.xml');
    const fileData = await getFileData(itemXmlPath);
    const tObj = parser.getTraversalObj(fileData, {});
    const jsonObj = parser.convertToJson(tObj, {});
    const flattenJson = flatten(jsonObj);
    const ActualShipment = getChilds(flattenJson);
    const { gtmVersion, xmlNsOtm, xmlNsGtm } = getXMlVersion(fileData);
    if (!gtmVersion) return res.status(400).send('XML must contain Namespace');
    // Updating to Database
    let shipment = await SchemaShipment.findOne({ gtmVersion: gtmVersion });
    if (shipment) {
      const inboundSchema = JSON.stringify(shipment.ActualShipment);
      const outboundSchema = JSON.stringify(ActualShipment.ActualShipment);
      if (inboundSchema === outboundSchema) return res.status(200).send(shipment);
      await SchemaShipment.findByIdAndRemove(shipment._id);
    }
    shipment = new SchemaShipment({ xmlNs: [xmlNsOtm, xmlNsGtm], gtmVersion, ...ActualShipment });
    shipment = await shipment.save();
    // Updating to Database
    return res.status(200).send(shipment);
  })
);

router.get(
  '/',
  asyncRouteHandler(async (req, res) => {
    const { gtmVersion } = req.query;
    if (!gtmVersion) {
      const shipment = await SchemaShipment.find().sort({ gtmVersion: -1 });
      return res.status(200).send(shipment);
    }
    const shipment = await SchemaShipment.findOne({ gtmVersion: gtmVersion });
    if (!shipment) return res.status(400).send(`gtmVersion:${gtmVersion} schema not available!`);
    return res.status(200).send(shipment);
  })
);

export default router;
