"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const other_1 = require("../helper/other");
const setting_1 = require("../models/setting");
const auth_1 = __importDefault(require("../middleware/auth"));
router.get('/', [auth_1.default], other_1.asyncRouteHandler(async (req, res) => {
    const { instance, url } = req.user;
    let setting = await setting_1.Setting(instance).findOne();
    if (setting)
        return res.status(200).json({ data: setting });
    setting = await setting_1.Setting(instance).create({ url, version: +other_1.CONSTS.GTMVERSION });
    return res.status(200).json({ data: setting });
}));
router.put('/', [auth_1.default], other_1.asyncRouteHandler(async (req, res) => {
    const { instance } = req.user;
    let { setting } = req.body;
    setting = await setting_1.Setting(instance).findByIdAndUpdate(setting._id, setting, { new: true });
    return res.status(200).json({ data: setting });
}));
exports.default = router;
