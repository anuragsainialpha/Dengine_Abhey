import _ from 'lodash';
import promiseMemoize from 'promise-memoize';
import { Release as ReleaseModel } from '../../models/release';
import { SchemaRelease } from '../../models/schemaRelease';
import { mapHeader, mapRemark, mapRefnum, mapInvolvedParty } from './releaseProps';

function _getReleaseData(schemaRelease, gtmVersion, gtmData?, domain?) {
  return new Promise(function(resolve) {
    let {
      Header: ReleaseHeader,
      Remark: ReleaseRemark,
      Refnum: ReleaseRefnum,
      InvolvedParty: ReleaseInvolvedParty
    } = schemaRelease.Release.Release;
    let {
      Header: LineHeader,
      Remark: LineRemark,
      Refnum: LineRefnum,
      InvolvedParty: LineInvolvedParty
    } = schemaRelease.Release.ReleaseLine;
    const xmlNs = schemaRelease.xmlNs;
    ReleaseHeader = ReleaseHeader.map(e => mapHeader(e, 'Release : Header', gtmVersion, xmlNs, domain));
    LineHeader = LineHeader.map(e => mapHeader(e, 'Release Line : Header', gtmVersion, xmlNs, domain));
    const remarkQuals = gtmData.match(/REMARKS="(.*?)"/)[1].split(',');
    ReleaseRemark = remarkQuals.map((e, i) => mapRemark(e, ReleaseRemark, 'Release : Remark', gtmVersion, xmlNs, i, '', domain));
    LineRemark = remarkQuals.map((e, i) => mapRemark(e, LineRemark, 'Release Line : Remark', gtmVersion, xmlNs, i, 'Line', domain));
    const invPartyQuals = gtmData.match(/INVOLVED_PARTY="(.*?)"/)[1].split(',');
    ReleaseInvolvedParty = invPartyQuals.map((e, i) =>
      mapInvolvedParty(e, ReleaseInvolvedParty, 'Release : Involved Party', gtmVersion, xmlNs, i, '', domain)
    );
    LineInvolvedParty = invPartyQuals.map((e, i) =>
      mapInvolvedParty(e, LineInvolvedParty, 'Release Line : Involved Party', gtmVersion, xmlNs, i, 'Line', domain)
    );
    const relRefnumQuals = gtmData.match(/RELEASE_REFNUMS="(.*?)"/)[1].split(',');
    ReleaseRefnum = relRefnumQuals.map((e, i) => mapRefnum(e, ReleaseRefnum, 'Release : Refnum', gtmVersion, xmlNs, i, '', domain));
    const relLineRefnumQuals = gtmData.match(/RELEASE_LINE_REFNUMS="(.*?)"/)[1].split(',');
    LineRefnum = relLineRefnumQuals.map((e, i) => mapRefnum(e, LineRefnum, 'Release Line : Refnum', gtmVersion, xmlNs, i, 'Line', domain));

    resolve(
      _.uniqBy(
        [
          ...ReleaseHeader,
          ...ReleaseRemark,
          ...ReleaseRefnum,
          ...ReleaseInvolvedParty,
          ...LineHeader,
          ...LineRemark,
          ...LineRefnum,
          ...LineInvolvedParty
        ],
        e => e.name
      )
    );
  });
}

function _getUpdatedProp(Release, release, instance?, domain?) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async function(resolve) {
    const newPropAddedinGtm = _.differenceWith(Release, release, (a: any, b: any) => a.name === b.name);
    const newPropRemovedinGtm = _.differenceWith(release, Release, (a: any, b: any) => a.name === b.name);
    if (newPropAddedinGtm.length > 0) {
      const nrelease = await ReleaseModel(domain, instance).insertMany(newPropAddedinGtm);
      resolve([...release, ...nrelease]);
    } else if (newPropRemovedinGtm.length > 0) {
      await ReleaseModel(domain, instance).deleteMany({ _id: { $in: [...newPropRemovedinGtm.map(d => d._id)] } });
      resolve(_.differenceWith(release, newPropRemovedinGtm, (a: any, b: any) => a.name === b.name));
    } else resolve(release);
  });
}

function _getReleaseSchema(gtmVersion) {
  return SchemaRelease.findOne({ gtmVersion: gtmVersion }).sort({ _id: 1 });
}

export const getReleaseSchema = promiseMemoize(_getReleaseSchema, { maxAge: 60000 });
export const getReleaseData = promiseMemoize(_getReleaseData, { maxAge: 60000 });
export const getUpdatedProp = promiseMemoize(_getUpdatedProp, { maxAge: 60000 });
