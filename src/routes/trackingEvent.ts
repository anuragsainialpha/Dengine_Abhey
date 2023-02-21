import express from 'express'
const router = express.Router()
import { CONSTS as consts, asyncHandler, asyncRouteHandler } from '../helper/other'
import { getTrackingEventPropfromOtm } from '../helper/dbXmlQuery'
import { getTrackingEventData, getUpdatedProp, getTrackingEventSchema } from '../helper/TrackingEvent/getTrackingEventData'
import { dbXml } from '../api/gtm'
import { TrackingEvent } from '../models/trackingEvent'
import auth from '../middleware/auth'

router.get(
  '/',
  [auth],
  asyncRouteHandler(async (req, res) => {
    const { display } = req.query
    const { username, password, instance, url } = req.user
    const domain = username.split('.')[0]
    if (display) {
      const trackingEvent = await TrackingEvent(domain, instance)
        .find({ display: display })
        .sort({ _id: 1 })
      if (trackingEvent.length) return res.status(200).json({ data: trackingEvent })
    }
    const gtmVersion = +req.query.gtmVersion || +consts.GTMVERSION
    const schemaTrackingEvent = await getTrackingEventSchema(gtmVersion)
    if (!schemaTrackingEvent) return res.status(400).send(`gtmVersion:${gtmVersion} schema not available!`)
    const { data: gtmData, error } = await asyncHandler(dbXml(url, getTrackingEventPropfromOtm, username, password))
    if (error) return res.status(400).send(error)
    const ShipmentStatus = await getTrackingEventData(schemaTrackingEvent, gtmVersion, gtmData)
    let trackingEvent = await TrackingEvent(domain, instance)
      .find({})
      .sort({ _id: 1 })
    if (!trackingEvent || trackingEvent.length === 0) {
      return res.status(200).json({ data: await TrackingEvent(domain, instance).insertMany(ShipmentStatus) })
    }
    trackingEvent = await getUpdatedProp(ShipmentStatus, trackingEvent, instance, domain)
    if (display) return res.status(200).json({ data: trackingEvent.filter(d => d.display) })
    return res.status(200).json({ data: trackingEvent })
  })
)

router.put(
  '/',
  [auth],
  asyncRouteHandler(async (req, res) => {
    const { instance, username } = req.user
    const domain = username.split('.')[0]
    let { trackingEvent } = req.body
    if (!trackingEvent) return res.status(400).send('Tracking Event prop value missing!')
    trackingEvent = await TrackingEvent(domain, instance).findByIdAndUpdate(trackingEvent._id, trackingEvent, { new: true })
    return res.status(200).json({ data: trackingEvent })
  })
)

export default router
