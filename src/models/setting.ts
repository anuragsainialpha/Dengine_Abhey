import Joi from 'joi';
import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  url: { type: 'String' },
  version: { type: 'Number' },
  glogPerTrx: {
    type: 'Number',
    default: 10,
  },
  item: {
    type: 'Number',
    default: 0,
  },
  party: {
    type: 'Number',
    default: 0,
  },
  location: {
    type: 'Number',
    default: 0,
  },
  'order-release': {
    type: 'Number',
    default: 0,
  },
  'order-base': {
    type: 'Number',
    default: 0,
  },
  bom: {
    type: 'Number',
    default: 0,
  },
  transaction: {
    type: 'Number',
    default: 0,
  },
  'tracking-event': {
    type: 'Number',
    default: 0,
  },
  shipment: {
    type: 'Number',
    default: 0,
  },
});

function validateSetting(setting) {
  const schema = { glogPerTrx: { type: Number, required: true } };
  return Joi.validate(setting, schema);
}
const Setting: any = (instance) => mongoose.model('Setting', settingsSchema, `Setting_${instance}`);

export { Setting };
export const validate: any = validateSetting;
