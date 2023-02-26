"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schemaRelease = new mongoose_1.default.Schema({
    xmlNs: {
        type: ['String']
    },
    gtmVersion: {
        type: 'Number'
    },
    Release: {
        type: 'Mixed'
    }
});
exports.SchemaRelease = mongoose_1.default.model('SchemaRelease', schemaRelease, 'OrderReleaseSchema');
