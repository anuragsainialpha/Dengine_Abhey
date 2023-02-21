import mongoose from 'mongoose';
const bomSchema = new mongoose.Schema({
  name: {
    type: 'String'
  },
  required: {
    type: 'Boolean'
  },
  disabled: {
    type: 'Boolean'
  },
  display: {
    type: 'Boolean'
  },
  type: {
    type: 'String'
  },
  displayText: {
    type: 'String'
  },
  defaultValue: {
    type: 'String'
  },
  path: {
    type: ['Mixed']
  },
  xmlNs: {
    type: ['String']
  },
  gtmVersion: {
    type: 'Number'
  }
});

export const Bom: any = (domain, instance) => mongoose.model('Bom', bomSchema, `${domain}_Bom_${instance}`);
