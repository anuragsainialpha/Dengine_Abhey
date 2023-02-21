import mongoose from 'mongoose';
const reportSchema = new mongoose.Schema({
  item: {
    type: 'Number',
    default: 0
  },
  party: {
    type: 'Number',
    default: 0
  },
  location: {
    type: 'Number',
    default: 0
  },
  'order-release': {
    type: 'Number',
    default: 0
  },
  'order-base': {
    type: 'Number',
    default: 0
  },
  bom: {
    type: 'Number',
    default: 0
  },
  transaction: {
    type: 'Number',
    default: 0
  },
  'tracking-event': {
    type: 'Number',
    default: 0
  },
  shipment: {
    type: 'Number',
    default: 0
  },
  user: {
    type: 'String',
    required: true
  },
  insertDate: {
    type: Date,
    default: Date.now
  }
});

export const Report: any = instance => mongoose.model('Report', reportSchema, `Report_${instance}`);
