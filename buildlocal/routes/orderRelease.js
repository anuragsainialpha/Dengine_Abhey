"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const other_1 = require("../helper/other");
const dbXmlQuery_1 = require("../helper/dbXmlQuery");
const getReleaseData_1 = require("../helper/Release/getReleaseData");
const gtm_1 = require("../api/gtm");
const release_1 = require("../models/release");
const auth_1 = __importDefault(require("../middleware/auth"));
router.get('/', [auth_1.default], other_1.asyncRouteHandler(async (req, res) => {
    const { display } = req.query;
    const { username, password, instance, url } = req.user;
    const domain = username.split('.')[0];
    if (display) {
        const release = await release_1.Release(domain, instance).find({ display: display }).sort({ _id: 1 });
        if (release.length)
            return res.status(200).json({ data: release });
    }
    const gtmVersion = getGtmVersion(req);
    const schemaRelease = await getReleaseData_1.getReleaseSchema(gtmVersion);
    if (!schemaRelease)
        return res.status(400).send(`gtmVersion:${gtmVersion} schema not available!`);
    const { data: gtmData, error } = await other_1.asyncHandler(gtm_1.dbXml(url, dbXmlQuery_1.getReleasePropsfromGtm, username, password));
    if (error)
        return res.status(400).send(error);
    const Release = await getReleaseData_1.getReleaseData(schemaRelease, gtmVersion, gtmData, domain);
    let release = await release_1.Release(domain, instance).find({}).sort({ _id: 1 });
    if (!release || release.length === 0)
        return res.status(200).json({ data: await release_1.Release(domain, instance).insertMany(Release) });
    release = await getReleaseData_1.getUpdatedProp(Release, release, instance, domain);
    if (display)
        return res.status(200).json({ data: release.filter((d) => d.display) });
    return res.status(200).json({ data: release });
}));
router.put('/', [auth_1.default], other_1.asyncRouteHandler(async (req, res) => {
    let { release } = req.body;
    const { username, instance } = req.user;
    const domain = username.split('.')[0];
    if (!release)
        return res.status(400).send('Release prop value missing!');
    release = await release_1.Release(domain, instance).findByIdAndUpdate(release._id, release, { new: true });
    return res.status(200).json({ data: release });
}));
function getGtmVersion(req) {
    return req.query.gtmVersion ? +req.query.gtmVersion : +other_1.CONSTS.GTMVERSION;
}
exports.default = router;
