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
const schemaReleaseProps_1 = require("../helper/Release/schemaReleaseProps");
const schemaRelease_1 = require("../models/schemaRelease");
router.post('/', other_1.asyncRouteHandler(async (req, res) => {
    const itemXmlPath = path_1.default.join(index_1.ROOT_DIR, 'XMLs', 'OrderRelease.xml');
    const fileData = await other_1.getFileData(itemXmlPath);
    const tObj = fast_xml_parser_1.default.getTraversalObj(fileData, {});
    const jsonObj = fast_xml_parser_1.default.convertToJson(tObj, {});
    const flattenJson = flat_1.default(jsonObj);
    const Release = schemaReleaseProps_1.getChilds(flattenJson);
    const { gtmVersion, xmlNsOtm, xmlNsGtm } = other_1.getXMlVersion(fileData);
    if (!gtmVersion)
        return res.status(400).send('XML must contain Namespace');
    let release = await schemaRelease_1.SchemaRelease.findOne({ gtmVersion: gtmVersion });
    if (release) {
        const inboundSchema = JSON.stringify(release.Release);
        const outboundSchema = JSON.stringify(Release.Release);
        if (inboundSchema === outboundSchema)
            return res.status(200).send(release);
        await schemaRelease_1.SchemaRelease.findByIdAndRemove(release._id);
    }
    release = new schemaRelease_1.SchemaRelease({ xmlNs: [xmlNsOtm, xmlNsGtm], gtmVersion, ...Release });
    release = await release.save();
    return res.status(200).send(release);
}));
router.get('/', other_1.asyncRouteHandler(async (req, res) => {
    const { gtmVersion } = req.query;
    if (!gtmVersion) {
        const release = await schemaRelease_1.SchemaRelease.find().sort({ gtmVersion: -1 });
        return res.status(200).send(release);
    }
    const release = await schemaRelease_1.SchemaRelease.findOne({ gtmVersion: gtmVersion });
    if (!release)
        return res.status(400).send(`gtmVersion:${gtmVersion} schema not available!`);
    return res.status(200).send(release);
}));
exports.default = router;
