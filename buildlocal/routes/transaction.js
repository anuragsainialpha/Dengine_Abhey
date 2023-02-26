"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const other_1 = require("../helper/other");
const dbXmlQuery_1 = require("../helper/dbXmlQuery");
const getTransactionData_1 = require("../helper/Transaction/getTransactionData");
const gtm_1 = require("../api/gtm");
const transaction_1 = require("../models/transaction");
const auth_1 = __importDefault(require("../middleware/auth"));
const schemaTransaction_1 = require("./schemaTransaction");
router.get('/', [auth_1.default], other_1.asyncRouteHandler(async (req, res) => {
    const { display } = req.query;
    const { username, password, instance, url } = req.user;
    const domain = getDomainName(username);
    if (display) {
        const transaction = await getTrxDisplayDataFromDb(domain, instance, display);
        if (transaction.length)
            return res.status(200).json({ data: transaction });
    }
    const gtmVersion = getGtmVersion(req);
    let schemaTransaction = await getTransactionData_1.getTransactionSchema(gtmVersion);
    if (!schemaTransaction)
        schemaTransaction = await schemaTransaction_1.generateTrxSchema();
    const { data: gtmData, error } = await other_1.asyncHandler(gtm_1.dbXml(url, dbXmlQuery_1.getTransactionPropsfromGtm, username, password));
    if (error)
        return res.status(400).send(error);
    const GtmTransaction = await getTransactionData_1.getTransactionData(schemaTransaction, gtmVersion, gtmData, domain);
    let transaction = await getTrxDataFromDb(domain, instance);
    if (isNull(transaction))
        return res.status(200).json(await createAndSendTrxData(domain, instance, GtmTransaction));
    transaction = await getTransactionData_1.getUpdatedProp(GtmTransaction, transaction, instance, domain);
    if (display)
        return res.status(200).json(getTrxDisplayData(transaction));
    return res.status(200).json({ data: transaction });
}));
router.put('/', [auth_1.default], other_1.asyncRouteHandler(async (req, res) => {
    let { transaction } = req.body;
    const { username, instance } = req.user;
    const domain = getDomainName(username);
    if (!transaction)
        return res.status(400).send('Transaction prop value missing!');
    transaction = await updateAndGetTrxData(transaction, domain, instance);
    return res.status(200).json({ data: transaction });
}));
async function getTrxDisplayDataFromDb(domain, instance, display) {
    return await transaction_1.Transaction(domain, instance).find({ display: display }).sort({ _id: 1 });
}
async function updateAndGetTrxData(transaction, domain, instance) {
    transaction = await transaction_1.Transaction(domain, instance).findByIdAndUpdate(transaction._id, transaction, {
        new: true,
    });
    return transaction;
}
async function getTrxDataFromDb(domain, instance) {
    return await transaction_1.Transaction(domain, instance).find({}).sort({ _id: 1 });
}
function getTrxDisplayData(transaction) {
    return { data: transaction.filter((d) => d.display) };
}
async function createAndSendTrxData(domain, instance, GtmTransaction) {
    return { data: await transaction_1.Transaction(domain, instance).insertMany(GtmTransaction) };
}
function isNull(transaction) {
    return !transaction || transaction.length === 0;
}
function getGtmVersion(req) {
    return +req.query.gtmVersion || +other_1.CONSTS.GTMVERSION;
}
function getDomainName(username) {
    return username.split('.')[0];
}
exports.default = router;
