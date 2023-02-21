import { CONSTS } from './other';
// Tag mapper helpers
import { NAME } from './other';

export const getElementName = xpath => {
  const path = xpath.replace(/(otm:|otm|gtm:|gtm)/gi, '');
  const posGid = path.lastIndexOf('Gid');
  const preGid = path.substring(0, posGid - 1).lastIndexOf('.') + 1;
  const preXid = path.substring(preGid, posGid - 1);
  const postXid = path.substring(path.lastIndexOf('.') + 1);
  const posTC = path.lastIndexOf('TransactionCode');
  const postTC = path.substring(0, posTC - 1).lastIndexOf('.') + 1;
  const posCoo = path.lastIndexOf('GtmItemCountryOfOrigin');
  const postCoo = path.substring(0, posCoo - 1).lastIndexOf('.') + 1;
  const posSeq = path.lastIndexOf('SequenceNumber');
  const postSeq = path.substring(0, posSeq - 1).lastIndexOf('.') + 1;
  const posDes = path.lastIndexOf('Description');
  const postDes = path.substring(0, posDes - 1).lastIndexOf('.') + 1;
  // getting initials
  let name = path.search('Xid') > -1 ? preXid : postXid;
  name = name.replace(/(otm:|otm|gtm:|gtm)/gi, '').trim();
  switch (true) {
    case name === 'DomainName':
      name = path.substring(preGid, posGid - 1) + name;
      break;
    case name === 'TransactionCode':
      name = path.substring(postTC, posTC - 1).replace(/Header/g, '') + name;
      break;
    case name === 'GtmItemCountryOfOrigin':
      name = 'Suppliers' + path.substring(postCoo, posCoo - 1) + name;
      break;
    case name === 'SequenceNumber':
      name = path.substring(postSeq, posSeq - 1) + name;
      break;
    case name === 'Description':
      name = path.substring(postDes, posDes - 1) + name;
      break;
    default:
      name = name.trim();
  }
  name = name.replace(/(otm:|otm|gtm:|gtm)/gi, '').trim();
  const splittedArray = name.match(/[A-Z][a-z]+|[0-9]+/g);
  name = splittedArray && splittedArray.length > 1 ? splittedArray.join(' ').replace('Gid', 'ID') : name;
  name = getExceptionalNames(name);
  return getCustomName(name, xpath);
};

export const getMandatoryElement = (name, mandatoryList: any[] = []) => mandatoryList.findIndex(d => d === name) > -1;
export const getDefaultValue = (path, domain) => {
  if (path.search('TransactionCode') > -1) {
    return 'IU';
  }

  if (path.search('DomainName') > -1) {
    return domain;
  }

  return '';
};

