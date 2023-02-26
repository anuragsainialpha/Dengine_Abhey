"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const renamer_1 = require("../renamer");
const lodash_1 = __importDefault(require("lodash"));
const other_1 = require("../other");
const extractProps = flattenJson => {
    const Parent = {};
    lodash_1.default.keys(flattenJson)
        .map(path => getProps(path, Parent))
        .filter(el => el !== undefined);
    return Parent;
};
const getProps = (path, Parent) => {
    switch (true) {
        case path.search('Remark') !== -1:
            extract(path, Parent, 'Remark');
            break;
        case path.search('ItemFeature') !== -1:
            extract(path, Parent, 'ItemFeature');
            break;
        case path.search('GtmItemClassification') !== -1:
            extract(path, Parent, 'GtmItemClassification');
            break;
        case path.search('GtmItemDescription') !== -1:
            extract(path, Parent, 'GtmItemDescription');
            break;
        case path.search('GtmItemCountryOfOrigin') !== -1:
            extract(path, Parent, 'GtmItemCountryOfOrigin');
            break;
        case path.search('GtmItemUomConversion') !== -1:
            extract(path, Parent, 'GtmItemUomConversion');
            break;
        case path.search('Refnum') !== -1:
            extract(path, Parent, 'Refnum');
            break;
        case path.search('PricePerUnit') !== -1:
            extract(path, Parent, 'PricePerUnit');
            break;
        default:
            extract(path, Parent, 'Header');
    }
    return Parent;
};
exports.getChilds = flattenJson => {
    const ItemMaster = { Item: {}, Packaging: {} };
    lodash_1.default.keys(flattenJson)
        .map(path => {
        switch (true) {
            case path.search('ItemMaster') === -1:
                break;
            case path.search('Packaging') !== -1:
                getChild(path, flattenJson, ItemMaster, 'Packaging');
                break;
            default:
                getChild(path, flattenJson, ItemMaster, 'Item');
        }
        return ItemMaster;
    })
        .filter(el => el !== undefined);
    ItemMaster.Item = extractProps(ItemMaster.Item);
    ItemMaster.Packaging = extractProps(ItemMaster.Packaging);
    return { ItemMaster };
};
const getChild = (path, flattenJson, ItemMaster, child) => {
    ItemMaster[`${child}`][`${path}`] = flattenJson[`${path}`];
};
const extract = (path, Parent, child) => {
    let newPath = path;
    let newName = path;
    switch (true) {
        case child === 'Remark':
            newPath = other_1.convertPath(path, 'Remark').newPath;
            newName = other_1.convertPath(path, 'Remark').newName;
            break;
        case child === 'Refnum':
            newPath = other_1.convertPath(path, 'Refnum').newPath;
            newName = other_1.convertPath(path, 'Refnum').newName;
            break;
        case child === 'ItemFeature':
            newPath = other_1.convertPath(path, 'ItemFeature').newPath;
            newName = other_1.convertPath(path, 'ItemFeature').newName;
            break;
        case child === 'GtmItemClassification':
            newPath = other_1.convertPath(path, 'GtmItemClassification').newPath;
            newName = other_1.convertPath(path, 'GtmItemClassification').newName;
            break;
        case child === 'GtmItemDescription':
            newPath = other_1.convertPath(path, 'GtmItemDescription').newPath;
            newName = other_1.convertPath(path, 'GtmItemDescription').newName;
            break;
        case child === 'GtmItemCountryOfOrigin':
            newPath = other_1.convertPath(path, 'GtmItemCountryOfOrigin').newPath;
            newName = other_1.convertPath(path, 'GtmItemCountryOfOrigin').newName;
            break;
        case child === 'GtmItemUomConversion':
            newPath = other_1.convertPath(path, 'GtmItemUomConversion').newPath;
            newName = other_1.convertPath(path, 'GtmItemUomConversion').newName;
            break;
        default:
            break;
    }
    if (!Parent[`${child}`])
        Parent[`${child}`] = [];
    Parent[`${child}`].push({ name: renamer_1.getElementName(newName), path: newPath });
    Parent[`${child}`] = lodash_1.default.uniqBy(Parent[`${child}`], 'name');
};
