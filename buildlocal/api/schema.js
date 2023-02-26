"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const other_1 = require("../helper/other");
exports.default = axios_1.default.create({
    baseURL: other_1.CONSTS.SCHEMA_URI
});
