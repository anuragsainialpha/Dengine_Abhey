import mongoose from 'mongoose';

const schemaTrackingEvent = new mongoose.Schema({
  xmlNs: {
    type: ['String']
  },
  gtmVersion: {
    type: 'Number'
  },
  ShipmentStatus: {
    type: 'Mixed'
  }
});

export const SchemaTrackingEvent: any = mongoose.model('SchemaTrackingEvent', schemaTrackingEvent, 'TrackingEventSchema');
