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
        case path.search('InvolvedParty') !== -1:
            extract(path, Parent, 'InvolvedParty');
            break;
        case path.search('Remark') !== -1:
            extract(path, Parent, 'Remark');
            break;
        case path.search('Refnum') !== -1:
            extract(path, Parent, 'Refnum');
            break;
        default:
            extract(path, Parent, 'Header');
    }
    return Parent;
};
exports.getChilds = flattenJson => {
    const Bom = { Bom: {}, BomComponent: {} };
    lodash_1.default.keys(flattenJson)
        .map(path => {
        switch (true) {
            case path.search('GtmStructure') === -1:
                break;
            case path.search('GtmStructureComponent') !== -1:
                getChild(path, flattenJson, Bom, 'BomComponent');
                break;
            default:
                getChild(path, flattenJson, Bom, 'Bom');
        }
        return Bom;
    })
        .filter(el => el !== undefined);
    Bom.Bom = extractProps(Bom.Bom);
    Bom.BomComponent = extractProps(Bom.BomComponent);
    return { Bom };
};
const getChild = (path, flattenJson, Bom, child) => {
    Bom[`${child}`][`${path}`] = flattenJson[`${path}`];
};
const extract = (path, Parent, child) => {
    let newPath = path;
    let newName = path;
    switch (true) {
        case child === 'InvolvedParty':
            newPath = other_1.convertPath(path, 'InvolvedParty').newPath;
            newName = other_1.convertPath(path, 'InvolvedParty').newName;
            break;
        case child === 'Remark':
            newPath = other_1.convertPath(path, 'Remark').newPath;
            newName = other_1.convertPath(path, 'Remark').newName;
            break;
        case child === 'Refnum':
            newPath = other_1.convertPath(path, 'Refnum').newPath;
            newName = other_1.convertPath(path, 'Refnum').newName;
            break;
    }
    if (!Parent[`${child}`])
        Parent[`${child}`] = [];
    Parent[`${child}`].push({ name: renamer_1.getElementName(newName), path: newPath });
    Parent[`${child}`] = lodash_1.default.uniqBy(Parent[`${child}`], 'name');
};
