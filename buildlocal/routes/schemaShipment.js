"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./../index");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const path_1 = __importDefault(require("path"));
const fast_xml_parser_1 = __importDefault(require("fast-xml-parser"));
const flat_1 = __importDefault(require("flat"));
const other_1 = require("../helper/other");
const schemaShipmentProps_1 = require("../helper/Shipment/schemaShipmentProps");
const schemaShipment_1 = require("../models/schemaShipment");
router.post('/', other_1.asyncRouteHandler(async (req, res) => {
    const itemXmlPath = path_1.default.join(index_1.ROOT_DIR, 'XMLs', 'ActualShipment.xml');
    const fileData = await other_1.getFileData(itemXmlPath);
    const tObj = fast_xml_parser_1.default.getTraversalObj(fileData, {});
    const jsonObj = fast_xml_parser_1.default.convertToJson(tObj, {});
    const flattenJson = flat_1.default(jsonObj);
    const ActualShipment = schemaShipmentProps_1.getChilds(flattenJson);
    const { gtmVersion, xmlNsOtm, xmlNsGtm } = other_1.getXMlVersion(fileData);
    if (!gtmVersion)
        return res.status(400).send('XML must contain Namespace');
    let shipment = await schemaShipment_1.SchemaShipment.findOne({ gtmVersion: gtmVersion });
    if (shipment) {
        const inboundSchema = JSON.stringify(shipment.ActualShipment);
        const outboundSchema = JSON.stringify(ActualShipment.ActualShipment);
        if (inboundSchema === outboundSchema)
            return res.status(200).send(shipment);
        await schemaShipment_1.SchemaShipment.findByIdAndRemove(shipment._id);
    }
    shipment = new schemaShipment_1.SchemaShipment({ xmlNs: [xmlNsOtm, xmlNsGtm], gtmVersion, ...ActualShipment });
    shipment = await shipment.save();
    return res.status(200).send(shipment);
}));
router.get('/', other_1.asyncRouteHandler(async (req, res) => {
    const { gtmVersion } = req.query;
    if (!gtmVersion) {
        const shipment = await schemaShipment_1.SchemaShipment.find().sort({ gtmVersion: -1 });
        return res.status(200).send(shipment);
    }
    const shipment = await schemaShipment_1.SchemaShipment.findOne({ gtmVersion: gtmVersion });
    if (!shipment)
        return res.status(400).send(`gtmVersion:${gtmVersion} schema not available!`);
    return res.status(200).send(shipment);
}));
exports.default = router;
