import _ from 'lodash';
import promiseMemoize from 'promise-memoize';
import { TrackingEvent } from '../../models/trackingEvent';
import { SchemaTrackingEvent } from '../../models/schemaTrackingEvent';
import { mapHeader, mapRefnum } from './trackingEventProps';

function _getTrackingEventData(schemaTrackingEvent, gtmVersion, gtmData?, domain?) {
  return new Promise(function(resolve) {
    let { Header: TrackingEventHeader, Refnum } = schemaTrackingEvent.ShipmentStatus;
    const xmlNs = schemaTrackingEvent.xmlNs;
    TrackingEventHeader = TrackingEventHeader.map(e => mapHeader(e, 'TrackingEvent : Header', gtmVersion, xmlNs, domain));
    const refnumQuals = gtmData.match(/REFNUMS="(.*?)"/)[1].split(',');
    Refnum = refnumQuals.map((e, i) => mapRefnum(e, Refnum, 'TrackingEvent : Refnum', gtmVersion, xmlNs, i, domain));
    resolve(_.uniqBy([...TrackingEventHeader, ...Refnum], e => e.name));
  });
}

function _getUpdatedProp(ShipmentStatus, trackingEvent, instance?, domain?) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async function(resolve) {
    const newPropAddedinGtm = _.differenceWith(ShipmentStatus, trackingEvent, (a: any, b: any) => a.name === b.name);
    const newPropRemovedinGtm = _.differenceWith(trackingEvent, ShipmentStatus, (a: any, b: any) => a.name === b.name);
    if (newPropAddedinGtm.length > 0) {
      const ntrackingEvent = await TrackingEvent(domain, instance).insertMany(newPropAddedinGtm);
      resolve([...trackingEvent, ...ntrackingEvent]);
    } else if (newPropRemovedinGtm.length > 0) {
      await TrackingEvent(domain, instance).deleteMany({ _id: { $in: [...newPropRemovedinGtm.map(d => d._id)] } });
      resolve(_.differenceWith(trackingEvent, newPropRemovedinGtm, (a: any, b: any) => a.name === b.name));
    } else resolve(trackingEvent);
  });
}

function _getTrackingEventSchema(gtmVersion) {
  return SchemaTrackingEvent.findOne({ gtmVersion: gtmVersion }).sort({ _id: 1 });
}

export const getTrackingEventSchema = promiseMemoize(_getTrackingEventSchema, { maxAge: 60000 });
export const getTrackingEventData = promiseMemoize(_getTrackingEventData, { maxAge: 60000 });
export const getUpdatedProp = promiseMemoize(_getUpdatedProp, { maxAge: 60000 });
