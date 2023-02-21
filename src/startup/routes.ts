import bodyParser from 'body-parser';
import auth from '../routes/auth';
import user from '../routes/user';
import transmission from '../routes/transmission';
import release from '../routes/orderRelease';
import error from '../middleware/error';
import schemaItem from '../routes/schemaItem';
import schemaRelease from '../routes/schemaRelease';
import item from '../routes/item';
import location from '../routes/location';
import schemaLocation from '../routes/schemaLocation';
import party from '../routes/party';
import schemaParty from '../routes/schemaParty';
import transaction from '../routes/transaction';
import schemaTransaction from '../routes/schemaTransaction';
import orderbase from '../routes/orderBase';
import schemaOrderBase from '../routes/schemaOrderBase';
import audit from '../routes/audit';
import setting from '../routes/setting';
import trackingEvent from '../routes/trackingEvent';
import schemaTrackingEvent from '../routes/schemaTrackingEvent';
import shipment from '../routes/shipment';
import schemaShipment from '../routes/schemaShipment';
import bom from '../routes/bom';
import schemaBom from '../routes/schemaBom';

export default function(app) {
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.use('/api/auth', auth);
  app.use('/api/user', user);
  app.use('/api/audit', audit);

  // gtm object routes
  app.use('/api/item', item);
  app.use('/api/order-release', release);
  app.use('/api/location', location);
  app.use('/api/party', party);
  app.use('/api/bom', bom);
  app.use('/api/transaction', transaction);
  app.use('/api/order-base', orderbase);
  app.use('/api/tracking-event', trackingEvent);
  app.use('/api/shipment', shipment);

  // gtm object schema routes
  app.use('/api/schema/item', schemaItem);
  app.use('/api/schema/order-release', schemaRelease);
  app.use('/api/schema/location', schemaLocation);
  app.use('/api/schema/party', schemaParty);
  app.use('/api/schema/bom', schemaBom);
  app.use('/api/schema/transaction', schemaTransaction);
  app.use('/api/schema/order-base', schemaOrderBase);
  app.use('/api/schema/tracking-event', schemaTrackingEvent);
  app.use('/api/schema/shipment', schemaShipment);

  app.use('/api/transmission', transmission);
  app.use('/api/settings', setting);
  // Error Handler
  app.use(error);
}
