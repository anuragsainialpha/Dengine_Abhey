"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("../middleware/auth"));
const express_1 = __importDefault(require("express"));
const other_1 = require("../helper/other");
const router = express_1.default.Router();
router.get('/me', [auth_1.default], other_1.asyncRouteHandler(async (req, res) => {
    const { username, isAdmin, instance, sidebar } = req.user;
    const domain = username.split('.')[0];
    return res.send({ data: { username, domain, isAdmin, instance, sidebar } });
}));
exports.default = router;
