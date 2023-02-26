"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schemaLocation = new mongoose_1.default.Schema({
    xmlNs: {
        type: ['String']
    },
    gtmVersion: {
        type: 'Number'
    },
    Location: {
        type: 'Mixed'
    }
});
exports.SchemaLocation = mongoose_1.default.model('SchemaLocation', schemaLocation, 'LocationSchema');
