"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const promise_memoize_1 = __importDefault(require("promise-memoize"));
const location_1 = require("../../models/location");
const schemaLocation_1 = require("../../models/schemaLocation");
const locationProps_1 = require("./locationProps");
function _getLocationData(schemaLocation, gtmVersion, gtmData, domain) {
    return new Promise(function (resolve) {
        let { Header: LocationHeader, Remark, Refnum } = schemaLocation.Location;
        let { AddressLines: AddressLine } = schemaLocation.Location;
        let { Header: ContactHeader } = schemaLocation.Location.Contact;
        let { Header: ServiceProviderHeader } = schemaLocation.Location.ServiceProvider;
        const xmlNs = schemaLocation.xmlNs;
        LocationHeader = LocationHeader.map(e => locationProps_1.mapHeader(e, 'Location : Header', gtmVersion, xmlNs, domain));
        ContactHeader = ContactHeader.map(e => locationProps_1.mapHeader(e, 'Party : Header', gtmVersion, xmlNs, domain));
        ServiceProviderHeader = ServiceProviderHeader.map(e => locationProps_1.mapHeader(e, 'ServiceProvider : Header', gtmVersion, xmlNs, domain));
        const remarkQuals = gtmData.match(/REMARKS="(.*?)"/)[1].split(',');
        Remark = remarkQuals.map((e, i) => locationProps_1.mapRemark(e, Remark, 'Location : Remark', gtmVersion, xmlNs, i, domain));
        const refnumQuals = gtmData.match(/REFNUMS="(.*?)"/)[1].split(',');
        Refnum = refnumQuals.map((e, i) => locationProps_1.mapRefnum(e, Refnum, 'Location : Refnum', gtmVersion, xmlNs, i, domain));
        AddressLine = [1, 2, 3].map(e => locationProps_1.mapAddressLine(`Address Line ${e}`, AddressLine, 'Location : Address Line', gtmVersion, xmlNs, e - 1, '', domain));
        resolve(lodash_1.default.uniqBy([...LocationHeader, ...Remark, ...Refnum, ...AddressLine, ...ContactHeader, ...ServiceProviderHeader], e => e.name));
    });
}
function _getUpdatedProp(Locations, location, instance, domain) {
    return new Promise(async function (resolve) {
        const newPropAddedinGtm = lodash_1.default.differenceWith(Locations, location, (a, b) => a.name === b.name);
        const newPropRemovedinGtm = lodash_1.default.differenceWith(location, Locations, (a, b) => a.name === b.name);
        if (newPropAddedinGtm.length > 0) {
            const nlocation = await location_1.Location(domain, instance).insertMany(newPropAddedinGtm);
            resolve([...location, ...nlocation]);
        }
        else if (newPropRemovedinGtm.length > 0) {
            await location_1.Location(domain, instance).deleteMany({
                _id: { $in: [...newPropRemovedinGtm.map(d => d._id)] }
            });
            resolve(lodash_1.default.differenceWith(location, newPropRemovedinGtm, (a, b) => a.name === b.name));
        }
        else
            resolve(location);
    });
}
function _getLocationSchema(gtmVersion) {
    return schemaLocation_1.SchemaLocation.findOne({ gtmVersion: gtmVersion }).sort({ _id: 1 });
}
exports.getLocationSchema = promise_memoize_1.default(_getLocationSchema, { maxAge: 60000 });
exports.getLocationData = promise_memoize_1.default(_getLocationData, { maxAge: 60000 });
exports.getUpdatedProp = promise_memoize_1.default(_getUpdatedProp, { maxAge: 60000 });
