import _ from 'lodash';
import promiseMemoize from 'promise-memoize';
import { OrderBase as OrderBaseModel } from '../../models/orderBase';
import { SchemaOrderBase } from '../../models/schemaOrderBase';
import { mapHeader, mapRemark, mapRefnum } from './orderBaseProps';

function _getOrderBaseData(schemaOrderBase, gtmVersion, gtmData?, domain?) {
  return new Promise(function(resolve) {
    let {
      Header: OrderBaseHeader,
      Remark: OrderBaseRemark,
      Refnum: OrderBaseRefnum
      // InvolvedParty: OrderBaseInvolvedParty,
    } = schemaOrderBase.TransOrder.OrderBase;
    let {
      Header: LineHeader,
      Remark: LineRemark,
      Refnum: LineRefnum
      // InvolvedParty: LineInvolvedParty,
    } = schemaOrderBase.TransOrder.OrderBaseLine;
    const xmlNs = schemaOrderBase.xmlNs;
    OrderBaseHeader = OrderBaseHeader.map(e => mapHeader(e, 'Order Base : Header', gtmVersion, xmlNs, domain));
    LineHeader = LineHeader.map(e => mapHeader(e, 'Order Base Line : Header', gtmVersion, xmlNs, domain));
    const remarkQuals = gtmData.match(/REMARKS="(.*?)"/)[1].split(',');
    OrderBaseRemark = remarkQuals.map((e, i) => mapRemark(e, OrderBaseRemark, 'Order Base : Remark', gtmVersion, xmlNs, i, '', domain));
    LineRemark = remarkQuals.map((e, i) => mapRemark(e, LineRemark, 'Order Base Line : Remark', gtmVersion, xmlNs, i, 'Line', domain));
   
    const RefnumQuals = gtmData.match(/REFNUMS="(.*?)"/)[1].split(',');
    OrderBaseRefnum = RefnumQuals.map((e, i) => mapRefnum(e, OrderBaseRefnum, 'Order Base : Refnum', gtmVersion, xmlNs, i, '', domain));
    const LineRefnumQuals = gtmData.match(/LINE_REFNUMS="(.*?)"/)[1].split(',');
    LineRefnum = LineRefnumQuals.map((e, i) => mapRefnum(e, LineRefnum, 'Order Base Line : Refnum', gtmVersion, xmlNs, i, 'Line', domain));

 // const invPartyQuals = gtmData.match(/INVOLVED_PARTY="(.*?)"/)[1].split(",");
    // OrderBaseInvolvedParty = invPartyQuals.map((e, i) =>
    //   mapInvolvedParty(e, OrderBaseInvolvedParty, "Order Base : Involved Party", gtmVersion, xmlNs, i, "", domain),
    // );
    // LineInvolvedParty = invPartyQuals.map((e, i) =>
    //   mapInvolvedParty(e, LineInvolvedParty, "Order Base Line : Involved Party", gtmVersion, xmlNs, i, "Line", domain),
    // );

    resolve(
      _.uniqBy(
        [
          ...OrderBaseHeader,
          ...OrderBaseRemark,
          ...OrderBaseRefnum,
          // ...OrderBaseInvolvedParty,
          ...LineHeader,
          ...LineRemark,
          ...LineRefnum
          // ...LineInvolvedParty,
        ],
        e => e.name
      )
    );
  });
}

function _getUpdatedProp(TransOrder, orderBase, instance?, domain?) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async function(resolve) {
    const newPropAddedinGtm = _.differenceWith(TransOrder, orderBase, (a: any, b: any) => a.name === b.name);
    const newPropRemovedinGtm = _.differenceWith(orderBase, TransOrder, (a: any, b: any) => a.name === b.name);
    if (newPropAddedinGtm.length > 0) {
      const norderBase = await OrderBaseModel(domain, instance).insertMany(newPropAddedinGtm);
      resolve([...orderBase, ...norderBase]);
    } else if (newPropRemovedinGtm.length > 0) {
      await OrderBaseModel(domain, instance).deleteMany({ _id: { $in: [...newPropRemovedinGtm.map(d => d._id)] } });
      resolve(_.differenceWith(orderBase, newPropRemovedinGtm, (a: any, b: any) => a.name === b.name));
    } else resolve(orderBase);
  });
}

function _getOrderBaseSchema(gtmVersion) {
  return SchemaOrderBase.findOne({ gtmVersion: gtmVersion }).sort({ _id: 1 });
}

export const getOrderBaseSchema = promiseMemoize(_getOrderBaseSchema, { maxAge: 60000 });
export const getOrderBaseData = promiseMemoize(_getOrderBaseData, { maxAge: 60000 });
export const getUpdatedProp = promiseMemoize(_getUpdatedProp, { maxAge: 60000 });
