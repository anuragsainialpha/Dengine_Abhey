"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const other_1 = require("../helper/other");
const dbXmlQuery_1 = require("../helper/dbXmlQuery");
const getItemData_1 = require("../helper/Item/getItemData");
const gtm_1 = require("../api/gtm");
const item_1 = require("../models/item");
const auth_1 = __importDefault(require("../middleware/auth"));
const schemaItem_1 = require("./schemaItem");
router.get('/', [auth_1.default], other_1.asyncRouteHandler(async (req, res) => {
    const { display } = req.query;
    const { username, password, instance, url } = req.user;
    const domain = getDomainName(username);
    if (display) {
        const item = await getItemDisplayDataFromDb(domain, instance, display);
        if (item.length)
            return res.status(200).json({ data: item });
    }
    const gtmVersion = getGtmVersion(req);
    let schemaItem = await getItemData_1.getItemSchema(gtmVersion);
    if (!schemaItem)
        schemaItem = await schemaItem_1.generateItemSchema();
    const { data: gtmData, error } = await other_1.asyncHandler(gtm_1.dbXml(url, dbXmlQuery_1.getItemPropfromGtm, username, password));
    if (error)
        return res.status(400).send(error);
    const ItemMaster = await getItemData_1.getItemData(schemaItem, gtmVersion, gtmData, domain);
    let item = await getItemDataFromDb(domain, instance);
    if (isNull(item))
        return res.status(200).json(await createAndSendItemData(domain, instance, ItemMaster));
    item = await getItemData_1.getUpdatedProp(ItemMaster, item, instance, domain);
    if (display)
        return res.status(200).json(getItemDisplayData(item));
    return res.status(200).json({ data: item });
}));
router.put('/', [auth_1.default], other_1.asyncRouteHandler(async (req, res) => {
    const { instance, username } = req.user;
    const domain = getDomainName(username);
    let { item } = req.body;
    if (!item)
        return res.status(400).send('Item prop value missing!');
    item = await updateAndGetItemData(item, domain, instance);
    return res.status(200).json({ data: item });
}));
async function getItemDisplayDataFromDb(domain, instance, display) {
    return await item_1.Item(domain, instance).find({ display: display }).sort({ _id: 1 });
}
async function updateAndGetItemData(item, domain, instance) {
    item = await item_1.Item(domain, instance).findByIdAndUpdate(item._id, item, { new: true });
    return item;
}
async function getItemDataFromDb(domain, instance) {
    return await item_1.Item(domain, instance).find({}).sort({ _id: 1 });
}
function getItemDisplayData(item) {
    return { data: item.filter((d) => d.display) };
}
async function createAndSendItemData(domain, instance, ItemMaster) {
    return { data: await item_1.Item(domain, instance).insertMany(ItemMaster) };
}
function isNull(item) {
    return !item || item.length === 0;
}
function getDomainName(username) {
    return username.split('.')[0];
}
function getGtmVersion(req) {
    return req.query.gtmVersion ? +req.query.gtmVersion : +other_1.CONSTS.GTMVERSION;
}
exports.default = router;
