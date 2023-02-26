"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
function default_1(req, res, next) {
    if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id))
        return res.status(404).send('Invalid ID.');
    next();
}
exports.default = default_1;
