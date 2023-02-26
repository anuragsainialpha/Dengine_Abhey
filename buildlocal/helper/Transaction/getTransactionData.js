"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const promise_memoize_1 = __importDefault(require("promise-memoize"));
const transaction_1 = require("../../models/transaction");
const schemaTransaction_1 = require("../../models/schemaTransaction");
const transactionProps_1 = require("./transactionProps");
function _getTransactionData(schemaTransaction, gtmVersion, gtmData, domain) {
    return new Promise(function (resolve) {
        let { Header: TrxHeader, Remark: TrxRemark, Refnum: TrxRefnum, InvolvedParty: TrxInvPty, TransDate: TrxDate, Quantity: TrxQty, Currency: TrxCur, } = schemaTransaction.GtmTransaction.GtmTransaction;
        let { Header: TrxLineHeader, Remark: TrxLineRemark, Refnum: TrxLineRefnum, InvolvedParty: TrxLineInvPty, ItemGid: TrxLineItem, TransLineDate: TrxLineDate, Quantity: TrxLineQty, Currency: TrxLineCur, } = schemaTransaction.GtmTransaction.GtmTransactionLine;
        const xmlNs = schemaTransaction.xmlNs;
        ({ TrxHeader, TrxLineHeader } = getHeaders(TrxHeader, gtmVersion, xmlNs, domain, TrxLineHeader));
        ({ TrxRemark, TrxLineRemark } = getRemarks(gtmData, TrxRemark, gtmVersion, xmlNs, domain, TrxLineRemark));
        ({ TrxDate, TrxLineDate } = getDates(gtmData, TrxDate, gtmVersion, xmlNs, domain, TrxLineDate));
        ({ TrxQty, TrxLineQty } = getQty(gtmData, TrxQty, gtmVersion, xmlNs, domain, TrxLineQty));
        ({ TrxCur, TrxLineCur } = getCurrency(gtmData, TrxCur, gtmVersion, xmlNs, domain, TrxLineCur));
        TrxLineItem = getTrxLineItem(TrxLineItem, gtmVersion, xmlNs, domain);
        ({ TrxRefnum, TrxLineRefnum } = getRefnums(gtmData, TrxRefnum, gtmVersion, xmlNs, domain, TrxLineRefnum));
        ({ TrxInvPty, TrxLineInvPty } = getInvPty(gtmData, TrxInvPty, gtmVersion, xmlNs, domain, TrxLineInvPty));
        resolve(lodash_1.default.uniqBy([
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
        ], filterByName()));
    });
}
function filterByName() {
    return (e) => e.name;
}
function getInvPty(gtmData, TrxInvPty, gtmVersion, xmlNs, domain, TrxLineInvPty) {
    const invPartyQuals = gtmData.match(/INVOLVED_PARTY="(.*?)"/)[1].split(',');
    TrxInvPty = invPartyQuals.map(getTrxMappedInvParty(TrxInvPty, gtmVersion, xmlNs, domain));
    TrxLineInvPty = invPartyQuals.map(getTrxLineMappedInvParty(TrxLineInvPty, gtmVersion, xmlNs, domain));
    return { TrxInvPty, TrxLineInvPty };
}
function getRefnums(gtmData, TrxRefnum, gtmVersion, xmlNs, domain, TrxLineRefnum) {
    const RefnumQuals = gtmData.match(/REFNUMS="(.*?)"/)[1].split(',');
    TrxRefnum = RefnumQuals.map(getTrxMappedRefnum(TrxRefnum, gtmVersion, xmlNs, domain));
    TrxLineRefnum = RefnumQuals.map(getTrxLineMappedRefnum(TrxLineRefnum, gtmVersion, xmlNs, domain));
    return { TrxRefnum, TrxLineRefnum };
}
function getTrxLineItem(TrxLineItem, gtmVersion, xmlNs, domain) {
    TrxLineItem = [0].map(getTrxLineMappedItemId(TrxLineItem, gtmVersion, xmlNs, domain));
    return TrxLineItem;
}
function getQty(gtmData, TrxQty, gtmVersion, xmlNs, domain, TrxLineQty) {
    const qtyQuals = gtmData.match(/QUANTITY="(.*?)"/)[1].split(',');
    const gtmUOMs = getUOMs(gtmData);
    TrxQty = lodash_1.default.flattenDeep(qtyQuals.map(getTrxMappedQty(TrxQty, gtmVersion, xmlNs, domain, gtmUOMs)));
    TrxLineQty = lodash_1.default.flattenDeep(qtyQuals.map(getTrxLineMappedQty(TrxLineQty, gtmVersion, xmlNs, domain, gtmUOMs)));
    return { TrxQty, TrxLineQty };
}
function getCurrency(gtmData, TrxCur, gtmVersion, xmlNs, domain, TrxLineCur) {
    const curQuals = gtmData.match(/CURRENCY="(.*?)"/)[1].split(',');
    TrxCur = curQuals.map(getTrxMappedCur(TrxCur, gtmVersion, xmlNs, domain));
    TrxLineCur = curQuals.map(getTrxLineMappedCur(TrxLineCur, gtmVersion, xmlNs, domain));
    return { TrxCur: TrxCur, TrxLineCur: TrxLineCur };
}
function getDates(gtmData, TrxDate, gtmVersion, xmlNs, domain, TrxLineDate) {
    const dateQuals = gtmData.match(/DATES="(.*?)"/)[1].split(',');
    TrxDate = dateQuals.map(getTrxMappedDate(TrxDate, gtmVersion, xmlNs, domain));
    TrxLineDate = dateQuals.map(getTrxLineMappedDate(TrxLineDate, gtmVersion, xmlNs, domain));
    return { TrxDate, TrxLineDate };
}
function getRemarks(gtmData, TrxRemark, gtmVersion, xmlNs, domain, TrxLineRemark) {
    const remarkQuals = gtmData.match(/REMARKS="(.*?)"/)[1].split(',');
    TrxRemark = remarkQuals.map(getTrxMappedRemark(TrxRemark, gtmVersion, xmlNs, domain));
    TrxLineRemark = remarkQuals.map(getTrxLineMappedRemark(TrxLineRemark, gtmVersion, xmlNs, domain));
    return { TrxRemark, TrxLineRemark };
}
function getHeaders(TrxHeader, gtmVersion, xmlNs, domain, TrxLineHeader) {
    TrxHeader = TrxHeader.map(getTrxMappedHeader(gtmVersion, xmlNs, domain));
    TrxLineHeader = TrxLineHeader.map(getTrxLineMappedHeader(gtmVersion, xmlNs, domain));
    return { TrxHeader, TrxLineHeader };
}
function getTrxLineMappedInvParty(LineInvolvedParty, gtmVersion, xmlNs, domain) {
    return (e, i) => transactionProps_1.mapInvolvedParty(e, LineInvolvedParty, 'Transaction Line : Involved Party', gtmVersion, xmlNs, i, 'Line', domain);
}
function getTrxMappedInvParty(TransactionInvolvedParty, gtmVersion, xmlNs, domain) {
    return (e, i) => transactionProps_1.mapInvolvedParty(e, TransactionInvolvedParty, 'Transaction : Involved Party', gtmVersion, xmlNs, i, '', domain);
}
function getTrxLineMappedRefnum(LineRefnum, gtmVersion, xmlNs, domain) {
    return (e, i) => transactionProps_1.mapRefnum(e, LineRefnum, 'Transaction Line : Refnum', gtmVersion, xmlNs, i, 'Line', domain);
}
function getTrxMappedRefnum(TransactionRefnum, gtmVersion, xmlNs, domain) {
    return (e, i) => transactionProps_1.mapRefnum(e, TransactionRefnum, 'Transaction : Refnum', gtmVersion, xmlNs, i, '', domain);
}
function getTrxLineMappedItemId(ItemGid, gtmVersion, xmlNs, domain) {
    return (e, i) => transactionProps_1.mapTrxLineItemId(e, ItemGid, 'Transaction Line : Header', gtmVersion, xmlNs, 0, 'Line', domain);
}
function getTrxLineMappedQty(TransactionLineQuantity, gtmVersion, xmlNs, domain, uoms) {
    return (e, i) => transactionProps_1.mapQuantity(e, TransactionLineQuantity, 'Transaction Line : Quantity', gtmVersion, xmlNs, i, 'Line', domain, uoms);
}
function getTrxLineMappedCur(TransactionLineCurrency, gtmVersion, xmlNs, domain) {
    return (e, i) => transactionProps_1.mapCurrency(e, TransactionLineCurrency, 'Transaction Line : Currency', gtmVersion, xmlNs, i, 'Line', domain);
}
function getTrxMappedCur(TransactionCurrency, gtmVersion, xmlNs, domain) {
    return (e, i) => transactionProps_1.mapCurrency(e, TransactionCurrency, 'Transaction : Currency', gtmVersion, xmlNs, i, '', domain);
}
function getTrxMappedQty(TransactionQuantity, gtmVersion, xmlNs, domain, uoms) {
    return (e, i) => transactionProps_1.mapQuantity(e, TransactionQuantity, 'Transaction : Quantity', gtmVersion, xmlNs, i, '', domain, uoms);
}
function getTrxLineMappedDate(TransLineDate, gtmVersion, xmlNs, domain) {
    return (e, i) => transactionProps_1.mapDate(e, TransLineDate, 'Transaction Line : Date', gtmVersion, xmlNs, i, 'Line', domain);
}
function getTrxMappedDate(TransDate, gtmVersion, xmlNs, domain) {
    return (e, i) => transactionProps_1.mapDate(e, TransDate, 'Transaction : Date', gtmVersion, xmlNs, i, '', domain);
}
function getTrxLineMappedRemark(LineRemark, gtmVersion, xmlNs, domain) {
    return (e, i) => transactionProps_1.mapRemark(e, LineRemark, 'Transaction Line : Remark', gtmVersion, xmlNs, i, 'Line', domain);
}
function getTrxMappedRemark(TransactionRemark, gtmVersion, xmlNs, domain) {
    return (e, i) => transactionProps_1.mapRemark(e, TransactionRemark, 'Transaction : Remark', gtmVersion, xmlNs, i, '', domain);
}
function getTrxLineMappedHeader(gtmVersion, xmlNs, domain) {
    return (e) => transactionProps_1.mapHeader(e, 'Transaction Line : Header', gtmVersion, xmlNs, domain);
}
function getTrxMappedHeader(gtmVersion, xmlNs, domain) {
    return (e) => transactionProps_1.mapHeader(e, 'Transaction : Header', gtmVersion, xmlNs, domain);
}
function _getUpdatedProp(GtmTransaction, transaction, instance, domain) {
    return new Promise(async function (resolve) {
        const newPropAddedinGtm = lodash_1.default.differenceWith(GtmTransaction, transaction, (a, b) => a.name === b.name);
        const newPropRemovedinGtm = lodash_1.default.differenceWith(transaction, GtmTransaction, (a, b) => a.name === b.name);
        if (newPropAddedinGtm.length > 0) {
            const ntransaction = await transaction_1.Transaction(domain, instance).insertMany(newPropAddedinGtm);
            resolve([...transaction, ...ntransaction]);
        }
        else if (newPropRemovedinGtm.length > 0) {
            await transaction_1.Transaction(domain, instance).deleteMany({ _id: { $in: [...newPropRemovedinGtm.map((d) => d._id)] } });
            resolve(lodash_1.default.differenceWith(transaction, newPropRemovedinGtm, (a, b) => a.name === b.name));
        }
        else
            resolve(transaction);
    });
}
function _getTransactionSchema(gtmVersion) {
    return schemaTransaction_1.SchemaTransaction.findOne({ gtmVersion: gtmVersion }).sort({ _id: 1 });
}
function getUOMs(output) {
    const allUOMs = output.match(/QUANTITY_UOM="(.*?)"/)[1].split(',');
    const UOMs = {};
    allUOMs.forEach((uom) => {
        if (UOMs[uom.replace(/.*\[|\]/gi, '')]) {
            UOMs[uom.replace(/.*\[|\]/gi, '')].push(uom.split('[')[0]);
        }
        else {
            UOMs[uom.replace(/.*\[|\]/gi, '')] = [uom.split('[')[0]];
        }
        if (UOMs['USER DEFINED']) {
            UOMs['USER DEFINED'].push(uom.split('[')[0]);
        }
        else {
            UOMs['USER DEFINED'] = [uom.split('[')[0]];
        }
    });
    return UOMs;
}
exports.getTransactionSchema = promise_memoize_1.default(_getTransactionSchema, { maxAge: 60000 });
exports.getTransactionData = promise_memoize_1.default(_getTransactionData, { maxAge: 60000 });
exports.getUpdatedProp = promise_memoize_1.default(_getUpdatedProp, { maxAge: 60000 });
