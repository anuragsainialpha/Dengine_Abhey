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
const schemaTransactionProps_1 = require("../helper/Transaction/schemaTransactionProps");
const schemaTransaction_1 = require("../models/schemaTransaction");
router.post('/', other_1.asyncRouteHandler(async (req, res) => {
    const itemXmlPath = path_1.default.join(index_1.ROOT_DIR, 'XMLs', 'GtmTransaction.xml');
    const fileData = await other_1.getFileData(itemXmlPath);
    const tObj = fast_xml_parser_1.default.getTraversalObj(fileData, {});
    const jsonObj = fast_xml_parser_1.default.convertToJson(tObj, {});
    const flattenJson = flat_1.default(jsonObj);
    const Transaction = schemaTransactionProps_1.getChilds(flattenJson);
    const { gtmVersion, xmlNsOtm, xmlNsGtm } = other_1.getXMlVersion(fileData);
    if (!gtmVersion)
        return res.status(400).send('XML must contain Namespace');
    let transaction = await schemaTransaction_1.SchemaTransaction.findOne({ gtmVersion: gtmVersion });
    if (transaction) {
        const inboundSchema = JSON.stringify(transaction.GtmTransaction);
        const outboundSchema = JSON.stringify(Transaction.GtmTransaction);
        if (inboundSchema === outboundSchema)
            return res.status(200).send(transaction);
        await schemaTransaction_1.SchemaTransaction.findByIdAndRemove(transaction._id);
    }
    transaction = new schemaTransaction_1.SchemaTransaction({ xmlNs: [xmlNsOtm, xmlNsGtm], gtmVersion, ...Transaction });
    transaction = await transaction.save();
    return res.status(200).send(transaction);
}));
router.get('/', other_1.asyncRouteHandler(async (req, res) => {
    const { gtmVersion } = req.query;
    if (!gtmVersion) {
        const transaction = await schemaTransaction_1.SchemaTransaction.find().sort({ gtmVersion: -1 });
        return res.status(200).send(transaction);
    }
    const transaction = await schemaTransaction_1.SchemaTransaction.findOne({ gtmVersion: gtmVersion });
    if (!transaction)
        return res.status(400).send(`gtmVersion:${gtmVersion} schema not available!`);
    return res.status(200).send(transaction);
}));
exports.default = router;
async function generateTrxSchema() {
    const itemXmlPath = path_1.default.join(index_1.ROOT_DIR, 'XMLs', 'GtmTransaction.xml');
    const fileData = await other_1.getFileData(itemXmlPath);
    const tObj = fast_xml_parser_1.default.getTraversalObj(fileData, {});
    const jsonObj = fast_xml_parser_1.default.convertToJson(tObj, {});
    const flattenJson = flat_1.default(jsonObj);
    const Transaction = schemaTransactionProps_1.getChilds(flattenJson);
    let { gtmVersion, xmlNsOtm, xmlNsGtm } = other_1.getXMlVersion(fileData);
    if (!gtmVersion)
        gtmVersion = Number(other_1.CONSTS.GTMVERSION);
    const transaction = new schemaTransaction_1.SchemaTransaction({ xmlNs: [xmlNsOtm, xmlNsGtm], gtmVersion, ...Transaction });
    return transaction.save();
}
exports.generateTrxSchema = generateTrxSchema;
