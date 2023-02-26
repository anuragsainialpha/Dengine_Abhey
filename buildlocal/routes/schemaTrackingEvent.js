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
const schemaTrackingEventProps_1 = require("../helper/TrackingEvent/schemaTrackingEventProps");
const schemaTrackingEvent_1 = require("../models/schemaTrackingEvent");
router.post('/', other_1.asyncRouteHandler(async (req, res) => {
    const itemXmlPath = path_1.default.join(index_1.ROOT_DIR, 'XMLs', 'TrackingEvent.xml');
    const fileData = await other_1.getFileData(itemXmlPath);
    const tObj = fast_xml_parser_1.default.getTraversalObj(fileData, {});
    const jsonObj = fast_xml_parser_1.default.convertToJson(tObj, {});
    const flattenJson = flat_1.default(jsonObj);
    const TrackingEventSchema = schemaTrackingEventProps_1.getChilds(flattenJson);
    const { gtmVersion, xmlNsOtm, xmlNsGtm } = other_1.getXMlVersion(fileData);
    if (!gtmVersion)
        return res.status(400).send('XML must contain Namespace');
    let trackingEvent = await schemaTrackingEvent_1.SchemaTrackingEvent.findOne({ gtmVersion: gtmVersion });
    if (trackingEvent) {
        const inboundSchema = JSON.stringify(trackingEvent.ShipmentStatus);
        const outboundSchema = JSON.stringify(TrackingEventSchema.ShipmentStatus);
        if (inboundSchema === outboundSchema)
            return res.status(200).send(trackingEvent);
        await schemaTrackingEvent_1.SchemaTrackingEvent.findByIdAndRemove(trackingEvent._id);
    }
    trackingEvent = new schemaTrackingEvent_1.SchemaTrackingEvent({ xmlNs: [xmlNsOtm, xmlNsGtm], gtmVersion, ...TrackingEventSchema });
    trackingEvent = await trackingEvent.save();
    return res.status(200).send(trackingEvent);
}));
router.get('/', other_1.asyncRouteHandler(async (req, res) => {
    const { gtmVersion } = req.query;
    if (!gtmVersion) {
        const trackingEvent = await schemaTrackingEvent_1.SchemaTrackingEvent.find().sort({ gtmVersion: -1 });
        return res.status(200).send(trackingEvent);
    }
    const trackingEvent = await schemaTrackingEvent_1.SchemaTrackingEvent.findOne({ gtmVersion: gtmVersion });
    if (!trackingEvent)
        return res.status(400).send(`gtmVersion:${gtmVersion} schema not available!`);
    return res.status(200).send(trackingEvent);
}));
exports.default = router;
