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
const schemaBomProps_1 = require("../helper/Bom/schemaBomProps");
const schemaBom_1 = require("../models/schemaBom");
router.post('/', other_1.asyncRouteHandler(async (req, res) => {
    const itemXmlPath = path_1.default.join(index_1.ROOT_DIR, 'XMLs', 'GtmStructure.xml');
    const fileData = await other_1.getFileData(itemXmlPath);
    const tObj = fast_xml_parser_1.default.getTraversalObj(fileData, {});
    const jsonObj = fast_xml_parser_1.default.convertToJson(tObj, {});
    const flattenJson = flat_1.default(jsonObj);
    const BomSchema = schemaBomProps_1.getChilds(flattenJson);
    const { gtmVersion, xmlNsOtm, xmlNsGtm } = other_1.getXMlVersion(fileData);
    if (!gtmVersion)
        return res.status(400).send('XML must contain Namespace');
    let bom = await schemaBom_1.SchemaBom.findOne({ gtmVersion: gtmVersion });
    if (bom) {
        const inboundSchema = JSON.stringify(bom.Bom);
        const outboundSchema = JSON.stringify(BomSchema.Bom);
        if (inboundSchema === outboundSchema)
            return res.status(200).send(bom);
        await schemaBom_1.SchemaBom.findByIdAndRemove(bom._id);
    }
    bom = new schemaBom_1.SchemaBom({ xmlNs: [xmlNsOtm, xmlNsGtm], gtmVersion, ...BomSchema });
    bom = await bom.save();
    return res.status(200).send(bom);
}));
router.get('/', other_1.asyncRouteHandler(async (req, res) => {
    const { gtmVersion } = req.query;
    if (!gtmVersion) {
        const bom = await schemaBom_1.SchemaBom.find().sort({ gtmVersion: -1 });
        return res.status(200).send(bom);
    }
    const bom = await schemaBom_1.SchemaBom.findOne({ gtmVersion: gtmVersion });
    if (!bom)
        return res.status(400).send(`gtmVersion:${gtmVersion} schema not available!`);
    return res.status(200).send(bom);
}));
exports.default = router;
async function generateBomSchema() {
    const itemXmlPath = path_1.default.join(index_1.ROOT_DIR, 'XMLs', 'GtmStructure.xml');
    const fileData = await other_1.getFileData(itemXmlPath);
    const tObj = fast_xml_parser_1.default.getTraversalObj(fileData, {});
    const jsonObj = fast_xml_parser_1.default.convertToJson(tObj, {});
    const flattenJson = flat_1.default(jsonObj);
    const BomSchema = schemaBomProps_1.getChilds(flattenJson);
    let { gtmVersion, xmlNsOtm, xmlNsGtm } = other_1.getXMlVersion(fileData);
    if (!gtmVersion)
        gtmVersion = Number(other_1.CONSTS.GTMVERSION);
    const bom = new schemaBom_1.SchemaBom({ xmlNs: [xmlNsOtm, xmlNsGtm], gtmVersion, ...BomSchema });
    return bom.save();
}
exports.generateBomSchema = generateBomSchema;
