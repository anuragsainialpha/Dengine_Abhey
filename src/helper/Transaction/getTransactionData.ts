import _ from 'lodash';
import promiseMemoize from 'promise-memoize';
import { Transaction as TransactionModel } from '../../models/transaction';
import { SchemaTransaction } from '../../models/schemaTransaction';
import { mapHeader, mapRemark, mapRefnum, mapDate, mapInvolvedParty, mapTrxLineItemId, mapQuantity, mapCurrency } from './transactionProps';

function _getTransactionData(schemaTransaction, gtmVersion, gtmData?, domain?) {
  return new Promise(function (resolve) {
    let {
      Header: TrxHeader,
      Remark: TrxRemark,
      Refnum: TrxRefnum,
      InvolvedParty: TrxInvPty,
      TransDate: TrxDate,
      Quantity: TrxQty,
      Currency: TrxCur,
    } = schemaTransaction.GtmTransaction.GtmTransaction;
    let {
      Header: TrxLineHeader,
      Remark: TrxLineRemark,
      Refnum: TrxLineRefnum,
      InvolvedParty: TrxLineInvPty,
      ItemGid: TrxLineItem,
      TransLineDate: TrxLineDate,
      Quantity: TrxLineQty,
      Currency: TrxLineCur,
    } = schemaTransaction.GtmTransaction.GtmTransactionLine;
    const xmlNs = schemaTransaction.xmlNs;

    ({ TrxHeader, TrxLineHeader } = getHeaders(TrxHeader, gtmVersion, xmlNs, domain, TrxLineHeader));
    ({ TrxRemark, TrxLineRemark } = getRemarks(gtmData, TrxRemark, gtmVersion, xmlNs, domain, TrxLineRemark));
    ({ TrxDate, TrxLineDate } = getDates(gtmData, TrxDate, gtmVersion, xmlNs, domain, TrxLineDate));
    ({ TrxQty, TrxLineQty } = getQty(gtmData, TrxQty, gtmVersion, xmlNs, domain, TrxLineQty));
    ({ TrxCur, TrxLineCur } = getCurrency(gtmData, TrxCur, gtmVersion, xmlNs, domain, TrxLineCur));
    TrxLineItem = getTrxLineItem(TrxLineItem, gtmVersion, xmlNs, domain);
    ({ TrxRefnum, TrxLineRefnum } = getRefnums(gtmData, TrxRefnum, gtmVersion, xmlNs, domain, TrxLineRefnum));
    ({ TrxInvPty, TrxLineInvPty } = getInvPty(gtmData, TrxInvPty, gtmVersion, xmlNs, domain, TrxLineInvPty));

    resolve(
      _.uniqBy(
        [
          ...TrxHeader,
          ...TrxRemark,
          ...TrxRefnum,
          ...TrxInvPty,
          ...TrxQty,
          ...TrxCur,
          ...TrxDate,
          ...TrxLineHeader,
          ...TrxLineItem,
          ...TrxLineRemark,
          ...TrxLineRefnum,
          ...TrxLineInvPty,
          ...TrxLineQty,
          ...TrxLineCur,
          ...TrxLineDate,
        ],
        filterByName()
      )
    );
  });
}

function filterByName(): _.ValueIteratee<any> {
  return (e) => e.name;
}

function getInvPty(gtmData: any, TrxInvPty: any, gtmVersion: any, xmlNs: any, domain: any, TrxLineInvPty: any) {
  const invPartyQuals = gtmData.match(/INVOLVED_PARTY="(.*?)"/)[1].split(',');
  TrxInvPty = invPartyQuals.map(getTrxMappedInvParty(TrxInvPty, gtmVersion, xmlNs, domain));
  TrxLineInvPty = invPartyQuals.map(getTrxLineMappedInvParty(TrxLineInvPty, gtmVersion, xmlNs, domain));
  return { TrxInvPty, TrxLineInvPty };
}

function getRefnums(gtmData: any, TrxRefnum: any, gtmVersion: any, xmlNs: any, domain: any, TrxLineRefnum: any) {
  const RefnumQuals = gtmData.match(/REFNUMS="(.*?)"/)[1].split(',');
  TrxRefnum = RefnumQuals.map(getTrxMappedRefnum(TrxRefnum, gtmVersion, xmlNs, domain));
  TrxLineRefnum = RefnumQuals.map(getTrxLineMappedRefnum(TrxLineRefnum, gtmVersion, xmlNs, domain));
  return { TrxRefnum, TrxLineRefnum };
}

