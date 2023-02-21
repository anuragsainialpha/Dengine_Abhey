import winston from 'winston';
import mongoose from 'mongoose';
import { CONSTS as consts } from '../helper/other';

export default function () {
  const db: string = consts.DB;
  const o = { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true };
  mongoose.connect(db, o).then(() => winston.info(`Connected to ${db}...`));
}
