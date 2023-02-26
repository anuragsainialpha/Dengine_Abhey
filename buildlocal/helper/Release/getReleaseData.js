"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const promise_memoize_1 = __importDefault(require("promise-memoize"));
const release_1 = require("../../models/release");
const schemaRelease_1 = require("../../models/schemaRelease");
const releaseProps_1 = require("./releaseProps");
function _getReleaseData(schemaRelease, gtmVersion, gtmData, domain) {
    return new Promise(function (resolve) {
        let { Header: ReleaseHeader, Remark: ReleaseRemark, Refnum: ReleaseRefnum, InvolvedParty: ReleaseInvolvedParty } = schemaRelease.Release.Release;
        let { Header: LineHeader, Remark: LineRemark, Refnum: LineRefnum, InvolvedParty: LineInvolvedParty } = schemaRelease.Release.ReleaseLine;
        const xmlNs = schemaRelease.xmlNs;
        ReleaseHeader = ReleaseHeader.map(e => releaseProps_1.mapHeader(e, 'Release : Header', gtmVersion, xmlNs, domain));
        LineHeader = LineHeader.map(e => releaseProps_1.mapHeader(e, 'Release Line : Header', gtmVersion, xmlNs, domain));
        const remarkQuals = gtmData.match(/REMARKS="(.*?)"/)[1].split(',');
        ReleaseRemark = remarkQuals.map((e, i) => releaseProps_1.mapRemark(e, ReleaseRemark, 'Release : Remark', gtmVersion, xmlNs, i, '', domain));
        LineRemark = remarkQuals.map((e, i) => releaseProps_1.mapRemark(e, LineRemark, 'Release Line : Remark', gtmVersion, xmlNs, i, 'Line', domain));
        const invPartyQuals = gtmData.match(/INVOLVED_PARTY="(.*?)"/)[1].split(',');
        ReleaseInvolvedParty = invPartyQuals.map((e, i) => releaseProps_1.mapInvolvedParty(e, ReleaseInvolvedParty, 'Release : Involved Party', gtmVersion, xmlNs, i, '', domain));
        LineInvolvedParty = invPartyQuals.map((e, i) => releaseProps_1.mapInvolvedParty(e, LineInvolvedParty, 'Release Line : Involved Party', gtmVersion, xmlNs, i, 'Line', domain));
        const relRefnumQuals = gtmData.match(/RELEASE_REFNUMS="(.*?)"/)[1].split(',');
        ReleaseRefnum = relRefnumQuals.map((e, i) => releaseProps_1.mapRefnum(e, ReleaseRefnum, 'Release : Refnum', gtmVersion, xmlNs, i, '', domain));
        const relLineRefnumQuals = gtmData.match(/RELEASE_LINE_REFNUMS="(.*?)"/)[1].split(',');
        LineRefnum = relLineRefnumQuals.map((e, i) => releaseProps_1.mapRefnum(e, LineRefnum, 'Release Line : Refnum', gtmVersion, xmlNs, i, 'Line', domain));
        resolve(lodash_1.default.uniqBy([
            ...ReleaseHeader,
            ...ReleaseRemark,
            ...ReleaseRefnum,
            ...ReleaseInvolvedParty,
            ...LineHeader,
            ...LineRemark,
            ...LineRefnum,
            ...LineInvolvedParty
        ], e => e.name));
    });
}
function _getUpdatedProp(Release, release, instance, domain) {
    return new Promise(async function (resolve) {
        const newPropAddedinGtm = lodash_1.default.differenceWith(Release, release, (a, b) => a.name === b.name);
        const newPropRemovedinGtm = lodash_1.default.differenceWith(release, Release, (a, b) => a.name === b.name);
        if (newPropAddedinGtm.length > 0) {
            const nrelease = await release_1.Release(domain, instance).insertMany(newPropAddedinGtm);
            resolve([...release, ...nrelease]);
        }
        else if (newPropRemovedinGtm.length > 0) {
            await release_1.Release(domain, instance).deleteMany({ _id: { $in: [...newPropRemovedinGtm.map(d => d._id)] } });
            resolve(lodash_1.default.differenceWith(release, newPropRemovedinGtm, (a, b) => a.name === b.name));
        }
        else
            resolve(release);
    });
}
function _getReleaseSchema(gtmVersion) {
    return schemaRelease_1.SchemaRelease.findOne({ gtmVersion: gtmVersion }).sort({ _id: 1 });
}
exports.getReleaseSchema = promise_memoize_1.default(_getReleaseSchema, { maxAge: 60000 });
exports.getReleaseData = promise_memoize_1.default(_getReleaseData, { maxAge: 60000 });
exports.getUpdatedProp = promise_memoize_1.default(_getUpdatedProp, { maxAge: 60000 });
