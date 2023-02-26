"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const renamer_1 = require("../renamer");
const lodash_1 = __importDefault(require("lodash"));
const other_1 = require("../other");
const extractProps = (flattenJson) => {
    const Parent = {};
    lodash_1.default.keys(flattenJson)
        .map((path) => getProps(path, Parent))
        .filter((el) => el !== undefined);
    return Parent;
};
const getProps = (path, Parent) => {
    switch (true) {
        case path.search('ItemGid') !== -1:
            extract(path, Parent, 'ItemGid');
            break;
        case path.search('Currency') !== -1:
            extract(path, Parent, 'Currency');
            break;
        case path.search('TransactionCurrency') !== -1:
            extract(path, Parent, 'TransactionCurrency');
            break;
        case path.search('Quantity') !== -1:
            extract(path, Parent, 'Quantity');
            break;
        case path.search('TransactionQuantity') !== -1:
            extract(path, Parent, 'TransactionQuantity');
            break;
        case path.search('TransLineDate') !== -1:
            extract(path, Parent, 'TransLineDate');
            break;
        case path.search('TransDate') !== -1:
            extract(path, Parent, 'TransDate');
            break;
        case path.search('TransactionInvLocation') !== -1:
            extract(path, Parent, 'TransactionInvLocation');
            break;
        case path.search('InvolvedParty') !== -1:
            extract(path, Parent, 'InvolvedParty');
            break;
        case path.search('UserDefinedClassification') !== -1:
            extract(path, Parent, 'UserDefinedClassification');
            break;
        case path.search('PortInfo') !== -1:
            extract(path, Parent, 'PortInfo');
            break;
        case path.search('Remark') !== -1:
            extract(path, Parent, 'Remark');
            break;
        case path.search('Refnum') !== -1:
            extract(path, Parent, 'Refnum');
            break;
        case path.search('Contact') !== -1:
            extract(path, Parent, 'Contact');
            break;
        default:
            extract(path, Parent, 'Header');
    }
    return Parent;
};
exports.getChilds = (flattenJson) => {
    const GtmTransaction = { GtmTransaction: {}, GtmTransactionLine: {} };
    lodash_1.default.keys(flattenJson)
        .map((path) => {
        switch (true) {
            case path.search('GtmTransaction') === -1:
                break;
            case path.search('GtmTransactionLine') !== -1:
                getChild(path, flattenJson, GtmTransaction, 'GtmTransactionLine');
                break;
            default:
                getChild(path, flattenJson, GtmTransaction, 'GtmTransaction');
        }
        return GtmTransaction;
    })
        .filter((el) => el !== undefined);
    GtmTransaction.GtmTransaction = extractProps(GtmTransaction.GtmTransaction);
    GtmTransaction.GtmTransactionLine = extractProps(GtmTransaction.GtmTransactionLine);
    return { GtmTransaction };
};
const getChild = (path, flattenJson, GtmTransaction, child) => {
    GtmTransaction[`${child}`][`${path}`] = flattenJson[`${path}`];
};
const extract = (path, Parent, child) => {
    let newPath = path;
    let newName = path;
    switch (true) {
        case child === 'ItemGid':
            newPath = other_1.convertPath(path, 'ItemGid').newPath;
            newName = other_1.convertPath(path, 'ItemGid').newName;
            break;
        case child === 'Currency':
            newPath = other_1.convertPath(path, 'Currency').newPath;
            newName = other_1.convertPath(path, 'Currency').newName;
            break;
        case child === 'TransactionCurrency':
            newPath = other_1.convertPath(path, 'TransactionCurrency').newPath;
            newName = other_1.convertPath(path, 'TransactionCurrency').newName;
            break;
        case child === 'Quantity':
            newPath = other_1.convertPath(path, 'Quantity').newPath;
            newName = other_1.convertPath(path, 'Quantity').newName;
            break;
        case child === 'TransactionQuantity':
            newPath = other_1.convertPath(path, 'TransactionQuantity').newPath;
            newName = other_1.convertPath(path, 'TransactionQuantity').newName;
            break;
        case child === 'TransLineDate':
            newPath = other_1.convertPath(path, 'TransLineDate').newPath;
            newName = other_1.convertPath(path, 'TransLineDate').newName;
            break;
        case child === 'TransDate':
            newPath = other_1.convertPath(path, 'TransDate').newPath;
            newName = other_1.convertPath(path, 'TransDate').newName;
            break;
        case child === 'TransactionInvLocation':
            newPath = other_1.convertPath(path, 'TransactionInvLocation').newPath;
            newName = other_1.convertPath(path, 'TransactionInvLocation').newName;
            break;
        case child === 'UserDefinedClassification':
            newPath = other_1.convertPath(path, 'UserDefinedClassification').newPath;
            newName = other_1.convertPath(path, 'UserDefinedClassification').newName;
            break;
        case child === 'Remark':
            newPath = other_1.convertPath(path, 'Remark').newPath;
            newName = other_1.convertPath(path, 'Remark').newName;
            break;
        case child === 'PortInfo':
            newPath = other_1.convertPath(path, 'PortInfo').newPath;
            newName = other_1.convertPath(path, 'PortInfo').newName;
            break;
        case child === 'Refnum':
            newPath = other_1.convertPath(path, 'Refnum').newPath;
            newName = other_1.convertPath(path, 'Refnum').newName;
            break;
        case child === 'InvolvedParty':
            newPath = other_1.convertPath(path, 'InvolvedParty').newPath;
            newName = other_1.convertPath(path, 'InvolvedParty').newName;
            break;
        case child === 'Contact':
            newPath = other_1.convertPath(path, 'Contact').newPath;
            newName = other_1.convertPath(path, 'Contact').newName;
            break;
        default:
            break;
    }
    if (!Parent[`${child}`])
        Parent[`${child}`] = [];
    Parent[`${child}`].push({ name: renamer_1.getElementName(newName), path: newPath });
    Parent[`${child}`] = lodash_1.default.uniqBy(Parent[`${child}`], 'name');
};
