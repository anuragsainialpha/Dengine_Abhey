import mongoose from 'mongoose';
const orderBaseSchema = new mongoose.Schema({
  name: String,
  required: Boolean,
  disabled: Boolean,
  display: Boolean,
  isMandatory: Boolean,
  type: String,
  displayText: String,
  defaultValue: String,
  gtmVersion: Number,
  xmlNs: ['String'],
  path: ['Mixed'],
});

export const OrderBase: any = (domain, instance) => mongoose.model('OrderBase', orderBaseSchema, `${domain}_OrderBase_${instance}`);
