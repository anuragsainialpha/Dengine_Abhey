"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const other_1 = require("../helper/other");
const dbXmlQuery_1 = require("../helper/dbXmlQuery");
const getLocationData_1 = require("../helper/Location/getLocationData");
const gtm_1 = require("../api/gtm");
const location_1 = require("../models/location");
const auth_1 = __importDefault(require("../middleware/auth"));
router.get('/', [auth_1.default], other_1.asyncRouteHandler(async (req, res) => {
    const { display } = req.query;
    const { username, password, instance, url } = req.user;
    const domain = username.split('.')[0];
    if (display) {
        const location = await location_1.Location(domain, instance).find({ display: display }).sort({ _id: 1 });
        if (location.length)
            return res.status(200).json({ data: location });
    }
    const gtmVersion = getGtmVersion(req);
    const schemaLocation = await getLocationData_1.getLocationSchema(gtmVersion);
    if (!schemaLocation)
        return res.status(400).send(`gtmVersion:${gtmVersion} schema not available!`);
    const { data: gtmData, error } = await other_1.asyncHandler(gtm_1.dbXml(url, dbXmlQuery_1.getLocationPropfromOtm, username, password));
    if (error)
        return res.status(400).send(error);
    const Locations = await getLocationData_1.getLocationData(schemaLocation, gtmVersion, gtmData, domain);
    let location = await location_1.Location(domain, instance).find({}).sort({ _id: 1 });
    if (!location || location.length === 0)
        return res.status(200).json({ data: await location_1.Location(domain, instance).insertMany(Locations) });
    location = await getLocationData_1.getUpdatedProp(Locations, location, instance, domain);
    if (display)
        return res.status(200).json({ data: location.filter((d) => d.display) });
    return res.status(200).json({ data: location });
}));
router.put('/', [auth_1.default], other_1.asyncRouteHandler(async (req, res) => {
    let { location } = req.body;
    const { username, instance } = req.user;
    const domain = username.split('.')[0];
    if (!location)
        return res.status(400).send('Location prop value missing!');
    location = await location_1.Location(domain, instance).findByIdAndUpdate(location._id, location, { new: true });
    return res.status(200).json({ data: location });
}));
function getGtmVersion(req) {
    return req.query.gtmVersion ? +req.query.gtmVersion : +other_1.CONSTS.GTMVERSION;
}
exports.default = router;
