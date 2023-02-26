"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const other_1 = require("../other");
const renamer_1 = require("../renamer");
const other_2 = require("../other");
const ORDERBASE_MANDATORY_FIELD = [
    'OrderBase ID DomainName',
    'OrderBase ID',
    'OrderBase TransactionCode',
    'Line ID DomainName',
    'Line ID',
    'Line TransactionCode',
    ...Object.values(other_2.NAME.orderBase).filter((d) => !d.includes('TimeZone'))
];
const getDisplayText = (prop, index, element) => {
    const displayText = other_1.capitalize(element.split('_').join(' '));
    return displayText.split('.')[1] ? displayText.split('.')[1] : displayText;
};
for (let addressSequenceIndex = 0; addressSequenceIndex < other_1.getSequence.length; addressSequenceIndex++) {
    const element = other_1.getSequence[addressSequenceIndex];
}
const getIndex = (prop, serachTerm) => {
    const getIndex = d => d.path.search(serachTerm) > -1;
    return prop.findIndex(getIndex);
};
exports.mapHeader = (element, type, gtmVersion, xmlNs, domain) => {
    return {
        name: element.name,
        required: true,
        disabled: renamer_1.getMandatoryElement(element.name, ORDERBASE_MANDATORY_FIELD),
        display: renamer_1.getMandatoryElement(element.name, ORDERBASE_MANDATORY_FIELD),
        isMandatory: renamer_1.getMandatoryElement(element.name, ORDERBASE_MANDATORY_FIELD),
        type: type,
        displayText: element.name,
        defaultValue: renamer_1.getDefaultValue(element.path, domain),
        path: [element.path],
        gtmVersion,
        xmlNs
    };
};
exports.mapRefnum = (element, Refnum, type, gtmVersion, xmlNs, i, prefix, domain) => {
    const refIdIndex = getIndex(Refnum, 'Xid');
    const refDomainNameIndex = getIndex(Refnum, 'DomainName');
    const refValueIndex = getIndex(Refnum, 'RefnumValue');
    const remTransactionCodeIndex = getIndex(Refnum, 'TransactionCode');
    return {
        name: `${prefix} ${element}`.trim(),
        required: true,
        disabled: false,
        display: false,
        type: type,
        displayText: `${prefix} ${getDisplayText(Refnum, refIdIndex, element)}`.trim(),
        defaultValue: renamer_1.getDefaultValue(Refnum[refValueIndex].path, domain),
        path: [
            { path: Refnum[refValueIndex].path.replace('INDEX', i), value: '' },
            other_1.getDomainName(element, Refnum[refDomainNameIndex].path.replace('INDEX', i)),
            other_1.getTC(element, Refnum[remTransactionCodeIndex].path.replace('INDEX', i)),
            other_1.getXID(element, Refnum[refIdIndex].path.replace('INDEX', i))
        ],
        gtmVersion,
        xmlNs
    };
};
exports.mapRemark = (element, Remark, type, gtmVersion, xmlNs, i, prefix, domain) => {
    const remIdIndex = getIndex(Remark, 'Xid');
    const remDomainNameIndex = getIndex(Remark, 'DomainName');
    const remTextIndex = getIndex(Remark, 'RemarkText');
    const remSequenceIndex = getIndex(Remark, 'RemarkSequence');
    const remTransactionCodeIndex = getIndex(Remark, 'TransactionCode');
    return {
        name: `${prefix} ${element}`.trim(),
        required: true,
        disabled: false,
        display: false,
        type: type,
        displayText: `${prefix} ${getDisplayText(Remark, remIdIndex, element)}`.trim(),
        defaultValue: renamer_1.getDefaultValue(Remark[remTextIndex].path, domain),
        path: [
            { path: Remark[remTextIndex].path.replace('INDEX', i), value: '' },
            other_1.getTC(element, Remark[remTransactionCodeIndex].path.replace('INDEX', i)),
            other_1.getSequence(element, Remark[remSequenceIndex].path.replace('INDEX', i), i),
            other_1.getDomainName(element, Remark[remDomainNameIndex].path.replace('INDEX', i)),
            other_1.getXID(element, Remark[remIdIndex].path.replace('INDEX', i))
        ],
        gtmVersion,
        xmlNs
    };
};
exports.mapItemFeature = (element, ItemFeature, type, gtmVersion, xmlNs, i, prefix, domain) => {
    const fetIdIndex = getIndex(ItemFeature, 'Xid');
    const fetDomainNameIndex = getIndex(ItemFeature, 'DomainName');
    const fetValueIndex = getIndex(ItemFeature, 'ItemFeatureValue');
    const remTransactionCodeIndex = getIndex(ItemFeature, 'TransactionCode');
    return {
        name: `${prefix} ${element}`.trim(),
        required: true,
        disabled: false,
        display: false,
        type: type,
        displayText: `${prefix} ${getDisplayText(ItemFeature, fetIdIndex, element)}`.trim(),
        defaultValue: renamer_1.getDefaultValue(ItemFeature[fetValueIndex].path, domain),
        path: [
            { path: ItemFeature[fetValueIndex].path, value: '' },
            other_1.getDomainName(element, ItemFeature[fetDomainNameIndex].path),
            other_1.getTC(element, ItemFeature[remTransactionCodeIndex].path),
            other_1.getXID(element, ItemFeature[fetIdIndex].path)
        ],
        gtmVersion,
        xmlNs
    };
};
exports.mapItemClassification = (element, ItemClassification, type, gtmVersion, xmlNs, i, domain) => {
    const fetIdIndex = getIndex(ItemClassification, 'Xid');
    const fetValueIndex = getIndex(ItemClassification, 'ClassificationCode');
    const remTransactionCodeIndex = getIndex(ItemClassification, 'TransactionCode');
    return {
        name: `${element} Classification`,
        required: true,
        disabled: false,
        display: false,
        type: type,
        displayText: `${element} Classification`,
        defaultValue: renamer_1.getDefaultValue(ItemClassification[fetValueIndex].path, domain),
        path: [
            { path: ItemClassification[fetValueIndex].path, value: '' },
            other_1.getTC(element, ItemClassification[remTransactionCodeIndex].path),
            other_1.getXID(element, ItemClassification[fetIdIndex].path)
        ],
        gtmVersion,
        xmlNs
    };
};
exports.mapInvolvedParty = (element, InvolvedParty, type, gtmVersion, xmlNs, i, prefix, domain = '') => {
    const remIdIndex = getIndex(InvolvedParty, /InvolvedPartyQualifierGid(.*?)Xid/);
    const remTextIndex = getIndex(InvolvedParty, /ContactGid(.*?)Xid/);
    const remTextIndexDomain = getIndex(InvolvedParty, /ContactGid(.*?)DomainName/);
    const remTransactionCodeIndex = getIndex(InvolvedParty, 'TransactionCode');
    return {
        name: `${prefix} ${element} Contact ID`.trim(),
        required: true,
        disabled: false,
        display: false,
        type: type,
        displayText: `${prefix} ${getDisplayText(InvolvedParty, remIdIndex, element)} Contact ID`.trim(),
        defaultValue: renamer_1.getDefaultValue(InvolvedParty[remTextIndex].path, domain),
        path: [
            { path: InvolvedParty[remTextIndex].path, value: '' },
            other_1.getTC(element, InvolvedParty[remTransactionCodeIndex].path),
            { path: InvolvedParty[remTextIndexDomain].path, value: domain },
            other_1.getXID(element, InvolvedParty[remIdIndex].path)
        ],
        gtmVersion,
        xmlNs
    };
};
exports.mapItemDescription = (element, ItemDescription, type, gtmVersion, xmlNs, i, domain) => {
    const remIdIndex = getIndex(ItemDescription, 'Xid');
    const remDomainNameIndex = getIndex(ItemDescription, 'DomainName');
    const remTextIndex = getIndex(ItemDescription, ':Description');
    const remSequenceIndex = getIndex(ItemDescription, 'SequenceNumber');
    const remTransactionCodeIndex = getIndex(ItemDescription, 'TransactionCode');
    return {
        name: `Description in ${element.split('::')[1]}`,
        required: true,
        disabled: false,
        display: false,
        type: type,
        displayText: `Description in ${element.split('::')[1]}`,
        defaultValue: renamer_1.getDefaultValue(ItemDescription[remTextIndex].path, domain),
        path: [
            { path: ItemDescription[remTextIndex].path, value: '' },
            other_1.getTC(element.split('::')[0], ItemDescription[remTransactionCodeIndex].path),
            other_1.getSequence(element.split('::')[0], ItemDescription[remSequenceIndex].path, i),
            other_1.getDomainName(element.split('::')[0], ItemDescription[remDomainNameIndex].path),
            other_1.getXID(element.split('::')[0], ItemDescription[remIdIndex].path)
        ],
        gtmVersion,
        xmlNs
    };
};
