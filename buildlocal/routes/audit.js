"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const fsExtra = __importStar(require("fs-extra"));
const util_1 = require("util");
const readFile = util_1.promisify(fs_1.default.readFile);
const writeFile = util_1.promisify(fs_1.default.writeFile);
const multiparty_1 = __importDefault(require("multiparty"));
const auth_1 = __importDefault(require("../middleware/auth"));
const admin_1 = __importDefault(require("../middleware/admin"));
const setting_1 = require("../models/setting");
const other_1 = require("../helper/other");
router.get('/', [auth_1.default, admin_1.default], other_1.asyncRouteHandler(async (req, res) => {
    const { username, instance } = req.user;
    const domain = username.split('.')[0];
    fs_1.default.readdir(path_1.default.join(__dirname, '..', 'csv', instance, domain), async (err, files) => {
        const fileListDetails = [];
        if (err) {
            !fs_1.default.existsSync(path_1.default.join(__dirname, '..', 'csv')) ? fs_1.default.mkdirSync(path_1.default.join(__dirname, '..', 'csv')) : null;
            !fs_1.default.existsSync(path_1.default.join(__dirname, '..', 'csv', instance))
                ? fs_1.default.mkdirSync(path_1.default.join(__dirname, '..', 'csv', instance))
                : null;
            !fs_1.default.existsSync(path_1.default.join(__dirname, '..', 'csv', instance, domain))
                ? fs_1.default.mkdirSync(path_1.default.join(__dirname, '..', 'csv', instance, domain))
                : null;
            return res.status(200).json({ data: { files: [] } });
        }
        for (let index = 0; index < files.length; index++) {
            const file = files[index];
            const fileDetails = file.toString().split('$$$');
            fileListDetails.push({
                id: index + 1,
                uploaduser: fileDetails[0],
                userrole: fileDetails[1],
                uploaddate: fileDetails[2],
                filename: fileDetails[3],
            });
        }
        const setting = await setting_1.Setting(instance).findOne();
        return res.status(200).json({ data: { files: fileListDetails, setting } });
    });
}));
router.post('/', [auth_1.default], other_1.asyncRouteHandler(async (req, res) => {
    const { username, instance } = req.user;
    const domain = username.split('.')[0];
    const form = new multiparty_1.default.Form();
    form.parse(req, function (err, fields, files) {
        const fullFileName = files[Object.keys(files)[0]][0].fieldName;
        if (!fullFileName)
            res.status(400).json('FileName not provided!');
        const filePath = files[Object.keys(files)[0]][0].path;
        if (!fs_1.default.existsSync(path_1.default.join(__dirname, '..', 'csv')))
            fs_1.default.mkdirSync(path_1.default.join(__dirname, '..', 'csv'));
        if (!fs_1.default.existsSync(path_1.default.join(__dirname, '..', 'csv', instance)))
            fs_1.default.mkdirSync(path_1.default.join(__dirname, '..', 'csv', instance));
        if (!fs_1.default.existsSync(path_1.default.join(__dirname, '..', 'csv', instance, domain)))
            fs_1.default.mkdirSync(path_1.default.join(__dirname, '..', 'csv', instance, domain));
        copyTempFile(filePath, path_1.default.join(__dirname, '..', 'csv', instance, domain, fullFileName));
        return res.status(200).json({ data: 'CSV saved to server.' });
    });
}));
router.get('/files', [auth_1.default, admin_1.default], other_1.asyncRouteHandler(async (req, res) => {
    const { username, instance } = req.user;
    const domain = username.split('.')[0];
    const file = req.query.file;
    fs_1.default.exists(path_1.default.join(__dirname, '..', 'csv', instance, domain, file), function (exist) {
        if (!exist)
            return res.status(404).end(`File ${file} not found!`);
        fs_1.default.readFile(path_1.default.join(__dirname, '..', 'csv', instance, domain, file), function (err, data) {
            if (err)
                return res.status(500).end(`Error getting the file: ${err}.`);
            return res.send(data.toString('UTF-8'));
        });
    });
}));
router.delete('/files', [auth_1.default, admin_1.default], async (req, res) => {
    const { username, instance } = req.user;
    const domain = username.split('.')[0];
    const file = req.query.file;
    fs_1.default.exists(path_1.default.join(__dirname, '..', 'csv', instance, domain, file), function (exist) {
        if (!exist)
            return res.status(404).end(`File ${file} not found!`);
        fs_1.default.unlink(path_1.default.join(__dirname, '..', 'csv', instance, domain, file), function (err) {
            if (err)
                return res.status(500).end(`Error deleting the file: ${err}.`);
            return res.send({ data: { success: true } });
        });
    });
});
router.delete('/files/all', [auth_1.default, admin_1.default], async (req, res) => {
    const { username, instance } = req.user;
    const domain = username.split('.')[0];
    fsExtra.exists(path_1.default.join(__dirname, '..', 'csv', instance, domain), function (exist) {
        if (!exist)
            return res.status(404).end(`Files not found!`);
        fsExtra.remove(path_1.default.join(__dirname, '..', 'csv', instance, domain), function (err) {
            if (err)
                return res.status(500).end(`Error deleting the file: ${err}.`);
            return res.send({ data: { success: true } });
        });
    });
});
async function copyTempFile(tempFilePath, desiredOutputPath) {
    const data = await readFile(tempFilePath);
    const csvData = data;
    await writeFile(desiredOutputPath, csvData);
}
exports.default = router;
