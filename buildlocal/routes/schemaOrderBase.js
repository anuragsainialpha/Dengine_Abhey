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
const schemaOrderBaseProps_1 = require("../helper/OrderBase/schemaOrderBaseProps");
const schemaOrderBase_1 = require("../models/schemaOrderBase");
router.post('/', other_1.asyncRouteHandler(async (req, res) => {
    const itemXmlPath = path_1.default.join(index_1.ROOT_DIR, 'XMLs', 'OrderBase.xml');
    const fileData = await other_1.getFileData(itemXmlPath);
    const tObj = fast_xml_parser_1.default.getTraversalObj(fileData, {});
    const jsonObj = fast_xml_parser_1.default.convertToJson(tObj, {});
    const flattenJson = flat_1.default(jsonObj);
    const TransOrder = schemaOrderBaseProps_1.getChilds(flattenJson);
    const { gtmVersion, xmlNsOtm, xmlNsGtm } = other_1.getXMlVersion(fileData);
    if (!gtmVersion)
        return res.status(400).send('XML must contain Namespace');
    let transorder = await schemaOrderBase_1.SchemaOrderBase.findOne({ gtmVersion: gtmVersion });
    if (transorder) {
        const inboundSchema = JSON.stringify(transorder.TransOrder);
        const outboundSchema = JSON.stringify(TransOrder.TransOrder);
        if (inboundSchema === outboundSchema)
            return res.status(200).send(transorder);
        await schemaOrderBase_1.SchemaOrderBase.findByIdAndRemove(transorder._id);
    }
    transorder = new schemaOrderBase_1.SchemaOrderBase({ xmlNs: [xmlNsOtm, xmlNsGtm], gtmVersion, ...TransOrder });
    transorder = await transorder.save();
    return res.status(200).send(transorder);
}));
router.get('/', other_1.asyncRouteHandler(async (req, res) => {
    const { gtmVersion } = req.query;
    if (!gtmVersion) {
        const orderbase = await schemaOrderBase_1.SchemaOrderBase.find().sort({ gtmVersion: -1 });
        return res.status(200).send(orderbase);
    }
    const orderbase = await schemaOrderBase_1.SchemaOrderBase.findOne({ gtmVersion: gtmVersion });
    if (!orderbase)
        return res.status(400).send(`gtmVersion:${gtmVersion} schema not available!`);
    return res.status(200).send(orderbase);
}));
exports.default = router;
