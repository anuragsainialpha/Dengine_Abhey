"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const other_1 = require("../helper/other");
const dbXmlQuery_1 = require("../helper/dbXmlQuery");
const getPartyData_1 = require("../helper/Party/getPartyData");
const gtm_1 = require("../api/gtm");
const party_1 = require("../models/party");
const auth_1 = __importDefault(require("../middleware/auth"));
const schemaParty_1 = require("./schemaParty");
router.get('/', [auth_1.default], other_1.asyncRouteHandler(async (req, res) => {
    const { display } = req.query;
    const { username, password, instance, url } = req.user;
    const domain = getDomainName(username);
    if (display) {
        const party = await getPartyDisplayDataFromDb(domain, instance, display);
        if (party.length)
            return res.status(200).json({ data: party });
    }
    const gtmVersion = getGtmVersion(req);
    let schemaParty = await getPartyData_1.getPartySchema(gtmVersion);
    if (!schemaParty)
        schemaParty = await schemaParty_1.generatePartySchema();
    const { data: gtmData, error } = await other_1.asyncHandler(gtm_1.dbXml(url, dbXmlQuery_1.getPartyPropfromGtm, username, password));
    if (error)
        return res.status(400).send(error);
    const GtmContact = await getPartyData_1.getPartyData(schemaParty, gtmVersion, gtmData, domain);
    let party = await getPartyDataFromDb(domain, instance);
    if (isNull(party))
        return res.status(200).json(await createAndSendPartyData(domain, instance, GtmContact));
    party = await getPartyData_1.getUpdatedProp(GtmContact, party, instance, domain);
    if (display)
        return res.status(200).json(getPartyDisplayData(party));
    return res.status(200).json({ data: party });
}));
router.put('/', [auth_1.default], other_1.asyncRouteHandler(async (req, res) => {
    let { party } = req.body;
    const { username, instance } = req.user;
    const domain = getDomainName(username);
    if (!party)
        return res.status(400).send('Party prop value missing!');
    party = await party_1.Party(domain, instance).findByIdAndUpdate(party._id, party, { new: true });
    return res.status(200).json({ data: party });
}));
async function getPartyDisplayDataFromDb(domain, instance, display) {
    return await party_1.Party(domain, instance).find({ display: display }).sort({ _id: 1 });
}
async function getPartyDataFromDb(domain, instance) {
    return await party_1.Party(domain, instance).find({}).sort({ _id: 1 });
}
function getPartyDisplayData(party) {
    return { data: party.filter((d) => d.display) };
}
async function createAndSendPartyData(domain, instance, GtmContact) {
    return { data: await party_1.Party(domain, instance).insertMany(GtmContact) };
}
function isNull(party) {
    return !party || party.length === 0;
}
function getGtmVersion(req) {
    return +req.query.gtmVersion || +other_1.CONSTS.GTMVERSION;
}
function getDomainName(username) {
    return username.split('.')[0];
}
exports.default = router;
