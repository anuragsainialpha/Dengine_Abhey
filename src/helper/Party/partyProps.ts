import { capitalize, getDomainName, getTC, getXID, getSequence } from '../other';
import { getMandatoryElement, getDefaultValue } from '../renamer';
import { NAME } from '../other';

const PARTY_MANDATORY_FIELD = [
  'Party TransactionCode',
  'Party ID DomainName',
  'Party ID',
  ...Object.values(NAME.party)
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
    disabled: getMandatoryElement(element.name, PARTY_MANDATORY_FIELD),
    display: getMandatoryElement(element.name, PARTY_MANDATORY_FIELD),
    isMandatory: getMandatoryElement(element.name, PARTY_MANDATORY_FIELD),
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

export const mapAddressLine = (element, AddressLine, type, gtmVersion, xmlNs, i, prefix, domain) => {

  const addValueIndex =1;
  const addSequenceIndex = 0
  return {
    name: `${prefix} ${element}`.trim(),
    required: true,
    disabled: false,
    display: false,
    type: type,
    displayText: `${prefix} ${getDisplayText(AddressLine, i, element)}`.trim(),
    defaultValue: '',
    path: [
      { path: AddressLine[addValueIndex].path.replace('INDEX',i), value: '' },
      getSequence(element, AddressLine[addSequenceIndex].path.replace('INDEX',i), i)
    ],
    gtmVersion,
    xmlNs
  };
};

