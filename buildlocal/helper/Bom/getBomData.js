"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const promise_memoize_1 = __importDefault(require("promise-memoize"));
const bom_1 = require("../../models/bom");
const schemaBom_1 = require("../../models/schemaBom");
const bomProps_1 = require("./bomProps");
function _getBomData(schemaBom, gtmVersion, gtmData, domain) {
    return new Promise(function (resolve) {
        let { Header: BomHeader, Remark: BomRemark, Refnum: BomRefnum, InvolvedParty: BomInvolvedParty } = schemaBom.Bom.Bom;
        let { Header: BomComponentHeader, Remark: BomComponentRemark, Refnum: BomComponentRefnum } = schemaBom.Bom.BomComponent;
        const xmlNs = schemaBom.xmlNs;
        BomHeader = BomHeader.map(e => bomProps_1.mapHeader(e, 'Bom : Header', gtmVersion, xmlNs, domain));
        BomComponentHeader = BomComponentHeader.map(e => bomProps_1.mapHeader(e, 'Bom Component : Header', gtmVersion, xmlNs, domain));
        const remarkQuals = gtmData.match(/REMARKS="(.*?)"/)[1].split(',');
        BomRemark = remarkQuals.map((e, i) => bomProps_1.mapRemark(e, BomRemark, 'Bom : Remark', gtmVersion, xmlNs, i, '', domain));
        BomComponentRemark = remarkQuals.map((e, i) => bomProps_1.mapRemark(e, BomComponentRemark, 'Bom Component : Remark', gtmVersion, xmlNs, i, 'Component', domain));
        const RefnumQuals = gtmData.match(/REFNUMS="(.*?)"/)[1].split(',');
        BomRefnum = RefnumQuals.map((e, i) => bomProps_1.mapRefnum(e, BomRefnum, 'Bom : Refnum', gtmVersion, xmlNs, i, '', domain));
        const componentRefnumQuals = gtmData.match(/COMPONENT_REFNUMS="(.*?)"/)[1].split(',');
        BomComponentRefnum = componentRefnumQuals.map((e, i) => bomProps_1.mapRefnum(e, BomComponentRefnum, 'Bom Component : Refnum', gtmVersion, xmlNs, i, 'Component', domain));
        const invPartyQuals = gtmData.match(/INVOLVED_PARTY="(.*?)"/)[1].split(',');
        BomInvolvedParty = invPartyQuals.map((e, i) => bomProps_1.mapInvolvedParty(e, BomInvolvedParty, 'Bom : Involved Party', gtmVersion, xmlNs, i, '', domain));
        resolve(lodash_1.default.uniqBy([
            ...BomHeader,
            ...BomRemark,
            ...BomRefnum,
            ...BomInvolvedParty,
            ...BomComponentHeader,
            ...BomComponentRemark,
            ...BomComponentRefnum
        ], e => e.name));
    });
}
function _getUpdatedProp(Bom, bom, instance, domain) {
    return new Promise(async function (resolve) {
        const newPropAddedinGtm = lodash_1.default.differenceWith(Bom, bom, (a, b) => a.name === b.name);
        const newPropRemovedinGtm = lodash_1.default.differenceWith(bom, Bom, (a, b) => a.name === b.name);
        if (newPropAddedinGtm.length > 0) {
            const nbom = await bom_1.Bom(domain, instance).insertMany(newPropAddedinGtm);
            resolve([...bom, ...nbom]);
        }
        else if (newPropRemovedinGtm.length > 0) {
            await bom_1.Bom(domain, instance).deleteMany({ _id: { $in: [...newPropRemovedinGtm.map(d => d._id)] } });
            resolve(lodash_1.default.differenceWith(bom, newPropRemovedinGtm, (a, b) => a.name === b.name));
        }
        else
            resolve(bom);
    });
}
function _getBomSchema(gtmVersion) {
    return schemaBom_1.SchemaBom.findOne({ gtmVersion: gtmVersion }).sort({ _id: 1 });
}
exports.getBomSchema = promise_memoize_1.default(_getBomSchema, { maxAge: 60000 });
exports.getBomData = promise_memoize_1.default(_getBomData, { maxAge: 60000 });
exports.getUpdatedProp = promise_memoize_1.default(_getUpdatedProp, { maxAge: 60000 });
