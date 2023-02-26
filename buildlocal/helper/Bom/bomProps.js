"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const other_1 = require("../other");
const renamer_1 = require("../renamer");
const other_2 = require("../other");
const BOM_MANDATORY_FIELD = [
    'Bom TransactionCode',
    'Bom ID DomainName',
    'Bom ID',
    'Item ID DomainName',
    'Item ID',
    ...Object.values(other_2.NAME.bom)
];
const getDisplayText = (prop, index, element) => {
    const displayText = other_1.capitalize(element.split('_').join(' '));
    return displayText.split('.')[1] ? displayText.split('.')[1] : displayText;
};
const getIndex = (prop, serachTerm) => {
    const getIndex = d => d.path.search(serachTerm) > -1;
    return prop.findIndex(getIndex);
};
for (let addressSequenceIndex = 0; addressSequenceIndex < other_1.getSequence.length; addressSequenceIndex++) {
    const element = other_1.getSequence[addressSequenceIndex];
}
exports.mapHeader = (element, type, gtmVersion, xmlNs, domain) => {
    return {
        name: element.name,
        required: true,
        disabled: renamer_1.getMandatoryElement(element.name, BOM_MANDATORY_FIELD),
        display: renamer_1.getMandatoryElement(element.name, BOM_MANDATORY_FIELD),
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
