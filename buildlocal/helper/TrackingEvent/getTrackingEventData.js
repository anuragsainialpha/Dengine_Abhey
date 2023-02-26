"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const promise_memoize_1 = __importDefault(require("promise-memoize"));
const trackingEvent_1 = require("../../models/trackingEvent");
const schemaTrackingEvent_1 = require("../../models/schemaTrackingEvent");
const trackingEventProps_1 = require("./trackingEventProps");
function _getTrackingEventData(schemaTrackingEvent, gtmVersion, gtmData, domain) {
    return new Promise(function (resolve) {
        let { Header: TrackingEventHeader, Refnum } = schemaTrackingEvent.ShipmentStatus;
        const xmlNs = schemaTrackingEvent.xmlNs;
        TrackingEventHeader = TrackingEventHeader.map(e => trackingEventProps_1.mapHeader(e, 'TrackingEvent : Header', gtmVersion, xmlNs, domain));
        const refnumQuals = gtmData.match(/REFNUMS="(.*?)"/)[1].split(',');
        Refnum = refnumQuals.map((e, i) => trackingEventProps_1.mapRefnum(e, Refnum, 'TrackingEvent : Refnum', gtmVersion, xmlNs, i, domain));
        resolve(lodash_1.default.uniqBy([...TrackingEventHeader, ...Refnum], e => e.name));
    });
}
function _getUpdatedProp(ShipmentStatus, trackingEvent, instance, domain) {
    return new Promise(async function (resolve) {
        const newPropAddedinGtm = lodash_1.default.differenceWith(ShipmentStatus, trackingEvent, (a, b) => a.name === b.name);
        const newPropRemovedinGtm = lodash_1.default.differenceWith(trackingEvent, ShipmentStatus, (a, b) => a.name === b.name);
        if (newPropAddedinGtm.length > 0) {
            const ntrackingEvent = await trackingEvent_1.TrackingEvent(domain, instance).insertMany(newPropAddedinGtm);
            resolve([...trackingEvent, ...ntrackingEvent]);
        }
        else if (newPropRemovedinGtm.length > 0) {
            await trackingEvent_1.TrackingEvent(domain, instance).deleteMany({ _id: { $in: [...newPropRemovedinGtm.map(d => d._id)] } });
            resolve(lodash_1.default.differenceWith(trackingEvent, newPropRemovedinGtm, (a, b) => a.name === b.name));
        }
        else
            resolve(trackingEvent);
    });
}
function _getTrackingEventSchema(gtmVersion) {
    return schemaTrackingEvent_1.SchemaTrackingEvent.findOne({ gtmVersion: gtmVersion }).sort({ _id: 1 });
}
exports.getTrackingEventSchema = promise_memoize_1.default(_getTrackingEventSchema, { maxAge: 60000 });
exports.getTrackingEventData = promise_memoize_1.default(_getTrackingEventData, { maxAge: 60000 });
exports.getUpdatedProp = promise_memoize_1.default(_getUpdatedProp, { maxAge: 60000 });
