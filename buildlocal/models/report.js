"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reportSchema = new mongoose_1.default.Schema({
    item: {
        type: 'Number',
        default: 0
    },
    party: {
        type: 'Number',
        default: 0
    },
    location: {
        type: 'Number',
        default: 0
    },
    'order-release': {
        type: 'Number',
        default: 0
    },
    'order-base': {
        type: 'Number',
        default: 0
    },
    bom: {
        type: 'Number',
        default: 0
    },
    transaction: {
        type: 'Number',
        default: 0
    },
    'tracking-event': {
        type: 'Number',
        default: 0
    },
    shipment: {
        type: 'Number',
        default: 0
    },
    user: {
        type: 'String',
        required: true
    },
    insertDate: {
        type: Date,
        default: Date.now
    }
});
exports.Report = instance => mongoose_1.default.model('Report', reportSchema, `Report_${instance}`);
