"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importDefault(require("mongoose"));
const settingsSchema = new mongoose_1.default.Schema({
    url: { type: 'String' },
    version: { type: 'Number' },
    glogPerTrx: {
        type: 'Number',
        default: 10,
    },
    item: {
        type: 'Number',
        default: 0,
    },
    party: {
        type: 'Number',
        default: 0,
    },
    location: {
        type: 'Number',
        default: 0,
    },
    'order-release': {
        type: 'Number',
        default: 0,
    },
    'order-base': {
        type: 'Number',
        default: 0,
    },
    bom: {
        type: 'Number',
        default: 0,
    },
    transaction: {
        type: 'Number',
        default: 0,
    },
    'tracking-event': {
        type: 'Number',
        default: 0,
    },
    shipment: {
        type: 'Number',
        default: 0,
    },
});
function validateSetting(setting) {
    const schema = { glogPerTrx: { type: Number, required: true } };
    return joi_1.default.validate(setting, schema);
}
const Setting = (instance) => mongoose_1.default.model('Setting', settingsSchema, `Setting_${instance}`);
exports.Setting = Setting;
exports.validate = validateSetting;
