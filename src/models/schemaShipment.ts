import mongoose from 'mongoose';

const schemaShipment = new mongoose.Schema({
  xmlNs: {
    type: ['String']
  },
  gtmVersion: {
    type: 'Number'
  },
  ActualShipment: {
    type: 'Mixed'
  }
});

export const SchemaShipment: any = mongoose.model('SchemaShipment', schemaShipment, 'ShipmentSchema');
