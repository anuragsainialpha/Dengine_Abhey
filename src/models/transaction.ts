import mongoose from 'mongoose';
const transactionSchema = new mongoose.Schema({
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

export const Transaction: any = (domain, instance) => mongoose.model('Transaction', transactionSchema, `${domain}_Transaction_${instance}`);
