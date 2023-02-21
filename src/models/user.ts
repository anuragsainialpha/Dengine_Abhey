import jwt from 'jsonwebtoken';
import Joi from 'joi';
import mongoose from 'mongoose';
import { CONSTS } from './../helper/other';

const userSchema = new mongoose.Schema({
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

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, CONSTS.JWT_PRIVATE_KEY);
  return token;
};

const User: any = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = {
    username: Joi.string()
      .min(3)
      .max(30)
      .required(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required()
  };

  return Joi.validate(user, schema);
}

export { User };
export const validate: any = validateUser;
