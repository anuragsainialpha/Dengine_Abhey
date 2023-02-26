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
        case path.search('Refnum') !== -1:
            extract(path, Parent, 'Refnum');
            break;
        case path.search('AddressLines') !== -1:
            extract(path, Parent, 'AddressLines');
            break;
        default:
            extract(path, Parent, 'Header');
    }
    return Parent;
};
exports.getChilds = flattenJson => {
    const Location = { Locations: {}, Contact: {}, ServiceProvider: {} };
    lodash_1.default.keys(flattenJson)
        .map(path => {
        switch (true) {
            case path.search('Location') === -1:
                break;
            case path.search('Contact') !== -1:
                getChild(path, flattenJson, Location, 'Contact');
                break;
            case path.search('ServiceProvider') !== -1:
                getChild(path, flattenJson, Location, 'ServiceProvider');
                break;
            default:
                getChild(path, flattenJson, Location, 'Locations');
        }
        return Location;
    })
        .filter(el => el !== undefined);
    Location.Locations = extractProps(Location.Locations);
    Location.Contact = extractProps(Location.Contact);
    Location.ServiceProvider = extractProps(Location.ServiceProvider);
    Location.Locations.Contact = { ...Location.Contact };
    Location.Locations.ServiceProvider = { ...Location.ServiceProvider };
    return { Location: Location.Locations };
};
const getChild = (path, flattenJson, Location, child) => {
    Location[`${child}`][`${path}`] = flattenJson[`${path}`];
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
        case child === 'AddressLines':
            newPath = other_1.convertPath(path, 'AddressLines').newPath;
            newName = other_1.convertPath(path, 'AddressLines').newName;
            break;
    }
    if (!Parent[`${child}`])
        Parent[`${child}`] = [];
    Parent[`${child}`].push({ name: renamer_1.getElementName(newName), path: newPath });
    Parent[`${child}`] = lodash_1.default.uniqBy(Parent[`${child}`], 'name');
};
