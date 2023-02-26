"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multiparty_1 = __importDefault(require("multiparty"));
const node_xlsx_1 = __importDefault(require("node-xlsx"));
const other_1 = require("../helper/other");
const gtm_1 = require("../api/gtm");
const dbXmlQuery_1 = require("../helper/dbXmlQuery");
const gtm_2 = require("../api/gtm");
const auth_1 = __importDefault(require("./../middleware/auth"));
const report_1 = require("../models/report");
const setting_1 = require("../models/setting");
const router = express_1.default.Router();
router.post('/', [auth_1.default], other_1.asyncRouteHandler(async (req, res) => {
    const { username, password, url } = req.user;
    const { xml, xmlNs } = req.body;
    let releaseXML = xml.toString();
    releaseXML = releaseXML.replace('<Transmission>', `<Transmission xmlns="${xmlNs[0]}" xmlns:otm="${xmlNs[0]}" xmlns:gtm="${xmlNs[1]}" >`);
    const { data, error } = await other_1.asyncHandler(gtm_1.wmServlet(url, releaseXML, username, password));
    if (error)
        return res.status(400).send(error);
    if (!data.includes('ReferenceTransmissionNo'))
        return res.status(400).send('Invalid csv Data');
    const no = data.match(/ReferenceTransmissionNo>(.*?)</)[1];
    return res.send({ data: { ReferenceTransmissionNo: no } });
}));
router.post('/filedata', [auth_1.default], other_1.asyncRouteHandler(async (req, res) => {
    const form = new multiparty_1.default.Form();
    form.parse(req, async function (err, fields, files) {
        const filePath = files[Object.keys(files)[0]][0].path;
        const data = await node_xlsx_1.default.parse(filePath, { raw: true });
        return res.status(200).send({ data: data[0].data });
    });
}));
router.post('/status', [auth_1.default], other_1.asyncRouteHandler(async (req, res) => {
    const { username, password, url } = req.user;
    const { transmission, reProcess, xids, considerXid } = req.body;
    if (!transmission.length)
        return res.status(400).send('Bad request!');
    const transmissionQuery = dbXmlQuery_1.getTransmissionStatus(transmission, reProcess);
    const { data: gtmData, error } = await other_1.asyncHandler(gtm_2.dbXml(url, transmissionQuery, username, password));
    if (error)
        return res.status(400).send(error);
    const statusResponses = gtmData.match(/TRANSACTION_STATUS(.*?)>/g);
    const mappedStatusArray = [];
    let OBJ = '';
    for (let i = 0; i < statusResponses.length; i++) {
        const d = statusResponses[i];
        OBJ = d
            .match(/DATA_QUERY_TYPE_GID="(.*?)"/)[1]
            .toLowerCase()
            .replace('gtm', '')
            .replace('contact', 'party')
            .trim()
            .replace(' ', '-');
        const no = d.match(/I_TRANSACTION_NO="(.*?)"/)[1];
        const objId = d.match(/OBJECT_GID="(.*?)"/)[1];
        const status = d.match(/STATUS="(.*?)"/)[1];
        mappedStatusArray.push({
            xid: !considerXid ? (objId.includes('.') ? objId.split('.')[1] : objId) : xids[i],
            transmission: no,
            status,
            instanceURL: url + other_1.getReportUrl(no),
            viewURL: url + other_1.getViewUrl(),
        });
    }
    if (!reProcess) {
        const uniqueXids = Array.from(new Set(xids));
        const update = { $inc: { [OBJ]: uniqueXids.length } };
        await setting_1.Setting(other_1.CONSTS.CURRENT_INSTANCE).findOneAndUpdate({ version: +other_1.CONSTS.GTMVERSION }, update, { new: true });
        await report_1.Report(other_1.CONSTS.CURRENT_INSTANCE).create({
            instance: other_1.CONSTS.CURRENT_INSTANCE,
            user: username,
            [OBJ]: uniqueXids.length,
        });
    }
    return res.send({ data: mappedStatusArray });
}));
exports.default = router;