function getTrxLineItem(TrxLineItem: any, gtmVersion: any, xmlNs: any, domain: any) {
  TrxLineItem = [0].map(getTrxLineMappedItemId(TrxLineItem, gtmVersion, xmlNs, domain));
  return TrxLineItem;
}

function getQty(gtmData: any, TrxQty: any, gtmVersion: any, xmlNs: any, domain: any, TrxLineQty: any) {
  const qtyQuals = gtmData.match(/QUANTITY="(.*?)"/)[1].split(',');
  const gtmUOMs = getUOMs(gtmData);
  TrxQty = _.flattenDeep(qtyQuals.map(getTrxMappedQty(TrxQty, gtmVersion, xmlNs, domain, gtmUOMs)));
  TrxLineQty = _.flattenDeep(qtyQuals.map(getTrxLineMappedQty(TrxLineQty, gtmVersion, xmlNs, domain, gtmUOMs)));
  return { TrxQty, TrxLineQty };
}
function getCurrency(gtmData: any, TrxCur: any, gtmVersion: any, xmlNs: any, domain: any, TrxLineCur: any) {
  const curQuals = gtmData.match(/CURRENCY="(.*?)"/)[1].split(',');
  TrxCur = curQuals.map(getTrxMappedCur(TrxCur, gtmVersion, xmlNs, domain));
  TrxLineCur = curQuals.map(getTrxLineMappedCur(TrxLineCur, gtmVersion, xmlNs, domain));
  return { TrxCur: TrxCur, TrxLineCur: TrxLineCur };
}

function getDates(gtmData: any, TrxDate: any, gtmVersion: any, xmlNs: any, domain: any, TrxLineDate: any) {
  const dateQuals = gtmData.match(/DATES="(.*?)"/)[1].split(',');
  TrxDate = dateQuals.map(getTrxMappedDate(TrxDate, gtmVersion, xmlNs, domain));
  TrxLineDate = dateQuals.map(getTrxLineMappedDate(TrxLineDate, gtmVersion, xmlNs, domain));
  return { TrxDate, TrxLineDate };
}

function getRemarks(gtmData: any, TrxRemark: any, gtmVersion: any, xmlNs: any, domain: any, TrxLineRemark: any) {
  const remarkQuals = gtmData.match(/REMARKS="(.*?)"/)[1].split(',');
  TrxRemark = remarkQuals.map(getTrxMappedRemark(TrxRemark, gtmVersion, xmlNs, domain));
  TrxLineRemark = remarkQuals.map(getTrxLineMappedRemark(TrxLineRemark, gtmVersion, xmlNs, domain));
  return { TrxRemark, TrxLineRemark };
}

function getHeaders(TrxHeader: any, gtmVersion: any, xmlNs: any, domain: any, TrxLineHeader: any) {
  TrxHeader = TrxHeader.map(getTrxMappedHeader(gtmVersion, xmlNs, domain));
  TrxLineHeader = TrxLineHeader.map(getTrxLineMappedHeader(gtmVersion, xmlNs, domain));
  return { TrxHeader, TrxLineHeader };
}

function getTrxLineMappedInvParty(LineInvolvedParty: any, gtmVersion: any, xmlNs: any, domain: any): any {
  return (e, i) => mapInvolvedParty(e, LineInvolvedParty, 'Transaction Line : Involved Party', gtmVersion, xmlNs, i, 'Line', domain);
}

function getTrxMappedInvParty(TransactionInvolvedParty: any, gtmVersion: any, xmlNs: any, domain: any): any {
  return (e, i) => mapInvolvedParty(e, TransactionInvolvedParty, 'Transaction : Involved Party', gtmVersion, xmlNs, i, '', domain);
}

function getTrxLineMappedRefnum(LineRefnum: any, gtmVersion: any, xmlNs: any, domain: any): any {
  return (e, i) => mapRefnum(e, LineRefnum, 'Transaction Line : Refnum', gtmVersion, xmlNs, i, 'Line', domain);
}

function getTrxMappedRefnum(TransactionRefnum: any, gtmVersion: any, xmlNs: any, domain: any): any {
  return (e, i) => mapRefnum(e, TransactionRefnum, 'Transaction : Refnum', gtmVersion, xmlNs, i, '', domain);
}

function getTrxLineMappedItemId(
  ItemGid: any,
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
  path: { path: any; value: any }[];
  gtmVersion: any;
  xmlNs: any;
} {
  return (e, i) => mapTrxLineItemId(e, ItemGid, 'Transaction Line : Header', gtmVersion, xmlNs, 0, 'Line', domain);
}

