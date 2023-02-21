import mongoose from 'mongoose';

const schemaOrderBase = new mongoose.Schema({
  xmlNs: {
    type: ['String']
  },
  gtmVersion: {
    type: 'Number'
  },
  TransOrder: {
    type: 'Mixed'
  }
});

export const SchemaOrderBase: any = mongoose.model('SchemaOrderBase', schemaOrderBase, 'OrderBaseSchema');
