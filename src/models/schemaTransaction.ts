import mongoose from 'mongoose';

const schemaTransaction = new mongoose.Schema({
  xmlNs: {
    type: ['String']
  },
  gtmVersion: {
    type: 'Number'
  },
  GtmTransaction: {
    type: 'Mixed'
  }
});

export const SchemaTransaction: any = mongoose.model('SchemaTransaction', schemaTransaction, 'TransactionSchema');
