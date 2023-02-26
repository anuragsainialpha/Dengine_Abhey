"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const other_1 = require("./../helper/other");
const encrypt_1 = require("./../helper/encrypt");
const express_1 = __importDefault(require("express"));
const gtmAuth_1 = require("../helper/gtmAuth");
const router = express_1.default.Router();
router.post('/', other_1.asyncRouteHandler(async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    let { username, password, instance } = req.body;
    if (!instance)
        instance = other_1.CONSTS.CURRENT_INSTANCE;
    const auth = { username, password, url: getInstanceURL(instance) };
    const { data, error: gtmError } = await other_1.asyncHandler(gtmAuth_1.authDengineUser(auth));
    if (data.includes('Unauthorized'))
        return res.status(403).send("Sorry, you don't have access!");
    if (gtmError)
        return res.status(500).send(gtmError);
    if (data.toString().includes('error'))
        return res.status(500).send(data.match('<error>(.*)</error>')[1]);
    const userRole = data.match('GTM - DATA_UPLOAD_(.*)"')[1].trim();
    if (userRole !== 'ADMIN' && userRole !== 'USER')
        return res.status(403).send("Sorry, you don't have access!");
    const isAdmin = userRole === 'ADMIN';
    const crypto = encrypt_1.encrypt(password);
    const sidebar = other_1.getSidebar(isAdmin).filter(d => other_1.CONSTS.SUBSCIPTION.includes(d.name
        .trim()
        .toLowerCase()
        .replace(' ', '-')));
    const domain = username.split('.')[0];
    const token = other_1.generateAuthToken({ username, domain, isAdmin, crypto, instance, sidebar });
    return res.send({ data: token });
}));
function validate(req) {
    const schema = {
        username: joi_1.default.string()
            .min(1)
            .max(30)
            .required(),
        password: joi_1.default.string()
            .min(1)
            .max(255)
            .required()
    };
    return joi_1.default.validate(req, schema);
}
const getInstanceURL = instance => {
    if (instance === 'dev')
        return other_1.CONSTS.DEV_INSTANCEURL;
    if (instance === 'test')
        return other_1.CONSTS.TEST_INSTANCEURL;
    if (instance === 'prod')
        return other_1.CONSTS.PROD_INSTANCEURL;
};
exports.default = router;
