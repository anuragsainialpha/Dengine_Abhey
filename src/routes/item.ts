import express from 'express';
const router = express.Router();
import { CONSTS as consts, asyncHandler, asyncRouteHandler } from '../helper/other';
import { getItemPropfromGtm } from '../helper/dbXmlQuery';
import { getItemData, getUpdatedProp, getItemSchema } from '../helper/Item/getItemData';
import { dbXml } from '../api/gtm';
import { Item } from '../models/item';
import auth from '../middleware/auth';
import { RequestUser } from '../interfaces/User';
import { generateItemSchema } from './schemaItem';

router.get(
  '/',
  [auth],
  asyncRouteHandler(async (req: RequestUser, res) => {
    const { display } = req.query;
    const { username, password, instance, url } = req.user;
    const domain = getDomainName(username);
    if (display) {
      const item = await getItemDisplayDataFromDb(domain, instance, display);
      if (item.length) return res.status(200).json({ data: item });
    }
    const gtmVersion = getGtmVersion(req);
    let schemaItem = await getItemSchema(gtmVersion);
    if (!schemaItem) schemaItem = await generateItemSchema();
    const { data: gtmData, error } = await asyncHandler(dbXml(url, getItemPropfromGtm, username, password));
    if (error) return res.status(400).send(error);
    const ItemMaster = await getItemData(schemaItem, gtmVersion, gtmData, domain);
    let item = await getItemDataFromDb(domain, instance);
    if (isNull(item)) return res.status(200).json(await createAndSendItemData(domain, instance, ItemMaster));
    item = await getUpdatedProp(ItemMaster, item, instance, domain);
    if (display) return res.status(200).json(getItemDisplayData(item));
    return res.status(200).json({ data: item });
  })
);

router.put(
  '/',
  [auth],
  asyncRouteHandler(async (req: RequestUser, res) => {
    const { instance, username } = req.user;
    const domain = getDomainName(username);
    let { item } = req.body;
    if (!item) return res.status(400).send('Item prop value missing!');
    item = await updateAndGetItemData(item, domain, instance);
    return res.status(200).json({ data: item });
  })
);

async function getItemDisplayDataFromDb(domain: string, instance: string, display) {
  return await Item(domain, instance).find({ display: display }).sort({ _id: 1 });
}

async function updateAndGetItemData(item: any, domain: string, instance: string) {
  item = await Item(domain, instance).findByIdAndUpdate(item._id, item, { new: true });
  return item;
}

async function getItemDataFromDb(domain: string, instance: string) {
  return await Item(domain, instance).find({}).sort({ _id: 1 });
}

function getItemDisplayData(item: any): any {
  return { data: item.filter((d) => d.display) };
}

async function createAndSendItemData(domain: string, instance: string, ItemMaster: unknown) {
  return { data: await Item(domain, instance).insertMany(ItemMaster) };
}

function isNull(item: any) {
  return !item || item.length === 0;
}

function getDomainName(username: string) {
  return username.split('.')[0];
}

function getGtmVersion(req: RequestUser) {
  return req.query.gtmVersion ? +req.query.gtmVersion : +consts.GTMVERSION;
}

export default router;
