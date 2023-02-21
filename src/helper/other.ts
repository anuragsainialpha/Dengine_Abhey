import fs from 'fs';
import util from 'util';
import config from 'config';
import jwt from 'jsonwebtoken';
import random from 'random-string-generator';
import { AsyncResult } from '../interfaces/AsynResult';
import { ConfigConstant } from '../interfaces/Config';

const readFile = util.promisify(fs.readFile);

const getSubscription = (subsciptions: string): string[] => {
  return ['user', 'settings', 'transmission', ...subsciptions.split(',').map(mapSubscription())];
};

export const CONSTS: ConfigConstant = {
  JWT_PRIVATE_KEY: process.env.NODE_ENV === 'production' ? random('alphanumeric') : 'sfeefv',
  DB: config.get('db'),
  DEV_INSTANCEURL: config.get('devInstanceURL'),
  TEST_INSTANCEURL: config.get('testInstanceURL'),
  PROD_INSTANCEURL: config.get('prodInstanceURL'),
  GTMVERSION: config.get('gtmVersion'),
  CURRENT_INSTANCE: config.get('currentInstance'),
  IS_CLIENT: config.get('isClient'),
  SCHEMA_URI: config.get('schemaURI'),
  CLIENT_TOKEN: config.get('clientToken'),
  SUBSCIPTION: getSubscription(config.get<any>('subsciption')),
};

export const getFileData = async (file) => {
  return await readFile(file, 'UTF-8');
};

export const capitalize = (s) => {
  return s.toLowerCase().replace(/\b./g, function (a) {
    return a.toUpperCase();
  });
};

export const getXMlVersion = (fileData) => {
  const xmlNs = fileData.match(/xmlns="(.*?)"/);
  const xmlNsOtm = fileData.match(/otm="(.*?)"/);
  const xmlNsGtm = fileData.match(/gtm="(.*?)"/);
  if (!xmlNs) return { gtmVersion: null, xmlNsOtm: null, xmlNsGtm: null };
  const version = xmlNs[1].split('v');
  const gtmVersion = +version[version.length - 1];
  return { gtmVersion, xmlNsOtm: xmlNsOtm[1], xmlNsGtm: xmlNsGtm[1] };
};

export const NAME: any = {
  release: {
    Source_Location_Domain_Name: 'Source Location DomainName',
    Source_Location_ID: 'Source Location ID',
    Destination_Location_Domain_Name: 'Destination Location DomainName',
    Destination_Location_ID: 'Destination Location ID',
    Order_Configuration: 'Order Configuration',
    Line_Item_Domain_Name: 'Line Item DomainName',
    Line_Item_ID: 'Line Item ID',
  },
  location: {
    AddressLine: 'Address Line',
    AddressLineSequenceNumber: 'Address Line Sequence Number',
  },
  party: {
    Location_ID_Domain_Name: 'Location ID DomainName',
    Location_ID: 'Location ID',
    Location_Transaction_Code: 'Location TransactionCode',
    Country_Code_3_ID: 'Country Code 3 ID',
    AddressLine: 'Address Line',
    AddressLineSequenceNumber: 'Address Line Sequence Number',
  },
  transaction: {
    Gtm_Transaction_ID_Domain_Name: 'Transaction ID DomainName',
    Gtm_Transaction_ID: 'Transaction ID',
    Gtm_Transaction_Line_ID_Domain_Name: 'Line ID DomainName',
    Gtm_Transaction_Line_ID: 'Line ID',
  },
  bom: {
    // Prod_Class_Type_ID: 'Prod Class Type ID',
    // Prod_Class_Code_ID: 'Prod Class Code ID',
    // Bom_Component_Structure_Comp_Seq: 'Bom_Component_Structure_Comp_Seq',
    // Bom_Component_0_TransactionCode: 'Bom_Component_0_TransactionCode',
    // Bom_Component_Item_ID_DomainName: 'Bom_Component_Item_ID_DomainName',
    // Bom_Component_Item_ID: 'Bom_Component_Item_ID',
    // Bom_Component_Prod_Class_Code_ID: 'Bom_Component_Prod_Class_Code_ID',
    // Bom_Component_Prod_Class_Type_ID: 'Bom_Component_Prod_Class_Type_ID'
  },
  orderBase: {
    Source_Location_Domain_Name: 'Source Location DomainName',
    Source_Location_ID: 'Source Location ID',
    Destination_Location_Domain_Name: 'Destination Location DomainName',
    Destination_Location_ID: 'Destination Location ID',
    Order_Configuration: 'Order Configuration',
    Line_Item_Domain_Name: 'Line Item DomainName',
    Line_Item_ID: 'Line Item ID',
    Early_Pickup_Dt: 'EarlyPickup Date',
    Early_Pickup_TZID: 'EarlyPickup TimeZone',
    Early_Pickup_TZOffset: 'EarlyPickup TimeZoneOffset',
    Late_Pickup_Dt: 'LatePickup Date',
    Late_Pickup_TZID: 'LatePickup TimeZone',
    Late_Pickup_TZOffset: 'LatePickup TimeZoneOffset',
    Early_Delivery_Dt: 'EarlyDelivery Date',
    Early_Delivery_TZID: 'EarlyDelivery TimeZone',
    Early_Delivery_TZOffset: 'EarlyDelivery TimeZoneOffset',
    Late_Delivery_Dt: 'LateDelivery Date',
    Late_Delivery_TZID: 'LateDelivery TimeZone',
    Late_Delivery_TZOffset: 'LateDelivery TimeZoneOffset',
    Order_Base_Line_Packaged_Item_Count: 'Line PackagedItem Count',
  },
  trackingEvent: {
    Shipment_ID: 'Shipment ID',
  },
  shipment: {
    Equipment_Group_ID_DomainName: 'Equipment Group ID DomainName',
    Equipment_Group_ID: 'Equipment Group ID',
    Equipment_ID_DomainName: 'Equipment ID DomainName',
    Equipment_ID: 'Equipment ID',
    StartDt: 'Start Date',
    EndDt: 'End Date',
    ArrivalTime: 'Arrival Time',
  },
};

