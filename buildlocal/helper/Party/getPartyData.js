"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const promise_memoize_1 = __importDefault(require("promise-memoize"));
const party_1 = require("../../models/party");
const schemaParty_1 = require("../../models/schemaParty");
const partyProps_1 = require("./partyProps");
function _getPartyData(schemaParty, gtmVersion, gtmData, domain) {
    return new Promise(function (resolve) {
        let { Header: PHeader, Remark: PRemark, Refnum: PRefnum } = schemaParty.GtmContact.Contact;
        let { Header: PLocRef } = schemaParty.GtmContact.LocationRef;
        let { AddressLines: AddLine } = schemaParty.GtmContact.LocationRef;
        const xmlNs = schemaParty.xmlNs;
        ({ PHeader, PLocRef } = getHeaders(PHeader, gtmVersion, xmlNs, domain, PLocRef));
        PRemark = getRemarks(gtmData, PRemark, gtmVersion, xmlNs, domain);
        PRefnum = getRefnums(gtmData, PRefnum, gtmVersion, xmlNs, domain);
        AddLine = getAddLines(AddLine, gtmVersion, xmlNs, domain);
        resolve(lodash_1.default.uniqBy([...PHeader, ...PRemark, ...PRefnum, ...PLocRef, ...AddLine], filterByName()));
    });
}
function getAddLines(AddLine, gtmVersion, xmlNs, domain) {
    AddLine = [1, 2, 3].map(getMappedAddLines(AddLine, gtmVersion, xmlNs, domain));
    return AddLine;
}
function getRefnums(gtmData, PRefnum, gtmVersion, xmlNs, domain) {
    const refnumQuals = gtmData.match(/REFNUMS="(.*?)"/)[1].split(',');
    PRefnum = refnumQuals.map(getMappedRefnums(PRefnum, gtmVersion, xmlNs, domain));
    return PRefnum;
}
function getRemarks(gtmData, PRemark, gtmVersion, xmlNs, domain) {
    const remarkQuals = gtmData.match(/REMARKS="(.*?)"/)[1].split(',');
    PRemark = remarkQuals.map(getMappedRemarks(PRemark, gtmVersion, xmlNs, domain));
    return PRemark;
}
function getHeaders(PHeader, gtmVersion, xmlNs, domain, PLocRef) {
    PHeader = PHeader.map(getMappedHeaders(gtmVersion, xmlNs, domain));
    PLocRef = PLocRef.map(getMappedLocRefs(gtmVersion, xmlNs, domain));
    return { PHeader, PLocRef };
}
function filterByName() {
    return (e) => e.name;
}
function getMappedAddLines(AddLine, gtmVersion, xmlNs, domain) {
    return (e) => partyProps_1.mapAddressLine(`Address Line ${e}`, AddLine, 'Party : Address Line', gtmVersion, xmlNs, e - 1, '', domain);
}
function getMappedRefnums(PRefnum, gtmVersion, xmlNs, domain) {
    return (e, i) => partyProps_1.mapRefnum(e, PRefnum, 'Party : Refnum', gtmVersion, xmlNs, i, '', domain);
}
function getMappedRemarks(PRemark, gtmVersion, xmlNs, domain) {
    return (e, i) => partyProps_1.mapRemark(e, PRemark, 'Party : Remark', gtmVersion, xmlNs, i, '', domain);
}
function getMappedLocRefs(gtmVersion, xmlNs, domain) {
    return (e) => partyProps_1.mapHeader(e, 'LocationRef : Header', gtmVersion, xmlNs, domain);
}
function getMappedHeaders(gtmVersion, xmlNs, domain) {
    return (e) => partyProps_1.mapHeader(e, 'Party : Header', gtmVersion, xmlNs, domain);
}
function _getUpdatedProp(GtmContact, party, instance, domain) {
    return new Promise(async function (resolve) {
        const newPropAddedinGtm = lodash_1.default.differenceWith(GtmContact, party, (a, b) => a.name === b.name);
        const newPropRemovedinGtm = lodash_1.default.differenceWith(party, GtmContact, (a, b) => a.name === b.name);
        if (newPropAddedinGtm.length > 0) {
            const nparty = await party_1.Party(domain, instance).insertMany(newPropAddedinGtm);
            resolve([...party, ...nparty]);
        }
        else if (newPropRemovedinGtm.length > 0) {
            await party_1.Party(domain, instance).deleteMany({ _id: { $in: [...newPropRemovedinGtm.map((d) => d._id)] } });
            resolve(lodash_1.default.differenceWith(party, newPropRemovedinGtm, (a, b) => a.name === b.name));
        }
        else
            resolve(party);
    });
}
function _getPartySchema(gtmVersion) {
    return schemaParty_1.SchemaParty.findOne({ gtmVersion: gtmVersion }).sort({ _id: 1 });
}
exports.getPartySchema = promise_memoize_1.default(_getPartySchema, { maxAge: 60000 });
exports.getPartyData = promise_memoize_1.default(_getPartyData, { maxAge: 60000 });
exports.getUpdatedProp = promise_memoize_1.default(_getUpdatedProp, { maxAge: 60000 });
