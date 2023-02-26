"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
require("express-async-errors");
const { combine, timestamp, label, printf } = winston_1.default.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});
function default_1() {
    winston_1.default.exceptions.handle(new winston_1.default.transports.File({
        filename: 'uncaughtExceptions.log',
        handleExceptions: false,
    }));
    process.on('unhandledRejection', (ex) => {
        throw ex;
    });
    winston_1.default.add(new winston_1.default.transports.File({
        filename: 'logfile.log',
        format: combine(label({ label: 'Dengine' }), timestamp(), myFormat),
    }));
    if (process.env.NODE_ENV !== 'production') {
        winston_1.default.add(new winston_1.default.transports.Console({
            format: winston_1.default.format.simple(),
        }));
    }
}
exports.default = default_1;
