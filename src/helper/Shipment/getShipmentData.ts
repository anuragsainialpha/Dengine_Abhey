import _ from 'lodash';
import promiseMemoize from 'promise-memoize';
import { Shipment } from '../../models/shipment';
import { SchemaShipment } from '../../models/schemaShipment';
import { mapHeader, mapRemark, mapRefnum } from './shipmentProps';

function _getShipmentData(schemaShipment, gtmVersion, gtmData?, domain?) {
  return new Promise(function(resolve) {
    let { Header: ShipmentHeader, Remark, Refnum } = schemaShipment.ActualShipment.Shipment;
    let { Header: StopHeader } = schemaShipment.ActualShipment.ShipmentStop;
    let { Header: ShipUnitHeader } = schemaShipment.ActualShipment.ShipUnit;
    const xmlNs = schemaShipment.xmlNs;
    ShipmentHeader = ShipmentHeader.map(e => mapHeader(e, 'Shipment : Header', gtmVersion, xmlNs, domain));
    StopHeader = StopHeader.map(e => mapHeader(e, 'Shipment Stop : Header', gtmVersion, xmlNs, domain));
    ShipUnitHeader = ShipUnitHeader.map(e => mapHeader(e, 'ShipUnit : Header', gtmVersion, xmlNs, domain));
    const remarkQuals = gtmData.match(/REMARKS="(.*?)"/)[1].split(',');
    Remark = remarkQuals.map((e, i) => mapRemark(e, Remark, 'Shipment : Remark', gtmVersion, xmlNs, i, domain));
    const refnumQuals = gtmData.match(/SHIPMENT_REFNUMS="(.*?)"/)[1].split(',');
    Refnum = refnumQuals.map((e, i) => mapRefnum(e, Refnum, 'Shipment : Refnum', gtmVersion, xmlNs, i, domain));
    resolve(_.uniqBy([...ShipmentHeader, ...Remark, ...Refnum, ...StopHeader, ...ShipUnitHeader], e => e.name));
  });
}

function _getUpdatedProp(ActualShipment, shipment, instance?, domain?) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async function(resolve) {
    const newPropAddedinGtm = _.differenceWith(ActualShipment, shipment, (a: any, b: any) => a.name === b.name);
    const newPropRemovedinGtm = _.differenceWith(shipment, ActualShipment, (a: any, b: any) => a.name === b.name);
    if (newPropAddedinGtm.length > 0) {
      const nshipment = await Shipment(domain, instance).insertMany(newPropAddedinGtm);
      resolve([...shipment, ...nshipment]);
    } else if (newPropRemovedinGtm.length > 0) {
      await Shipment(domain, instance).deleteMany({
        _id: { $in: [...newPropRemovedinGtm.map(d => d._id)] }
      });
      resolve(_.differenceWith(shipment, newPropRemovedinGtm, (a: any, b: any) => a.name === b.name));
    } else resolve(shipment);
  });
}

function _getShipmentSchema(gtmVersion) {
  return SchemaShipment.findOne({ gtmVersion: gtmVersion }).sort({ _id: 1 });
}

export const getShipmentSchema = promiseMemoize(_getShipmentSchema, { maxAge: 60000 });
export const getShipmentData = promiseMemoize(_getShipmentData, { maxAge: 60000 });
export const getUpdatedProp = promiseMemoize(_getUpdatedProp, { maxAge: 60000 });
