import mongoose from 'mongoose';

const schemaItem = new mongoose.Schema({
  xmlNs: {
    type: ['String']
  },
  gtmVersion: {
    type: 'Number'
  },
  ItemMaster: {
    type: 'Mixed'
  }
});

export const SchemaItem: any = mongoose.model('SchemaItem', schemaItem, 'ItemSchema');
