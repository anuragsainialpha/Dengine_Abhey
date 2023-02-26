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
const schemaPartyProps_1 = require("../helper/Party/schemaPartyProps");
const schemaParty_1 = require("../models/schemaParty");
router.post('/', other_1.asyncRouteHandler(async (req, res) => {
    const itemXmlPath = path_1.default.join(index_1.ROOT_DIR, 'XMLs', 'Party.xml');
    const fileData = await other_1.getFileData(itemXmlPath);
    const tObj = fast_xml_parser_1.default.getTraversalObj(fileData, {});
    const jsonObj = fast_xml_parser_1.default.convertToJson(tObj, {});
    const flattenJson = flat_1.default(jsonObj);
    const PartySchema = schemaPartyProps_1.getChilds(flattenJson);
    const { gtmVersion, xmlNsOtm, xmlNsGtm } = other_1.getXMlVersion(fileData);
    if (!gtmVersion)
        return res.status(400).send('XML must contain Namespace');
    let party = await schemaParty_1.SchemaParty.findOne({ gtmVersion: gtmVersion });
    if (party) {
        const inboundSchema = JSON.stringify(party.GtmContact);
        const outboundSchema = JSON.stringify(PartySchema.GtmContact);
        if (inboundSchema === outboundSchema)
            return res.status(200).send(party);
        await schemaParty_1.SchemaParty.findByIdAndRemove(party._id);
    }
    party = new schemaParty_1.SchemaParty({ xmlNs: [xmlNsOtm, xmlNsGtm], gtmVersion, ...PartySchema });
    party = await party.save();
    return res.status(200).send(party);
}));
router.get('/', other_1.asyncRouteHandler(async (req, res) => {
    const { gtmVersion } = req.query;
    if (!gtmVersion) {
        const party = await schemaParty_1.SchemaParty.find().sort({ gtmVersion: -1 });
        return res.status(200).send(party);
    }
    const party = await schemaParty_1.SchemaParty.findOne({ gtmVersion: gtmVersion });
    if (!party)
        return res.status(400).send(`gtmVersion:${gtmVersion} schema not available!`);
    return res.status(200).send(party);
}));
exports.default = router;
async function generatePartySchema() {
    const itemXmlPath = path_1.default.join(index_1.ROOT_DIR, 'XMLs', 'Party.xml');
    const fileData = await other_1.getFileData(itemXmlPath);
    const tObj = fast_xml_parser_1.default.getTraversalObj(fileData, {});
    const jsonObj = fast_xml_parser_1.default.convertToJson(tObj, {});
    const flattenJson = flat_1.default(jsonObj);
    const PartySchema = schemaPartyProps_1.getChilds(flattenJson);
    let { gtmVersion, xmlNsOtm, xmlNsGtm } = other_1.getXMlVersion(fileData);
    if (!gtmVersion)
        gtmVersion = Number(other_1.CONSTS.GTMVERSION);
    let party = new schemaParty_1.SchemaParty({ xmlNs: [xmlNsOtm, xmlNsGtm], gtmVersion, ...PartySchema });
    return party.save();
}
exports.generatePartySchema = generatePartySchema;
