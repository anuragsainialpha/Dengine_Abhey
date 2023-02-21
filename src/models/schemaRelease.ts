import mongoose from 'mongoose';

const schemaRelease = new mongoose.Schema({
  xmlNs: {
    type: ['String']
  },
  gtmVersion: {
    type: 'Number'
  },
  Release: {
    type: 'Mixed'
  }
});

export const SchemaRelease: any = mongoose.model('SchemaRelease', schemaRelease, 'OrderReleaseSchema');
