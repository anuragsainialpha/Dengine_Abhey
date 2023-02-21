import express from 'express';
const router = express.Router();
import { CONSTS as consts, asyncHandler, asyncRouteHandler } from '../helper/other';
import { getShipmentPropsfromGtm } from '../helper/dbXmlQuery';
import { getShipmentData, getShipmentSchema } from '../helper/Shipment/getShipmentData';
import { dbXml } from '../api/gtm';
import { Shipment as ShipmentModel } from '../models/shipment';
import auth from '../middleware/auth';

router.get(
  '/',
  [auth],
  asyncRouteHandler(async (req, res) => {
    const { display } = req.query;
    const { username, password, instance, url } = req.user;
    const domain = username.split('.')[0];
    if (display) {
      const shipment = await ShipmentModel(domain, instance)
        .find({ display: display })
        .sort({ _id: 1 });
      if (shipment.length) return res.status(200).json({ data: shipment });
    }
    const gtmVersion = +req.query.gtmVersion || +consts.GTMVERSION;
    const schemaShipment = await getShipmentSchema(gtmVersion);
    if (!schemaShipment) return res.status(400).send(`gtmVersion:${gtmVersion} schema not available!`);
    const { data: gtmData, error } = await asyncHandler(dbXml(url, getShipmentPropsfromGtm, username, password));
    if (error) return res.status(400).send(error);

    const Shipment = await getShipmentData(schemaShipment, gtmVersion, gtmData, domain);
    const shipment = await ShipmentModel(domain, instance)
      .find({})
      .sort({ _id: 1 });
    if (!shipment || shipment.length === 0) {
      return res.status(200).json({ data: await ShipmentModel(domain, instance).insertMany(Shipment) });
    }
    // orderBase = await getUpdatedProp(OrderBase, orderBase, instance,domain);
    if (display) return res.status(200).json({ data: shipment.filter(d => d.display) });
    return res.status(200).json({ data: shipment });
  })
);

router.put(
  '/',
  [auth],
  asyncRouteHandler(async (req, res) => {
    let { shipment } = req.body;
    const { username, instance } = req.user;
    const domain = username.split('.')[0];
    if (!shipment) return res.status(400).send('Shipment prop value missing!');
    shipment = await ShipmentModel(domain, instance).findByIdAndUpdate(shipment._id, shipment, { new: true });
    return res.status(200).json({ data: shipment });
  })
);

export default router;
