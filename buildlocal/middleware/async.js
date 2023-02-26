"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(handler) {
    return async (req, res, next) => {
        try {
            await handler(req, res);
        }
        catch (ex) {
            next(ex);
        }
    };
}
exports.default = default_1;
