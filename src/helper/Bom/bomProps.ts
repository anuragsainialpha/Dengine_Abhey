import { capitalize, getDomainName, getTC, getXID, getSequence } from '../other';
import { getMandatoryElement, getDefaultValue } from '../renamer';
import { NAME } from '../other';

const BOM_MANDATORY_FIELD = [
  'Bom TransactionCode',
  'Bom ID DomainName',
  'Bom ID',
  'Item ID DomainName',
  'Item ID',
  ...Object.values(NAME.bom)
  ];

const getDisplayText = (prop, index, element) => {
  const displayText = capitalize(element.split('_').join(' '));
  return displayText.split('.')[1] ? displayText.split('.')[1] : displayText;
};

const getIndex = (prop, serachTerm) => {
  const getIndex = d => d.path.search(serachTerm) > -1;
  return prop.findIndex(getIndex);
};

for (let addressSequenceIndex = 0; addressSequenceIndex < getSequence.length; addressSequenceIndex++) {
  const element = getSequence[addressSequenceIndex]; 
}

export const mapHeader = (element, type, gtmVersion, xmlNs, domain) => {
  return {
    name: element.name,
    required: true,
    disabled: getMandatoryElement(element.name, BOM_MANDATORY_FIELD),
    display: getMandatoryElement(element.name, BOM_MANDATORY_FIELD),
    type: type,
    displayText: element.name,
    defaultValue: getDefaultValue(element.path, domain),
    path: [element.path],
    gtmVersion,
    xmlNs
  };
};

export const mapRefnum = (element, Refnum, type, gtmVersion, xmlNs, i, prefix, domain) => {
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
    defaultValue: getDefaultValue(Refnum[refValueIndex].path, domain),
    path: [
      { path: Refnum[refValueIndex].path.replace('INDEX', i), value: '' },
      getDomainName(element, Refnum[refDomainNameIndex].path.replace('INDEX', i)),
      getTC(element, Refnum[remTransactionCodeIndex].path.replace('INDEX', i)),
      getXID(element, Refnum[refIdIndex].path.replace('INDEX', i))
    ],
    gtmVersion,
    xmlNs
  };
};

export const mapRemark = (element, Remark, type, gtmVersion, xmlNs, i, prefix, domain) => {
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
    defaultValue: getDefaultValue(Remark[remTextIndex].path, domain),
    path: [
      { path: Remark[remTextIndex].path.replace('INDEX', i), value: '' },
      getTC(element, Remark[remTransactionCodeIndex].path.replace('INDEX', i)),
      getSequence(element, Remark[remSequenceIndex].path.replace('INDEX', i), i),
      getDomainName(element, Remark[remDomainNameIndex].path.replace('INDEX', i)),
      getXID(element, Remark[remIdIndex].path.replace('INDEX', i))
    ],
    gtmVersion,
    xmlNs
  };
};

export const mapInvolvedParty = (element, InvolvedParty, type, gtmVersion, xmlNs, i, prefix, domain = '') => {
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
    defaultValue: getDefaultValue(InvolvedParty[remTextIndex].path, domain),
    path: [
      { path: InvolvedParty[remTextIndex].path, value: '' },
      getTC(element, InvolvedParty[remTransactionCodeIndex].path),
      { path: InvolvedParty[remTextIndexDomain].path, value: domain },
      getXID(element, InvolvedParty[remIdIndex].path)
    ],
    gtmVersion,
    xmlNs
  };
};