function getTrxLineMappedQty(TransactionLineQuantity: any, gtmVersion: any, xmlNs: any, domain: any, uoms: any): any {
  return (e, i) => mapQuantity(e, TransactionLineQuantity, 'Transaction Line : Quantity', gtmVersion, xmlNs, i, 'Line', domain, uoms);
}
function getTrxLineMappedCur(TransactionLineCurrency: any, gtmVersion: any, xmlNs: any, domain: any): any {
  return (e, i) => mapCurrency(e, TransactionLineCurrency, 'Transaction Line : Currency', gtmVersion, xmlNs, i, 'Line', domain);
}

function getTrxMappedCur(TransactionCurrency: any, gtmVersion: any, xmlNs: any, domain: any): any {
  return (e, i) => mapCurrency(e, TransactionCurrency, 'Transaction : Currency', gtmVersion, xmlNs, i, '', domain);
}
function getTrxMappedQty(TransactionQuantity: any, gtmVersion: any, xmlNs: any, domain: any, uoms): any {
  return (e, i) => mapQuantity(e, TransactionQuantity, 'Transaction : Quantity', gtmVersion, xmlNs, i, '', domain, uoms);
}

function getTrxLineMappedDate(TransLineDate: any, gtmVersion: any, xmlNs: any, domain: any): any {
  return (e, i) => mapDate(e, TransLineDate, 'Transaction Line : Date', gtmVersion, xmlNs, i, 'Line', domain);
}

function getTrxMappedDate(TransDate: any, gtmVersion: any, xmlNs: any, domain: any): any {
  return (e, i) => mapDate(e, TransDate, 'Transaction : Date', gtmVersion, xmlNs, i, '', domain);
}

function getTrxLineMappedRemark(LineRemark: any, gtmVersion: any, xmlNs: any, domain: any): any {
  return (e, i) => mapRemark(e, LineRemark, 'Transaction Line : Remark', gtmVersion, xmlNs, i, 'Line', domain);
}

function getTrxMappedRemark(TransactionRemark: any, gtmVersion: any, xmlNs: any, domain: any): any {
  return (e, i) => mapRemark(e, TransactionRemark, 'Transaction : Remark', gtmVersion, xmlNs, i, '', domain);
}

function getTrxLineMappedHeader(gtmVersion: any, xmlNs: any, domain: any): any {
  return (e) => mapHeader(e, 'Transaction Line : Header', gtmVersion, xmlNs, domain);
}

function getTrxMappedHeader(gtmVersion: any, xmlNs: any, domain: any): any {
  return (e) => mapHeader(e, 'Transaction : Header', gtmVersion, xmlNs, domain);
}

function _getUpdatedProp(GtmTransaction, transaction, instance?, domain?) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async function (resolve) {
    const newPropAddedinGtm = _.differenceWith(GtmTransaction, transaction, (a: any, b: any) => a.name === b.name);
    const newPropRemovedinGtm = _.differenceWith(transaction, GtmTransaction, (a: any, b: any) => a.name === b.name);
    if (newPropAddedinGtm.length > 0) {
      const ntransaction = await TransactionModel(domain, instance).insertMany(newPropAddedinGtm);
      resolve([...transaction, ...ntransaction]);
    } else if (newPropRemovedinGtm.length > 0) {
      await TransactionModel(domain, instance).deleteMany({ _id: { $in: [...newPropRemovedinGtm.map((d) => d._id)] } });
      resolve(_.differenceWith(transaction, newPropRemovedinGtm, (a: any, b: any) => a.name === b.name));
    } else resolve(transaction);
  });
}

function _getTransactionSchema(gtmVersion) {
  return SchemaTransaction.findOne({ gtmVersion: gtmVersion }).sort({ _id: 1 });
}

function getUOMs(output) {
  const allUOMs = output.match(/QUANTITY_UOM="(.*?)"/)[1].split(',');
  const UOMs = {};
  allUOMs.forEach((uom) => {
    if (UOMs[uom.replace(/.*\[|\]/gi, '')]) {
      UOMs[uom.replace(/.*\[|\]/gi, '')].push(uom.split('[')[0]);
    } else {
      UOMs[uom.replace(/.*\[|\]/gi, '')] = [uom.split('[')[0]];
    }

    if (UOMs['USER DEFINED']) {
      UOMs['USER DEFINED'].push(uom.split('[')[0]);
    } else {
      UOMs['USER DEFINED'] = [uom.split('[')[0]];
    }
  });

  return UOMs;
}

export const getTransactionSchema = promiseMemoize(_getTransactionSchema, { maxAge: 60000 });
export const getTransactionData = promiseMemoize(_getTransactionData, { maxAge: 60000 });
export const getUpdatedProp = promiseMemoize(_getUpdatedProp, { maxAge: 60000 });