export const asyncHandler = async (asyncFunction) => {
  const result: AsyncResult = { data: '', error: '' };
  try {
    const { data } = await asyncFunction;
    result.data = data;
  } catch (ex) {
    result.error = ex.error;
  }
  if (!result.data && !result.error) {
    result.error = 'Something failed!';
  }
  return result;
};

export const generateAuthToken = function (args) {
  return jwt.sign({ ...args }, CONSTS.JWT_PRIVATE_KEY, { expiresIn: '12h' });
};

export const getReportUrl = (no) =>
  `/GC3/glog.webserver.transmission.ITransactionDetailServlet/1556964221938?ct=NzU0OTQ3NTc2Nzg3NTk4MjE5Mw%3D%3D&id=${no}&is_new_window=true`;

export const getViewUrl = () =>
  '/GC3/glog.webserver.finder.WindowOpenFramesetServlet/1563245261188?ct=MTc2NDM0MTg3ODk1NjM1MjU0MQ%3D%3D&bcKey=MTU2MzI0MzAwOTU2NDoy&url=GTM_OTM_OBJECTCustManagement%3Fmanager_layout_gid%3DGTM_OTM_MANAGER_LAYOUT_GID%26management_action%3Dview%26finder_set_gid%3DGTM_OTM_FINDER_SET%26pk%3DGTM_OTM_OBJECT_GID';

export const getSidebar = (isAdmin) => [
  {
    name: 'Item',
    link: 'item',
    icon: 'shopping_cart',
    api: 'items',
    display: true,
  },
  {
    name: 'Party',
    link: 'party',
    icon: 'business',
    api: 'party',
    display: true,
  },
  {
    name: 'Location',
    link: 'location',
    icon: 'add_location',
    api: 'location',
    display: true,
  },

  {
    name: 'Transaction',
    link: 'transaction',
    icon: 'swap_horizontal_circle',
    api: 'transactions',
    display: true,
  },
  {
    name: 'Order Base',
    link: 'order-base',
    icon: 'store',
    api: 'order-base',
    display: true,
  },
  {
    name: 'Order Release',
    link: 'order-release',
    icon: 'airport_shuttle',
    api: 'order-release',
    display: true,
  },
  {
    name: 'Bom',
    link: 'bom',
    icon: 'ballot',
    api: 'bom',
    display: true,
  },
  {
    name: 'Shipment',
    link: 'shipment',
    icon: 'directions_boat',
    api: 'shipment',
    display: true,
  },
  {
    name: 'Tracking Event',
    link: 'tracking-event',
    icon: 'gps_fixed',
    api: 'tracking-event',
    display: true,
  },
  {
    name: 'Audit',
    link: 'admin/audit',
    icon: 'history',
    api: 'audit',
    display: isAdmin,
  },
  {
    name: 'Settings',
    link: 'admin/settings',
    icon: 'settings',
    api: 'settings',
    display: isAdmin,
  },
];

export const convertPath = (path, prop) => {
  const result = { newPath: path, newName: path };
  const pattern = new RegExp(`${prop}.` + '[0-9]' + '.');
  const matchedProperty = path.match(pattern);
  if (matchedProperty) {
    result.newPath = path.replace(matchedProperty[0], `${prop}.INDEX.`);
    result.newName = path.replace(matchedProperty[0], `${prop}.`);
  } else {
    result.newPath = path.replace(`${prop}.`, `${prop}.INDEX.`);
  }
  if (!result.newPath.match(/\.[0-9]\./)) return result;
  result.newPath = replaceAll(result.newPath, /\.[0-9]\./, '.INDEX.');
  result.newName = result.newPath.replace(/INDEX\./g, '');
  return result;
};

function mapSubscription(): (value: string, index: number, array: string[]) => any {
  return (d: any) => d.trim().replace(' ', '-').toLowerCase();
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

export const asyncRouteHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const getDomainName = (element, path) => {
  return element.split('.')[1] ? { path: `${path}`, value: element.split('.')[0] } : { path, value: 'PUBLIC' };
};

export const getXID = (element, path) =>
  element.split('.')[1] ? { path: `${path}`, value: element.split('.')[1] } : { path: `${path}`, value: element };
export const getSequence = (element, path, i) => ({ path: `${path}`, value: i + 1 });
export const getTC = (element, path) => ({ path: `${path}`, value: 'IU' });
