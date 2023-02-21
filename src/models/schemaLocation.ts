import mongoose from 'mongoose';

const schemaLocation = new mongoose.Schema({
  xmlNs: {
    type: ['String']
  },
  gtmVersion: {
    type: 'Number'
  },
  Location: {
    type: 'Mixed'
  }
});

export const SchemaLocation: any = mongoose.model('SchemaLocation', schemaLocation, 'LocationSchema');
