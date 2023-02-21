import mongoose from 'mongoose';
const locationSchema = new mongoose.Schema({
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

export const Location: any = (domain, instance) => mongoose.model('Location', locationSchema, `${domain}_Location_${instance}`);
