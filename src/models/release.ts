import mongoose from 'mongoose';
const releaseSchema = new mongoose.Schema({
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

export const Release: any = (domain, instance) => mongoose.model('Release', releaseSchema, `${domain}_Release_${instance}`);
