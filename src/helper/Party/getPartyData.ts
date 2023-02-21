import _ from 'lodash';
import promiseMemoize from 'promise-memoize';
import { Party } from '../../models/party';
import { SchemaParty } from '../../models/schemaParty';
import { mapHeader, mapRemark, mapRefnum, mapAddressLine } from './partyProps';

function _getPartyData(schemaParty, gtmVersion, gtmData?, domain?) {
  return new Promise(function (resolve) {
    let { Header: PHeader, Remark: PRemark, Refnum: PRefnum } = schemaParty.GtmContact.Contact;
    let { Header: PLocRef } = schemaParty.GtmContact.LocationRef;
    let { AddressLines: AddLine } = schemaParty.GtmContact.LocationRef;
    const xmlNs = schemaParty.xmlNs;
    ({ PHeader, PLocRef } = getHeaders(PHeader, gtmVersion, xmlNs, domain, PLocRef));
    PRemark = getRemarks(gtmData, PRemark, gtmVersion, xmlNs, domain);
    PRefnum = getRefnums(gtmData, PRefnum, gtmVersion, xmlNs, domain);
    AddLine = getAddLines(AddLine, gtmVersion, xmlNs, domain);
    resolve(_.uniqBy([...PHeader, ...PRemark, ...PRefnum, ...PLocRef, ...AddLine], filterByName()));
  });
}

function getAddLines(AddLine: any, gtmVersion: any, xmlNs: any, domain: any) {
  AddLine = [1, 2, 3].map(getMappedAddLines(AddLine, gtmVersion, xmlNs, domain));
  return AddLine;
}

function getRefnums(gtmData: any, PRefnum: any, gtmVersion: any, xmlNs: any, domain: any) {
  const refnumQuals = gtmData.match(/REFNUMS="(.*?)"/)[1].split(',');
  PRefnum = refnumQuals.map(getMappedRefnums(PRefnum, gtmVersion, xmlNs, domain));
  return PRefnum;
}

function getRemarks(gtmData: any, PRemark: any, gtmVersion: any, xmlNs: any, domain: any) {
  const remarkQuals = gtmData.match(/REMARKS="(.*?)"/)[1].split(',');
  PRemark = remarkQuals.map(getMappedRemarks(PRemark, gtmVersion, xmlNs, domain));
  return PRemark;
}

function getHeaders(PHeader: any, gtmVersion: any, xmlNs: any, domain: any, PLocRef: any) {
  PHeader = PHeader.map(getMappedHeaders(gtmVersion, xmlNs, domain));
  PLocRef = PLocRef.map(getMappedLocRefs(gtmVersion, xmlNs, domain));
  return { PHeader, PLocRef };
}

function filterByName(): _.ValueIteratee<any> {
  return (e) => e.name;
}

function getMappedAddLines(
  AddLine: any,
  gtmVersion: any,
  xmlNs: any,
  domain: any
): (
  value: number,
  index: number,
  array: number[]
) => {
  name: string;
  required: boolean;
  disabled: boolean;
  display: boolean;
  type: any;
  displayText: string;
  defaultValue: string;
  path: ({ path: string; value: any } | { path: any; value: string })[];
  gtmVersion: any;
  xmlNs: any;
} {
  return (e) => mapAddressLine(`Address Line ${e}`, AddLine, 'Party : Address Line', gtmVersion, xmlNs, e - 1, '', domain);
}

function getMappedRefnums(PRefnum: any, gtmVersion: any, xmlNs: any, domain: any): any {
  return (e, i) => mapRefnum(e, PRefnum, 'Party : Refnum', gtmVersion, xmlNs, i, '', domain);
}

function getMappedRemarks(PRemark: any, gtmVersion: any, xmlNs: any, domain: any): any {
  return (e, i) => mapRemark(e, PRemark, 'Party : Remark', gtmVersion, xmlNs, i, '', domain);
}

function getMappedLocRefs(gtmVersion: any, xmlNs: any, domain: any): any {
  return (e) => mapHeader(e, 'LocationRef : Header', gtmVersion, xmlNs, domain);
}

function getMappedHeaders(gtmVersion: any, xmlNs: any, domain: any): any {
  return (e) => mapHeader(e, 'Party : Header', gtmVersion, xmlNs, domain);
}

function _getUpdatedProp(GtmContact, party, instance?, domain?) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async function (resolve) {
    const newPropAddedinGtm = _.differenceWith(GtmContact, party, (a: any, b: any) => a.name === b.name);
    const newPropRemovedinGtm = _.differenceWith(party, GtmContact, (a: any, b: any) => a.name === b.name);
    if (newPropAddedinGtm.length > 0) {
      const nparty = await Party(domain, instance).insertMany(newPropAddedinGtm);
      resolve([...party, ...nparty]);
    } else if (newPropRemovedinGtm.length > 0) {
      await Party(domain, instance).deleteMany({ _id: { $in: [...newPropRemovedinGtm.map((d) => d._id)] } });
      resolve(_.differenceWith(party, newPropRemovedinGtm, (a: any, b: any) => a.name === b.name));
    } else resolve(party);
  });
}

function _getPartySchema(gtmVersion) {
  return SchemaParty.findOne({ gtmVersion: gtmVersion }).sort({ _id: 1 });
}

export const getPartySchema = promiseMemoize(_getPartySchema, { maxAge: 60000 });
export const getPartyData = promiseMemoize(_getPartyData, { maxAge: 60000 });
export const getUpdatedProp = promiseMemoize(_getUpdatedProp, { maxAge: 60000 });
