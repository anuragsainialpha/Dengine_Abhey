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
        case path.search('ItemAttributes') !== -1:
            extract(path, Parent, 'ItemAttributes');
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
    const Release = { Release: {}, ReleaseLine: {} };
    lodash_1.default.keys(flattenJson)
        .map(path => {
        switch (true) {
            case path.search('Release') === -1 || path.search('ReleaseStatus') > -1:
                break;
            case path.search('ReleaseLine') !== -1:
                getChild(path, flattenJson, Release, 'ReleaseLine');
                break;
            default:
                getChild(path, flattenJson, Release, 'Release');
        }
        return Release;
    })
        .filter(el => el !== undefined);
    Release.Release = extractProps(Release.Release);
    Release.ReleaseLine = extractProps(Release.ReleaseLine);
    return { Release };
};
const getChild = (path, flattenJson, Release, child) => {
    Release[`${child}`][`${path}`] = flattenJson[`${path}`];
};
const extract = (path, Parent, child) => {
    let newPath = path;
    let newName = path;
    switch (true) {
        case child === 'Remark':
            newPath = other_1.convertPath(path, 'Remark').newPath;
            newName = other_1.convertPath(path, 'Remark').newName;
            break;
        case child === 'InvolvedParty':
            newPath = other_1.convertPath(path, 'InvolvedParty').newPath;
            newName = other_1.convertPath(path, 'InvolvedParty').newName;
            break;
        case child === 'Refnum':
            newPath = other_1.convertPath(path, 'Refnum').newPath;
            newName = other_1.convertPath(path, 'Refnum').newName;
            break;
        case child === 'ItemAttributes':
            newPath = other_1.convertPath(path, 'ItemAttributes').newPath;
            newName = other_1.convertPath(path, 'ItemAttributes').newName;
            break;
        default:
            break;
    }
    if (!Parent[`${child}`])
        Parent[`${child}`] = [];
    Parent[`${child}`].push({ name: renamer_1.getElementName(newName), path: newPath });
    Parent[`${child}`] = lodash_1.default.uniqBy(Parent[`${child}`], 'name');
};
