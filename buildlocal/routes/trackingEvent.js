"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const other_1 = require("../helper/other");
const dbXmlQuery_1 = require("../helper/dbXmlQuery");
const getTrackingEventData_1 = require("../helper/TrackingEvent/getTrackingEventData");
const gtm_1 = require("../api/gtm");
const trackingEvent_1 = require("../models/trackingEvent");
const auth_1 = __importDefault(require("../middleware/auth"));
router.get('/', [auth_1.default], other_1.asyncRouteHandler(async (req, res) => {
    const { display } = req.query;
    const { username, password, instance, url } = req.user;
    const domain = username.split('.')[0];
    if (display) {
        const trackingEvent = await trackingEvent_1.TrackingEvent(domain, instance)
            .find({ display: display })
            .sort({ _id: 1 });
        if (trackingEvent.length)
            return res.status(200).json({ data: trackingEvent });
    }
    const gtmVersion = +req.query.gtmVersion || +other_1.CONSTS.GTMVERSION;
    const schemaTrackingEvent = await getTrackingEventData_1.getTrackingEventSchema(gtmVersion);
    if (!schemaTrackingEvent)
        return res.status(400).send(`gtmVersion:${gtmVersion} schema not available!`);
    const { data: gtmData, error } = await other_1.asyncHandler(gtm_1.dbXml(url, dbXmlQuery_1.getTrackingEventPropfromOtm, username, password));
    if (error)
        return res.status(400).send(error);
    const ShipmentStatus = await getTrackingEventData_1.getTrackingEventData(schemaTrackingEvent, gtmVersion, gtmData);
    let trackingEvent = await trackingEvent_1.TrackingEvent(domain, instance)
        .find({})
        .sort({ _id: 1 });
    if (!trackingEvent || trackingEvent.length === 0) {
        return res.status(200).json({ data: await trackingEvent_1.TrackingEvent(domain, instance).insertMany(ShipmentStatus) });
    }
    trackingEvent = await getTrackingEventData_1.getUpdatedProp(ShipmentStatus, trackingEvent, instance, domain);
    if (display)
        return res.status(200).json({ data: trackingEvent.filter(d => d.display) });
    return res.status(200).json({ data: trackingEvent });
}));
router.put('/', [auth_1.default], other_1.asyncRouteHandler(async (req, res) => {
    const { instance, username } = req.user;
    const domain = username.split('.')[0];
    let { trackingEvent } = req.body;
    if (!trackingEvent)
        return res.status(400).send('Tracking Event prop value missing!');
    trackingEvent = await trackingEvent_1.TrackingEvent(domain, instance).findByIdAndUpdate(trackingEvent._id, trackingEvent, { new: true });
    return res.status(200).json({ data: trackingEvent });
}));
exports.default = router;
