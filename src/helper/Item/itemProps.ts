import { capitalize, getTC, getSequence, getDomainName, getXID } from '../other';
import { getMandatoryElement, getDefaultValue } from '../renamer';

const ITEM_MANDATORY_FIELD = ['Item TransactionCode', 'Item ID DomainName', 'Item ID'];

const getDisplayText = (prop, index, element) => {
  const displayText = capitalize(element.split('_').join(' '));
  return displayText.split('.')[1] ? displayText.split('.')[1] : displayText;
};

const getIndex = (prop, serachTerm) => {
  const getIndex = (d) => d.path.search(serachTerm) > -1;
  return prop.findIndex(getIndex);
};

for (let addressSequenceIndex = 0; addressSequenceIndex < getSequence.length; addressSequenceIndex++) {
  const element = getSequence[addressSequenceIndex];
}

export const mapHeader = (element, type, gtmVersion, xmlNs, domain) => {
  return {
    name: element.name,
    required: true,
    disabled: getMandatoryElement(element.name, ITEM_MANDATORY_FIELD),
    display: getMandatoryElement(element.name, ITEM_MANDATORY_FIELD),
    isMandatory: getMandatoryElement(element.name, ITEM_MANDATORY_FIELD),
    type: type,
    displayText: element.name,
    defaultValue: getDefaultValue(element.path, domain),
    path: [element.path],
    gtmVersion,
    xmlNs,
  };
};

export const mapRefnum = (element, Refnum, type, gtmVersion, xmlNs, i, domain) => {
  const refIdIndex = getIndex(Refnum, 'Xid');
  const refDomainNameIndex = getIndex(Refnum, 'DomainName');
  const refValueIndex = getIndex(Refnum, 'RefnumValue');
  const remTransactionCodeIndex = getIndex(Refnum, 'TransactionCode');
  return {
    name: element,
    required: true,
    disabled: false,
    display: false,
    type: type,
    displayText: getDisplayText(Refnum, refIdIndex, element),
    defaultValue: getDefaultValue(Refnum[refValueIndex].path, domain),
    path: [
      { path: Refnum[refValueIndex].path.replace('INDEX', i), value: '' },
      getDomainName(element, Refnum[refDomainNameIndex].path.replace('INDEX', i)),
      getTC(element, Refnum[remTransactionCodeIndex].path.replace('INDEX', i)),
      getXID(element, Refnum[refIdIndex].path.replace('INDEX', i)),
    ],
    gtmVersion,
    xmlNs,
  };
};

export const mapItemFeature = (element, ItemFeature, type, gtmVersion, xmlNs, i, domain) => {
  const fetIdIndex = getIndex(ItemFeature, 'Xid');
  const fetDomainNameIndex = getIndex(ItemFeature, 'DomainName');
  const fetValueIndex = getIndex(ItemFeature, 'ItemFeatureValue');
  const remTransactionCodeIndex = getIndex(ItemFeature, 'TransactionCode');
  return {
    name: element,
    required: true,
    disabled: false,
    display: false,
    type: type,
    displayText: getDisplayText(ItemFeature, fetIdIndex, element),
    defaultValue: getDefaultValue(ItemFeature[fetValueIndex].path, domain),
    path: [
      { path: ItemFeature[fetValueIndex].path, value: '' },
      getDomainName(element, ItemFeature[fetDomainNameIndex].path),
      getTC(element, ItemFeature[remTransactionCodeIndex].path),
      getXID(element, ItemFeature[fetIdIndex].path),
    ],
    gtmVersion,
    xmlNs,
  };
};

export const mapItemClassification = (element, ItemClassification, type, gtmVersion, xmlNs, i, domain) => {
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
    defaultValue: getDefaultValue(ItemClassification[fetValueIndex].path, domain),
    path: [
      { path: ItemClassification[fetValueIndex].path, value: '' },
      getTC(element, ItemClassification[remTransactionCodeIndex].path),
      getXID(element, ItemClassification[fetIdIndex].path),
    ],
    gtmVersion,
    xmlNs,
  };
};

export const mapRemark = (element, Remark, type, gtmVersion, xmlNs, i, domain) => {
  const remIdIndex = getIndex(Remark, 'Xid');
  const remDomainNameIndex = getIndex(Remark, 'DomainName');
  const remTextIndex = getIndex(Remark, 'RemarkText');
  const remSequenceIndex = getIndex(Remark, 'RemarkSequence');
  const remTransactionCodeIndex = getIndex(Remark, 'TransactionCode');
  return {
    name: element,
    required: true,
    disabled: false,
    display: false,
    type: type,
    displayText: getDisplayText(Remark, remIdIndex, element),
    defaultValue: getDefaultValue(Remark[remTextIndex].path, domain),
    path: [
      { path: Remark[remTextIndex].path.replace('INDEX', i), value: '' },
      getTC(element, Remark[remTransactionCodeIndex].path.replace('INDEX', i)),
      getSequence(element, Remark[remSequenceIndex].path.replace('INDEX', i), i),
      getDomainName(element, Remark[remDomainNameIndex].path.replace('INDEX', i)),
      getXID(element, Remark[remIdIndex].path.replace('INDEX', i)),
    ],
    gtmVersion,
    xmlNs,
  };
};

export const mapItemDescription = (element, ItemDescription, type, gtmVersion, xmlNs, i, domain) => {
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
    defaultValue: getDefaultValue(ItemDescription[remTextIndex].path, domain),
    path: [
      { path: ItemDescription[remTextIndex].path, value: '' },
      getTC(element.split('::')[0], ItemDescription[remTransactionCodeIndex].path),
      getSequence(element.split('::')[0], ItemDescription[remSequenceIndex].path, i),
      getDomainName(element.split('::')[0], ItemDescription[remDomainNameIndex].path),
      getXID(element.split('::')[0], ItemDescription[remIdIndex].path),
    ],
    gtmVersion,
    xmlNs,
  };
};
