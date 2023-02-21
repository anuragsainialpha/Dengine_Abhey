import _ from 'lodash';
import promiseMemoize from 'promise-memoize';
import { Location } from '../../models/location';
import { SchemaLocation } from '../../models/schemaLocation';
import { mapHeader, mapRemark, mapRefnum, mapAddressLine } from './locationProps';

function _getLocationData(schemaLocation, gtmVersion, gtmData?, domain?) {
  return new Promise(function(resolve) {
    let { Header: LocationHeader, Remark, Refnum } = schemaLocation.Location;
    let { AddressLines: AddressLine } = schemaLocation.Location;
    let { Header: ContactHeader } = schemaLocation.Location.Contact;
    let { Header: ServiceProviderHeader } = schemaLocation.Location.ServiceProvider;
    const xmlNs = schemaLocation.xmlNs;
    LocationHeader = LocationHeader.map(e => mapHeader(e, 'Location : Header', gtmVersion, xmlNs, domain));
    ContactHeader = ContactHeader.map(e => mapHeader(e, 'Party : Header', gtmVersion, xmlNs, domain));
    ServiceProviderHeader = ServiceProviderHeader.map(e =>
      mapHeader(e, 'ServiceProvider : Header', gtmVersion, xmlNs, domain)
    );
    const remarkQuals = gtmData.match(/REMARKS="(.*?)"/)[1].split(',');
    Remark = remarkQuals.map((e, i) => mapRemark(e, Remark, 'Location : Remark', gtmVersion, xmlNs, i, domain));
    const refnumQuals = gtmData.match(/REFNUMS="(.*?)"/)[1].split(',');
    Refnum = refnumQuals.map((e, i) => mapRefnum(e, Refnum, 'Location : Refnum', gtmVersion, xmlNs, i, domain));
    // Address line
    AddressLine = [1, 2, 3].map(e =>
      mapAddressLine(`Address Line ${e}`, AddressLine, 'Location : Address Line', gtmVersion, xmlNs, e - 1, '', domain)
    );
    resolve(
      _.uniqBy(
        [...LocationHeader, ...Remark, ...Refnum, ...AddressLine, ...ContactHeader, ...ServiceProviderHeader],
        e => e.name
      )
    );
  });
}

function _getUpdatedProp(Locations, location, instance?, domain?) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async function(resolve) {
    const newPropAddedinGtm = _.differenceWith(Locations, location, (a: any, b: any) => a.name === b.name);
    const newPropRemovedinGtm = _.differenceWith(location, Locations, (a: any, b: any) => a.name === b.name);
    if (newPropAddedinGtm.length > 0) {
      const nlocation = await Location(domain, instance).insertMany(newPropAddedinGtm);
      resolve([...location, ...nlocation]);
    } else if (newPropRemovedinGtm.length > 0) {
      await Location(domain, instance).deleteMany({
        _id: { $in: [...newPropRemovedinGtm.map(d => d._id)] }
      });
      resolve(_.differenceWith(location, newPropRemovedinGtm, (a: any, b: any) => a.name === b.name));
    } else resolve(location);
  });
}

function _getLocationSchema(gtmVersion) {
  return SchemaLocation.findOne({ gtmVersion: gtmVersion }).sort({ _id: 1 });
}

export const getLocationSchema = promiseMemoize(_getLocationSchema, { maxAge: 60000 });
export const getLocationData = promiseMemoize(_getLocationData, { maxAge: 60000 });
export const getUpdatedProp = promiseMemoize(_getUpdatedProp, { maxAge: 60000 });
