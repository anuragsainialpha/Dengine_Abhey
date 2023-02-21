import { capitalize, getDomainName, getTC, getXID } from '../other';
import { getMandatoryElement, getDefaultValue } from '../renamer';

const TRACKING_EVENT_MANDATORY_FIELD = [
  'Status Code ID',
  'Status Code ID DomainName',
  'Stop Sequence Num',
  'Time Zone ID',
  'Log Date',
  'Responsible Party ID DomainName',
  'Responsible Party ID'
];

const getDisplayText = (prop, index, element) => {
  const displayText = capitalize(element.split('_').join(' '));
  return displayText.split('.')[1] ? displayText.split('.')[1] : displayText;
};

const getIndex = (prop, serachTerm) => {
  const getIndex = d => d.path.search(serachTerm) > -1;
  return prop.findIndex(getIndex);
};

export const mapHeader = (element, type, gtmVersion, xmlNs, domain) => {
  return {
    name: element.name,
    required: true,
    disabled: getMandatoryElement(element.name, TRACKING_EVENT_MANDATORY_FIELD),
    display: getMandatoryElement(element.name, TRACKING_EVENT_MANDATORY_FIELD),
    type: type,
    displayText: element.name,
    defaultValue: getDefaultValue(element.path, domain),
    path: [element.path],
    gtmVersion,
    xmlNs
  };
};

export const mapRefnum = (element, Refnum, type, gtmVersion, xmlNs, i, domain) => {
  const refIdIndex = getIndex(Refnum, 'Xid');
  const refDomainNameIndex = getIndex(Refnum, 'DomainName');
  const refValueIndex = getIndex(Refnum, 'ShipmentRefnumValue');
  const remTransactionCodeIndex = getIndex(Refnum, 'TransactionCode');
  return {
    name: getShipmentIDforTracking(element),
    required: true,
    disabled: getMandatoryShipmentIDforTracking(element),
    display: getMandatoryShipmentIDforTracking(element),
    type: type,
    displayText: getShipmentIDforTracking(getDisplayText(Refnum, refIdIndex, element)),
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

const getShipmentIDforTracking = name => (name.toUpperCase() === 'GLOG' ? 'Shipment ID' : name);
const getMandatoryShipmentIDforTracking = name => (name.toUpperCase() === 'GLOG' ? true : false);
