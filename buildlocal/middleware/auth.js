"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const other_1 = require("../helper/other");
const encrypt_1 = require("../helper/encrypt");
async function default_1(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token)
        return res.status(401).send('Access denied. No token provided.');
    const route = req.baseUrl.split('/');
    if (!other_1.CONSTS.SUBSCIPTION.includes(route[route.length - 1]))
        return res.status(401).send("Sorry, you don't have access.");
    try {
        const decoded = jsonwebtoken_1.default.verify(token, other_1.CONSTS.JWT_PRIVATE_KEY);
        req.user = decoded;
        req.user.url = getInstanceURL(decoded);
        if (req.user.crypto)
            req.user.password = encrypt_1.decrypt(decoded.crypto).toString();
        next();
    }
    catch (ex) {
        res.status(400).send('Invalid token.');
    }
}
exports.default = default_1;
const getInstanceURL = decoded => {
    const { instance } = decoded;
    if (instance === 'test')
        return other_1.CONSTS.TEST_INSTANCEURL;
    if (instance === 'prod')
        return other_1.CONSTS.PROD_INSTANCEURL;
    return other_1.CONSTS.DEV_INSTANCEURL;
};
