"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importDefault(require("mongoose"));
const other_1 = require("./../helper/other");
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    isAdmin: Boolean
});
userSchema.methods.generateAuthToken = function () {
    const token = jsonwebtoken_1.default.sign({ _id: this._id, isAdmin: this.isAdmin }, other_1.CONSTS.JWT_PRIVATE_KEY);
    return token;
};
const User = mongoose_1.default.model('User', userSchema);
exports.User = User;
function validateUser(user) {
    const schema = {
        username: joi_1.default.string()
            .min(3)
            .max(30)
            .required(),
        password: joi_1.default.string()
            .min(5)
            .max(255)
            .required()
    };
    return joi_1.default.validate(user, schema);
}
exports.validate = validateUser;
