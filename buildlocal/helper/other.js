"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const util_1 = __importDefault(require("util"));
const config_1 = __importDefault(require("config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const random_string_generator_1 = __importDefault(require("random-string-generator"));
const readFile = util_1.default.promisify(fs_1.default.readFile);
const getSubscription = (subsciptions) => {
    return ['user', 'settings', 'transmission', ...subsciptions.split(',').map(mapSubscription())];
};
exports.CONSTS = {
    JWT_PRIVATE_KEY: process.env.NODE_ENV === 'production' ? random_string_generator_1.default('alphanumeric') : 'sfeefv',
    DB: config_1.default.get('db'),
    DEV_INSTANCEURL: config_1.default.get('devInstanceURL'),
    TEST_INSTANCEURL: config_1.default.get('testInstanceURL'),
    PROD_INSTANCEURL: config_1.default.get('prodInstanceURL'),
    GTMVERSION: config_1.default.get('gtmVersion'),
    CURRENT_INSTANCE: config_1.default.get('currentInstance'),
    IS_CLIENT: config_1.default.get('isClient'),
    SCHEMA_URI: config_1.default.get('schemaURI'),
    CLIENT_TOKEN: config_1.default.get('clientToken'),
    SUBSCIPTION: getSubscription(config_1.default.get('subsciption')),
};
exports.getFileData = async (file) => {
    return await readFile(file, 'UTF-8');
};
exports.capitalize = (s) => {
    return s.toLowerCase().replace(/\b./g, function (a) {
        return a.toUpperCase();
    });
};
exports.getXMlVersion = (fileData) => {
    const xmlNs = fileData.match(/xmlns="(.*?)"/);
    const xmlNsOtm = fileData.match(/otm="(.*?)"/);
    const xmlNsGtm = fileData.match(/gtm="(.*?)"/);
    if (!xmlNs)
        return { gtmVersion: null, xmlNsOtm: null, xmlNsGtm: null };
    const version = xmlNs[1].split('v');
    const gtmVersion = +version[version.length - 1];
    return { gtmVersion, xmlNsOtm: xmlNsOtm[1], xmlNsGtm: xmlNsGtm[1] };
};
exports.NAME = {
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
    bom: {},
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
exports.asyncHandler = async (asyncFunction) => {
    const result = { data: '', error: '' };
    try {
        const { data } = await asyncFunction;
        result.data = data;
    }
    catch (ex) {
        result.error = ex.error;
    }
    if (!result.data && !result.error) {
        result.error = 'Something failed!';
    }
    return result;
};
exports.generateAuthToken = function (args) {
    return jsonwebtoken_1.default.sign({ ...args }, exports.CONSTS.JWT_PRIVATE_KEY, { expiresIn: '12h' });
};
exports.getReportUrl = (no) => `/GC3/glog.webserver.transmission.ITransactionDetailServlet/1556964221938?ct=NzU0OTQ3NTc2Nzg3NTk4MjE5Mw%3D%3D&id=${no}&is_new_window=true`;
exports.getViewUrl = () => '/GC3/glog.webserver.finder.WindowOpenFramesetServlet/1563245261188?ct=MTc2NDM0MTg3ODk1NjM1MjU0MQ%3D%3D&bcKey=MTU2MzI0MzAwOTU2NDoy&url=GTM_OTM_OBJECTCustManagement%3Fmanager_layout_gid%3DGTM_OTM_MANAGER_LAYOUT_GID%26management_action%3Dview%26finder_set_gid%3DGTM_OTM_FINDER_SET%26pk%3DGTM_OTM_OBJECT_GID';
exports.getSidebar = (isAdmin) => [
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
exports.convertPath = (path, prop) => {
    const result = { newPath: path, newName: path };
    const pattern = new RegExp(`${prop}.` + '[0-9]' + '.');
    const matchedProperty = path.match(pattern);
    if (matchedProperty) {
        result.newPath = path.replace(matchedProperty[0], `${prop}.INDEX.`);
        result.newName = path.replace(matchedProperty[0], `${prop}.`);
    }
    else {
        result.newPath = path.replace(`${prop}.`, `${prop}.INDEX.`);
    }
    if (!result.newPath.match(/\.[0-9]\./))
        return result;
    result.newPath = replaceAll(result.newPath, /\.[0-9]\./, '.INDEX.');
    result.newName = result.newPath.replace(/INDEX\./g, '');
    return result;
};
function mapSubscription() {
    return (d) => d.trim().replace(' ', '-').toLowerCase();
}
function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}
exports.asyncRouteHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
exports.getDomainName = (element, path) => {
    return element.split('.')[1] ? { path: `${path}`, value: element.split('.')[0] } : { path, value: 'PUBLIC' };
};
exports.getXID = (element, path) => element.split('.')[1] ? { path: `${path}`, value: element.split('.')[1] } : { path: `${path}`, value: element };
exports.getSequence = (element, path, i) => ({ path: `${path}`, value: i + 1 });
exports.getTC = (element, path) => ({ path: `${path}`, value: 'IU' });
