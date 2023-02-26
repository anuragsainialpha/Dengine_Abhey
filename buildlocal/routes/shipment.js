"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const other_1 = require("../helper/other");
const dbXmlQuery_1 = require("../helper/dbXmlQuery");
const getShipmentData_1 = require("../helper/Shipment/getShipmentData");
const gtm_1 = require("../api/gtm");
const shipment_1 = require("../models/shipment");
const auth_1 = __importDefault(require("../middleware/auth"));
router.get('/', [auth_1.default], other_1.asyncRouteHandler(async (req, res) => {
    const { display } = req.query;
    const { username, password, instance, url } = req.user;
    const domain = username.split('.')[0];
    if (display) {
        const shipment = await shipment_1.Shipment(domain, instance)
            .find({ display: display })
            .sort({ _id: 1 });
        if (shipment.length)
            return res.status(200).json({ data: shipment });
    }
    const gtmVersion = +req.query.gtmVersion || +other_1.CONSTS.GTMVERSION;
    const schemaShipment = await getShipmentData_1.getShipmentSchema(gtmVersion);
    if (!schemaShipment)
        return res.status(400).send(`gtmVersion:${gtmVersion} schema not available!`);
    const { data: gtmData, error } = await other_1.asyncHandler(gtm_1.dbXml(url, dbXmlQuery_1.getShipmentPropsfromGtm, username, password));
    if (error)
        return res.status(400).send(error);
    const Shipment = await getShipmentData_1.getShipmentData(schemaShipment, gtmVersion, gtmData, domain);
    const shipment = await shipment_1.Shipment(domain, instance)
        .find({})
        .sort({ _id: 1 });
    if (!shipment || shipment.length === 0) {
        return res.status(200).json({ data: await shipment_1.Shipment(domain, instance).insertMany(Shipment) });
    }
    if (display)
        return res.status(200).json({ data: shipment.filter(d => d.display) });
    return res.status(200).json({ data: shipment });
}));
router.put('/', [auth_1.default], other_1.asyncRouteHandler(async (req, res) => {
    let { shipment } = req.body;
    const { username, instance } = req.user;
    const domain = username.split('.')[0];
    if (!shipment)
        return res.status(400).send('Shipment prop value missing!');
    shipment = await shipment_1.Shipment(domain, instance).findByIdAndUpdate(shipment._id, shipment, { new: true });
    return res.status(200).json({ data: shipment });
}));
exports.default = router;
