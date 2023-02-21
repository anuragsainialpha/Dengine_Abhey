import mongoose from 'mongoose';
const shipmentSchema = new mongoose.Schema({
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

export const Shipment: any = (domain, instance) => mongoose.model('Shipment', shipmentSchema, `${domain}_Shipment_${instance}`);
