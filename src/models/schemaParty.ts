import mongoose from 'mongoose';

const schemaParty = new mongoose.Schema({
  xmlNs: {
    type: ['String']
  },
  gtmVersion: {
    type: 'Number'
  },
  GtmContact: {
    type: 'Mixed'
  }
});

export const SchemaParty: any = mongoose.model('SchemaParty', schemaParty, 'PartySchema');
