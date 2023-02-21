import _ from 'lodash';
import promiseMemoize from 'promise-memoize';
import { Bom as BomModel } from '../../models/bom';
import { SchemaBom } from '../../models/schemaBom';
import { mapHeader, mapRemark, mapRefnum, mapInvolvedParty } from './bomProps';

function _getBomData(schemaBom, gtmVersion, gtmData?, domain?) {
  return new Promise(function(resolve) {
    let {
      Header: BomHeader,
      Remark: BomRemark,
      Refnum: BomRefnum,
      InvolvedParty: BomInvolvedParty
    } = schemaBom.Bom.Bom;
    let {
      Header: BomComponentHeader,
      Remark: BomComponentRemark,
      Refnum: BomComponentRefnum
    } = schemaBom.Bom.BomComponent;
    const xmlNs = schemaBom.xmlNs;
    BomHeader = BomHeader.map(e => mapHeader(e, 'Bom : Header', gtmVersion, xmlNs, domain));
    BomComponentHeader = BomComponentHeader.map(e => mapHeader(e, 'Bom Component : Header', gtmVersion, xmlNs, domain));
    const remarkQuals = gtmData.match(/REMARKS="(.*?)"/)[1].split(',');
    BomRemark = remarkQuals.map((e, i) => mapRemark(e, BomRemark, 'Bom : Remark', gtmVersion, xmlNs, i, '', domain));
    BomComponentRemark = remarkQuals.map((e, i) => mapRemark(e, BomComponentRemark, 'Bom Component : Remark', gtmVersion, xmlNs, i, 'Component', domain));
  
    const RefnumQuals = gtmData.match(/REFNUMS="(.*?)"/)[1].split(',');
    BomRefnum = RefnumQuals.map((e, i) =>
      mapRefnum(e, BomRefnum, 'Bom : Refnum', gtmVersion, xmlNs, i, '', domain)
    );
    const componentRefnumQuals = gtmData.match(/COMPONENT_REFNUMS="(.*?)"/)[1].split(',');
    BomComponentRefnum = componentRefnumQuals.map((e, i) => mapRefnum(e, BomComponentRefnum, 'Bom Component : Refnum', gtmVersion, xmlNs, i, 'Component', domain));

    const invPartyQuals = gtmData.match(/INVOLVED_PARTY="(.*?)"/)[1].split(',');
    BomInvolvedParty = invPartyQuals.map((e, i) =>
      mapInvolvedParty(e, BomInvolvedParty, 'Bom : Involved Party', gtmVersion, xmlNs, i, '', domain)
    );
    // BomComponentInvolvedParty = invPartyQuals.map((e, i) =>
    //   mapInvolvedParty(e, BomComponentInvolvedParty, 'Bom Component : Involved Party', gtmVersion, xmlNs, i, 'Component', domain)
    // );

    resolve(
      _.uniqBy(
        [
          ...BomHeader,
          ...BomRemark,
          ...BomRefnum,
          ...BomInvolvedParty,
          ...BomComponentHeader,
          ...BomComponentRemark,
          ...BomComponentRefnum
        ],
        e => e.name
      )
    );
  });
}

function _getUpdatedProp(Bom, bom, instance?, domain?) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async function(resolve) {
    const newPropAddedinGtm = _.differenceWith(Bom, bom, (a: any, b: any) => a.name === b.name);
    const newPropRemovedinGtm = _.differenceWith(bom, Bom, (a: any, b: any) => a.name === b.name);
    if (newPropAddedinGtm.length > 0) {
      const nbom = await BomModel(domain, instance).insertMany(newPropAddedinGtm);
      resolve([...bom, ...nbom]);
    } else if (newPropRemovedinGtm.length > 0) {
      await BomModel(domain, instance).deleteMany({ _id: { $in: [...newPropRemovedinGtm.map(d => d._id)] } });
      resolve(_.differenceWith(bom, newPropRemovedinGtm, (a: any, b: any) => a.name === b.name));
    } else resolve(bom);
  });
}

function _getBomSchema(gtmVersion) {
  return SchemaBom.findOne({ gtmVersion: gtmVersion }).sort({ _id: 1 });
}

export const getBomSchema = promiseMemoize(_getBomSchema, { maxAge: 60000 });
export const getBomData = promiseMemoize(_getBomData, { maxAge: 60000 });
export const getUpdatedProp = promiseMemoize(_getUpdatedProp, { maxAge: 60000 });
