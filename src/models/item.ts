import mongoose from 'mongoose';
const itemSchema = new mongoose.Schema({
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

export const Item: any = (domain, instance) => mongoose.model('Item', itemSchema, `${domain}_Item_${instance}`);
