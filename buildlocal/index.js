"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const startup_1 = __importDefault(require("./startup"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const app = express_1.default();
app.use(cors_1.default());
app.use(body_parser_1.default.json());
startup_1.default(app);
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.get('*', (req, res) => {
    return res.sendFile(path_1.default.join(__dirname, 'public', 'index.html'));
});
const port = process.env.PORT || 5000;
const server = app.listen(port, listenerCallback());
function listenerCallback() {
    return () => winston_1.default.info(`Listening on port ${port}...`);
}
exports.default = server;
exports.ROOT_DIR = __dirname;
