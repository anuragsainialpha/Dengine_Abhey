"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const other_1 = require("../helper/other");
const dbXmlQuery_1 = require("../helper/dbXmlQuery");
const getOrderBaseData_1 = require("../helper/OrderBase/getOrderBaseData");
const gtm_1 = require("../api/gtm");
const orderBase_1 = require("../models/orderBase");
const auth_1 = __importDefault(require("../middleware/auth"));
router.get('/', [auth_1.default], other_1.asyncRouteHandler(async (req, res) => {
    const { display } = req.query;
    const { username, password, instance, url } = req.user;
    const domain = username.split('.')[0];
    if (display) {
        const orderBase = await orderBase_1.OrderBase(domain, instance).find({ display: display }).sort({ _id: 1 });
        if (orderBase.length)
            return res.status(200).json({ data: orderBase });
    }
    const gtmVersion = getGtmVersion(req);
    const schemaOrderBase = await getOrderBaseData_1.getOrderBaseSchema(gtmVersion);
    if (!schemaOrderBase)
        return res.status(400).send(`gtmVersion:${gtmVersion} schema not available!`);
    const { data: gtmData, error } = await other_1.asyncHandler(gtm_1.dbXml(url, dbXmlQuery_1.getOrderBasePropsfromGtm, username, password));
    if (error)
        return res.status(400).send(error);
    const OrderBase = await getOrderBaseData_1.getOrderBaseData(schemaOrderBase, gtmVersion, gtmData, domain);
    const orderBase = await orderBase_1.OrderBase(domain, instance).find({}).sort({ _id: 1 });
    if (!orderBase || orderBase.length === 0) {
        return res.status(200).json({ data: await orderBase_1.OrderBase(domain, instance).insertMany(OrderBase) });
    }
    if (display)
        return res.status(200).json({ data: orderBase.filter((d) => d.display) });
    return res.status(200).json({ data: orderBase });
}));
router.put('/', [auth_1.default], other_1.asyncRouteHandler(async (req, res) => {
    let { orderBase } = req.body;
    const { username, instance } = req.user;
    const domain = username.split('.')[0];
    if (!orderBase)
        return res.status(400).send('OrderBase prop value missing!');
    orderBase = await orderBase_1.OrderBase(domain, instance).findByIdAndUpdate(orderBase._id, orderBase, { new: true });
    return res.status(200).json({ data: orderBase });
}));
function getGtmVersion(req) {
    return req.query.gtmVersion ? +req.query.gtmVersion : +other_1.CONSTS.GTMVERSION;
}
exports.default = router;
