import mongoose from 'mongoose';

const schemaBom = new mongoose.Schema({
  xmlNs: {
    type: ['String']
  },
  gtmVersion: {
    type: 'Number'
  },
  Bom: {
    type: 'Mixed'
  }
});

export const SchemaBom: any = mongoose.model('SchemaBom', schemaBom, 'BomSchema');
