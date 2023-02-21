import _ from 'lodash';
import promiseMemoize from 'promise-memoize';
import { Item } from '../../models/item';
import { SchemaItem } from '../../models/schemaItem';
import { mapHeader, mapRemark, mapRefnum, mapItemFeature, mapItemClassification, mapItemDescription } from './itemProps';

function _getItemData(schemaItem, gtmVersion, gtmData?, domain?) {
  return new Promise(function (resolve) {
    let {
      Header: IHeader,
      Remark: IRemark,
      Refnum: IRefnum,
      GtmItemClassification: IClass,
      GtmItemDescription: IDesc,
      ItemFeature: IFeature,
    } = schemaItem.ItemMaster.Item;
    const xmlNs = schemaItem.xmlNs;

    IHeader = getHeaders(IHeader, gtmVersion, xmlNs, domain);
    IRemark = getRemarks(gtmData, IRemark, gtmVersion, xmlNs, domain);
    IRefnum = getRefnums(gtmData, IRefnum, gtmVersion, xmlNs, domain);
    IFeature = getfeatures(gtmData, IFeature, gtmVersion, xmlNs, domain);
    IClass = getClassifications(gtmData, IClass, gtmVersion, xmlNs, domain);
    IDesc = getDescriptions(gtmData, IDesc, gtmVersion, xmlNs, domain);

    resolve(_.uniqBy([...IHeader, ...IRemark, ...IRefnum, ...IFeature, ...IClass, ...IDesc], filterByName()));
  });
}

function filterByName(): _.ValueIteratee<any> {
  return (e) => e.name;
}

function getDescriptions(gtmData: any, GtmItemDescription: any, gtmVersion: any, xmlNs: any, domain: any) {
  const itemDescription = gtmData.match(/GTMITEMDESCRIPTIONS="(.*?)"/)[1].split(',');
  GtmItemDescription = itemDescription.map(getMappedItemDesc(GtmItemDescription, gtmVersion, xmlNs, domain));
  return GtmItemDescription;
}

function getClassifications(gtmData: any, GtmItemClassification: any, gtmVersion: any, xmlNs: any, domain: any) {
  const itemClassification = gtmData.match(/GTMITEMCLASSIFICATIONS="(.*?)"/)[1].split(',');
  GtmItemClassification = itemClassification.map(getMappedItemClass(GtmItemClassification, gtmVersion, xmlNs, domain));
  return GtmItemClassification;
}

function getMappedItemDesc(GtmItemDescription: any, gtmVersion: any, xmlNs: any, domain: any): any {
  return (e, i) => mapItemDescription(e, GtmItemDescription, 'Item : Description', gtmVersion, xmlNs, i, domain);
}

function getMappedItemClass(GtmItemClassification: any, gtmVersion: any, xmlNs: any, domain: any): any {
  return (e, i) => mapItemClassification(e, GtmItemClassification, 'Item : Classification', gtmVersion, xmlNs, i, domain);
}

function getfeatures(gtmData: any, ItemFeature: any, gtmVersion: any, xmlNs: any, domain: any) {
  const itemFeatures = gtmData.match(/ITEMFEATURES="(.*?)"/)[1].split(',');
  ItemFeature = itemFeatures.map((e, i) => mapItemFeature(e, ItemFeature, 'Item : Feature', gtmVersion, xmlNs, i, domain));
  return ItemFeature;
}

function getRefnums(gtmData: any, Refnum: any, gtmVersion: any, xmlNs: any, domain: any) {
  const refnumQuals = gtmData.match(/REFNUMS="(.*?)"/)[1].split(',');
  Refnum = refnumQuals.map((e, i) => mapRefnum(e, Refnum, 'Item : Refnum', gtmVersion, xmlNs, i, domain));
  return Refnum;
}

function getRemarks(gtmData: any, Remark: any, gtmVersion: any, xmlNs: any, domain: any) {
  const remarkQuals = gtmData.match(/REMARKS="(.*?)"/)[1].split(',');
  Remark = remarkQuals.map((e, i) => mapRemark(e, Remark, 'Item : Remark', gtmVersion, xmlNs, i, domain));
  return Remark;
}

function getHeaders(ItemHeader: any, gtmVersion: any, xmlNs: any, domain: any) {
  ItemHeader = ItemHeader.map((e) => mapHeader(e, 'Item : Header', gtmVersion, xmlNs, domain));
  return ItemHeader;
}

function _getUpdatedProp(ItemMaster, item, instance?, domain?) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async function (resolve) {
    const newPropAddedinGtm = _.differenceWith(ItemMaster, item, (a: any, b: any) => a.name === b.name);
    const newPropRemovedinGtm = _.differenceWith(item, ItemMaster, (a: any, b: any) => a.name === b.name);
    if (newPropAddedinGtm.length > 0) {
      const nitem = await Item(domain, instance).insertMany(newPropAddedinGtm);
      resolve([...item, ...nitem]);
    } else if (newPropRemovedinGtm.length > 0) {
      await Item(domain, instance).deleteMany({ _id: { $in: [...newPropRemovedinGtm.map((d) => d._id)] } });
      resolve(_.differenceWith(item, newPropRemovedinGtm, (a: any, b: any) => a.name === b.name));
    } else resolve(item);
  });
}

function _getItemSchema(gtmVersion) {
  return SchemaItem.findOne({ gtmVersion: gtmVersion }).sort({ _id: 1 });
}

export const getItemSchema = promiseMemoize(_getItemSchema, { maxAge: 60000 });
export const getItemData = promiseMemoize(_getItemData, { maxAge: 60000 });
export const getUpdatedProp = promiseMemoize(_getUpdatedProp, { maxAge: 60000 });
