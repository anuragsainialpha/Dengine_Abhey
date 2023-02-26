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
const schemaLocationProps_1 = require("../helper/Location/schemaLocationProps");
const schemaLocation_1 = require("../models/schemaLocation");
router.post('/', other_1.asyncRouteHandler(async (req, res) => {
    const locationXmlPath = path_1.default.join(index_1.ROOT_DIR, 'XMLs', 'Location.xml');
    const fileData = await other_1.getFileData(locationXmlPath);
    const tObj = fast_xml_parser_1.default.getTraversalObj(fileData, {});
    const jsonObj = fast_xml_parser_1.default.convertToJson(tObj, {});
    const flattenJson = flat_1.default(jsonObj);
    const LocationSchema = schemaLocationProps_1.getChilds(flattenJson);
    const { gtmVersion, xmlNsOtm, xmlNsGtm } = other_1.getXMlVersion(fileData);
    if (!gtmVersion)
        return res.status(400).send('XML must contain Namespace');
    let location = await schemaLocation_1.SchemaLocation.findOne({ gtmVersion: gtmVersion });
    if (location) {
        const inboundSchema = JSON.stringify(location.Location);
        const outboundSchema = JSON.stringify(LocationSchema.Location);
        if (inboundSchema === outboundSchema)
            return res.status(200).send(location);
        await schemaLocation_1.SchemaLocation.findByIdAndRemove(location._id);
    }
    location = new schemaLocation_1.SchemaLocation({ xmlNs: [xmlNsOtm, xmlNsGtm], gtmVersion, ...LocationSchema });
    location = await location.save();
    return res.status(200).send(location);
}));
router.get('/', other_1.asyncRouteHandler(async (req, res) => {
    const { gtmVersion } = req.query;
    if (!gtmVersion) {
        const location = await schemaLocation_1.SchemaLocation.find().sort({ gtmVersion: -1 });
        return res.status(200).send(location);
    }
    const location = await schemaLocation_1.SchemaLocation.findOne({ gtmVersion: gtmVersion });
    if (!location)
        return res.status(400).send(`gtmVersion:${gtmVersion} schema not available!`);
    return res.status(200).send(location);
}));
exports.default = router;
