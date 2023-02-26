"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const other_1 = require("../helper/other");
const dbXmlQuery_1 = require("../helper/dbXmlQuery");
const getBomData_1 = require("../helper/Bom/getBomData");
const gtm_1 = require("../api/gtm");
const bom_1 = require("../models/bom");
const auth_1 = __importDefault(require("../middleware/auth"));
const schemaBom_1 = require("./schemaBom");
router.get('/', [auth_1.default], other_1.asyncRouteHandler(async (req, res) => {
    const { display } = req.query;
    const { username, password, instance, url } = req.user;
    const domain = username.split('.')[0];
    if (display) {
        const bom = await bom_1.Bom(domain, instance).find({ display: display }).sort({ _id: 1 });
        if (bom.length)
            return res.status(200).json({ data: bom });
    }
    const gtmVersion = getGtmVersion(req);
    let schemaBom = await getBomData_1.getBomSchema(gtmVersion);
    if (!schemaBom) {
        schemaBom = await schemaBom_1.generateBomSchema();
    }
    const { data: gtmData, error } = await other_1.asyncHandler(gtm_1.dbXml(url, dbXmlQuery_1.getBomPropsfromGtm, username, password));
    if (error)
        return res.status(400).send(error);
    const Boms = await getBomData_1.getBomData(schemaBom, gtmVersion, gtmData, domain);
    let bom = await bom_1.Bom(domain, instance).find({}).sort({ _id: 1 });
    if (!bom || bom.length === 0)
        return res.status(200).json({ data: await bom_1.Bom(domain, instance).insertMany(Boms) });
    bom = await getBomData_1.getUpdatedProp(Boms, bom, instance, domain);
    if (display)
        return res.status(200).json({ data: bom.filter((d) => d.display) });
    return res.status(200).json({ data: bom });
}));
router.put('/', [auth_1.default], other_1.asyncRouteHandler(async (req, res) => {
    let { bom } = req.body;
    const { username, instance } = req.user;
    const domain = username.split('.')[0];
    if (!bom)
        return res.status(400).send('Bom prop value missing!');
    bom = await bom_1.Bom(domain, instance).findByIdAndUpdate(bom._id, bom, { new: true });
    return res.status(200).json({ data: bom });
}));
function getGtmVersion(req) {
    return req.query.gtmVersion ? +req.query.gtmVersion : +other_1.CONSTS.GTMVERSION;
}
exports.default = router;
