"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const mongoose_1 = __importDefault(require("mongoose"));
const other_1 = require("../helper/other");
function default_1() {
    const db = other_1.CONSTS.DB;
    const o = { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true };
    mongoose_1.default.connect(db, o).then(() => winston_1.default.info(`Connected to ${db}...`));
}
exports.default = default_1;
