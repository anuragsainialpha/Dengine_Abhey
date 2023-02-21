import mongoose from 'mongoose';
const trackingEventSchema = new mongoose.Schema({
  name: String,
  required: Boolean,
  disabled: Boolean,
  display: Boolean,
  isMandatory: Boolean,
  type: String,
  displayText: String,
  defaultValue: String,
  gtmVersion: Number,
  xmlNs: ['String'],
  path: ['Mixed'],
});

export const TrackingEvent: any = (domain, instance) =>
  mongoose.model('TrackingEvent', trackingEventSchema, `${domain}_TrackingEvent_${instance}`);
