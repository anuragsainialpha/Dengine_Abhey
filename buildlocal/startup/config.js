"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const other_1 = require("../helper/other");
function default_1() {
    if (!other_1.CONSTS.JWT_PRIVATE_KEY) {
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
    }
}
exports.default = default_1;