const getCustomName = (name, path) => {
   // Bom
  if (path.match(/GtmStructureComponent/)) return `Bom Component ${name.replace(/(GtmStructure(.*?)Component)/gi, '').trim()}`;
  // if (path.match(/GtmStructure(.*?)GtmStructureComponent/)) return `Component ${name.replace(/GtmStructure(.*?)component/, '').trim()}`;
  if (path.match(/GtmStructure(.*?)/)) return name.replace(/(Structure)/g, 'Bom').trim();

  if (path.match(/GtmContact(.*?)AddressLines(.*?)SequenceNumber/))return NAME.party.AddressLineSequenceNumber;
  if (path.match(/GtmContact(.*?)AddressLines(.*?)AddressLine/))return NAME.party.AddressLine;
  if (path.match(/Location(.*?)AddressLines(.*?)SequenceNumber/))return NAME.location.AddressLineSequenceNumber;
  if (path.match(/Location(.*?)AddressLines(.*?)AddressLine/))return NAME.location.AddressLine;
  if (path.match(/Release(.*?)ShipFromLocationRef(.*?)DomainName/)) return NAME.release.Source_Location_Domain_Name;
  if (path.match(/Release(.*?)ShipFromLocationRef(.*?)Xid/)) return NAME.release.Source_Location_ID;
  if (path.match(/Release(.*?)ShipToLocationRef(.*?)DomainName/)) return NAME.release.Destination_Location_Domain_Name;
  if (path.match(/Release(.*?)ShipFromLocationRef(.*?)Xid/)) return NAME.release.Source_Location_ID;
  if (path.match(/Release(.*?)ShipToLocationRef(.*?)Xid/)) return NAME.release.Destination_Location_ID;
  if (path.match(/Release(.*?)ReleaseMethodGid(.*?)Xid/)) return NAME.release.Order_Configuration;
  if (path.match(/Release(.*?)InitialItemGid(.*?)DomainName/)) return NAME.release.Line_Item_Domain_Name;
  if (path.match(/Release(.*?)InitialItemGid(.*?)Xid/)) return NAME.release.Line_Item_ID;
  if (path.match(/Release(.*?)ReleaseLine/)) return `Line ${name.replace(/Release(.*?)Line/, '').trim()}`;
  // dates
  if (path.match(/EarlyPickupDt(.*?)GLogDate/)) return NAME.orderBase.Early_Pickup_Dt;
  if (path.match(/EarlyPickupDt(.*?)TZId/)) return NAME.orderBase.Early_Pickup_TZID;
  if (path.match(/EarlyPickupDt(.*?)TZOffset/)) return NAME.orderBase.Early_Pickup_TZOffset;
  if (path.match(/LatePickupDt(.*?)GLogDate/)) return NAME.orderBase.Late_Pickup_Dt;
  if (path.match(/LatePickupDt(.*?)TZId/)) return NAME.orderBase.Late_Pickup_TZID;
  if (path.match(/LatePickupDt(.*?)TZOffset/)) return NAME.orderBase.Late_Pickup_TZOffset;
  if (path.match(/LateDeliveryDt(.*?)GLogDate/)) return NAME.orderBase.Late_Delivery_Dt;
  if (path.match(/LateDeliveryDt(.*?)TZId/)) return NAME.orderBase.Late_Delivery_TZID;
  if (path.match(/LateDeliveryDt(.*?)TZOffset/)) return NAME.orderBase.Late_Delivery_TZOffset;
  if (path.match(/EarlyDeliveryDt(.*?)GLogDate/)) return NAME.orderBase.Early_Delivery_Dt;
  if (path.match(/EarlyDeliveryDt(.*?)TZId/)) return NAME.orderBase.Early_Delivery_TZID;
  if (path.match(/EarlyDeliveryDt(.*?)TZOffset/)) return NAME.orderBase.Early_Delivery_TZOffset;
  if (path.match(/StartDt(.*?)GLogDate/)) return NAME.shipment.StartDt;
  if (path.match(/EndDt(.*?)GLogDate/)) return NAME.shipment.EndDt;
  if (path.match(/ArrivalTime(.*?)GLogDate/)) return NAME.shipment.ArrivalTime;
  // order base
  if (path.match(/TransOrder(.*?)ShipFromLocationRef(.*?)DomainName/)) return NAME.orderBase.Source_Location_Domain_Name;
  if (path.match(/TransOrder(.*?)ShipFromLocationRef(.*?)Xid/)) return NAME.orderBase.Source_Location_ID;
  if (path.match(/TransOrder(.*?)ShipToLocationRef(.*?)DomainName/)) return NAME.orderBase.Destination_Location_Domain_Name;
  if (path.match(/TransOrder(.*?)ShipFromLocationRef(.*?)Xid/)) return NAME.orderBase.Source_Location_ID;
  if (path.match(/TransOrder(.*?)ShipToLocationRef(.*?)Xid/)) return NAME.orderBase.Destination_Location_ID;
  if (path.match(/TransOrder(.*?)ReleaseMethodGid(.*?)Xid/)) return NAME.orderBase.Order_Configuration;
  if (path.match(/TransOrder(.*?)InitialItemGid(.*?)DomainName/)) return NAME.orderBase.Line_Item_Domain_Name;
  if (path.match(/TransOrder(.*?)InitialItemGid(.*?)Xid/)) return NAME.orderBase.Line_Item_ID;
  if (path.match(/TransOrderLine/)) return `Line ${name.replace(/(Trans(.*?)Order(.*?)Line|Order(.*?)Line)/g, '').trim()}`;
  if (path.match(/TransOrder(.*?)TransOrderHeader/)) return name.replace(/Trans(.*?)Order/g, 'OrderBase').trim();
  // transaction
  if (path.match(/GtmTransactionLine/)) return `Line ${name.replace(/(Transaction(.*?)Line)/gi, '').trim()}`;
  if (path.match(/GtmTransaction(.*?)/)) return name.replace(/(Transaction)/g, 'Transaction').trim();
  // Party
  if (path.match(/LocationRefGid(.*?)DomainName/)) return NAME.location.Location_ID_Domain_Name;
  if (path.match(/LocationRefGid(.*?)Xid/)) return NAME.location.Location_ID;
  if (path.match(/LocationRefGid\.(.*?)/) && !name.includes('LocationRef')) return `Location ${name.trim()}`;
  if (path.match(/Contact(.*?)/)) return name.replace(/(Party|Contact)/gi, 'Party').trim();
 
  
  // if nothing matches
  return name;
};

function getExceptionalNames(name) {
  return name
    .replace('Transaction Code', 'TransactionCode')
    .replace('Domain Name', 'DomainName')
    .replace('Service Provider', 'ServiceProvider')
    .replace('User Defined', 'UserDefined')
    .replace('Ship Unit', 'ShipUnit')
    .replace('Packaged Item', 'PackagedItem');
}