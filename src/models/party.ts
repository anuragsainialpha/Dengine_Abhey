import mongoose from 'mongoose';
const partySchema = new mongoose.Schema({
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

export const Party: any = (domain, instance) => mongoose.model('Party', partySchema, `${domain}_Party_${instance}`);
