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
const schemaItemProps_1 = require("../helper/Item/schemaItemProps");
const schemaItem_1 = require("../models/schemaItem");
router.post('/', other_1.asyncRouteHandler(async (req, res) => {
    const itemXmlPath = path_1.default.join(index_1.ROOT_DIR, 'XMLs', 'Item.xml');
    const fileData = await other_1.getFileData(itemXmlPath);
    const tObj = fast_xml_parser_1.default.getTraversalObj(fileData, {});
    const jsonObj = fast_xml_parser_1.default.convertToJson(tObj, {});
    const flattenJson = flat_1.default(jsonObj);
    const ItemSchema = schemaItemProps_1.getChilds(flattenJson);
    const { gtmVersion, xmlNsOtm, xmlNsGtm } = other_1.getXMlVersion(fileData);
    if (!gtmVersion)
        return res.status(400).send('XML must contain Namespace');
    let item = await schemaItem_1.SchemaItem.findOne({ gtmVersion: gtmVersion });
    if (item) {
        const inboundSchema = JSON.stringify(item.ItemMaster);
        const outboundSchema = JSON.stringify(ItemSchema.ItemMaster);
        if (inboundSchema === outboundSchema)
            return res.status(200).send(item);
        await schemaItem_1.SchemaItem.findByIdAndRemove(item._id);
    }
    item = new schemaItem_1.SchemaItem({ xmlNs: [xmlNsOtm, xmlNsGtm], gtmVersion, ...ItemSchema });
    item = await item.save();
    return res.status(200).send(item);
}));
router.get('/', other_1.asyncRouteHandler(async (req, res) => {
    const { gtmVersion } = req.query;
    if (!gtmVersion) {
        const item = await schemaItem_1.SchemaItem.find().sort({ gtmVersion: -1 });
        return res.status(200).send(item);
    }
    const item = await schemaItem_1.SchemaItem.findOne({ gtmVersion: gtmVersion });
    if (!item)
        return res.status(400).send(`gtmVersion:${gtmVersion} schema not available!`);
    return res.status(200).send(item);
}));
exports.default = router;
async function generateItemSchema() {
    const itemXmlPath = path_1.default.join(index_1.ROOT_DIR, 'XMLs', 'Item.xml');
    const fileData = await other_1.getFileData(itemXmlPath);
    const tObj = fast_xml_parser_1.default.getTraversalObj(fileData, {});
    const jsonObj = fast_xml_parser_1.default.convertToJson(tObj, {});
    const flattenJson = flat_1.default(jsonObj);
    const ItemSchema = schemaItemProps_1.getChilds(flattenJson);
    let { gtmVersion, xmlNsOtm, xmlNsGtm } = other_1.getXMlVersion(fileData);
    if (!gtmVersion)
        gtmVersion = Number(other_1.CONSTS.GTMVERSION);
    let item = new schemaItem_1.SchemaItem({ xmlNs: [xmlNsOtm, xmlNsGtm], gtmVersion, ...ItemSchema });
    return item.save();
}
exports.generateItemSchema = generateItemSchema;
