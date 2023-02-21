import express from 'express';
import multiparty from 'multiparty';
import xlsx from 'node-xlsx';
import { CONSTS as consts, asyncHandler, getReportUrl, getViewUrl, asyncRouteHandler } from '../helper/other';
import { wmServlet } from '../api/gtm';
import { getTransmissionStatus } from '../helper/dbXmlQuery';
import { dbXml } from '../api/gtm';
import auth from './../middleware/auth';
import { Report } from '../models/report';
import { Setting } from '../models/setting';

const router = express.Router();

interface TransmissionStatus {
  xid: number;
  transmission: string;
  status: string;
  instanceURL: string;
  viewURL: string;
}

router.post(
  '/',
  [auth],
  asyncRouteHandler(async (req, res) => {
    const { username, password, url } = req.user;
    const { xml, xmlNs } = req.body;
    let releaseXML = xml.toString();
    releaseXML = releaseXML.replace(
      '<Transmission>',
      `<Transmission xmlns="${xmlNs[0]}" xmlns:otm="${xmlNs[0]}" xmlns:gtm="${xmlNs[1]}" >`
    );
    const { data, error } = await asyncHandler(wmServlet(url, releaseXML, username, password));
    if (error) return res.status(400).send(error);
    if (!data.includes('ReferenceTransmissionNo')) return res.status(400).send('Invalid csv Data');
    const no = data.match(/ReferenceTransmissionNo>(.*?)</)[1];
    return res.send({ data: { ReferenceTransmissionNo: no } });
  })
);

router.post(
  '/filedata',
  [auth],
  asyncRouteHandler(async (req, res) => {
    const form = new multiparty.Form();
    form.parse(req, async function (err, fields, files) {
      const filePath = files[Object.keys(files)[0]][0].path;
      const data = await xlsx.parse(filePath, { raw: true });
      return res.status(200).send({ data: data[0].data });
    });
  })
);

router.post(
  '/status',
  [auth],
  asyncRouteHandler(async (req, res) => {
    const { username, password, url } = req.user;
    const { transmission, reProcess, xids, considerXid } = req.body;
    if (!transmission.length) return res.status(400).send('Bad request!');
    const transmissionQuery = getTransmissionStatus(transmission, reProcess);
    const { data: gtmData, error } = await asyncHandler(dbXml(url, transmissionQuery, username, password));
    if (error) return res.status(400).send(error);
    const statusResponses = gtmData.match(/TRANSACTION_STATUS(.*?)>/g);
    const mappedStatusArray: TransmissionStatus[] = [];
    let OBJ = '';
    for (let i = 0; i < statusResponses.length; i++) {
      const d = statusResponses[i];
      OBJ = d
        .match(/DATA_QUERY_TYPE_GID="(.*?)"/)[1]
        .toLowerCase()
        .replace('gtm', '')
        .replace('contact', 'party')
        .trim()
        .replace(' ', '-');
      const no = d.match(/I_TRANSACTION_NO="(.*?)"/)[1];
      const objId = d.match(/OBJECT_GID="(.*?)"/)[1];
      const status = d.match(/STATUS="(.*?)"/)[1];
      mappedStatusArray.push({
        xid: !considerXid ? (objId.includes('.') ? objId.split('.')[1] : objId) : xids[i],
        transmission: no,
        status,
        instanceURL: url + getReportUrl(no),
        viewURL: url + getViewUrl(),
      });
    }

    if (!reProcess) {
      const uniqueXids = Array.from(new Set(xids));
      const update = { $inc: { [OBJ]: uniqueXids.length } };
      await Setting(consts.CURRENT_INSTANCE).findOneAndUpdate({ version: +consts.GTMVERSION }, update, { new: true });
      await Report(consts.CURRENT_INSTANCE).create({
        instance: consts.CURRENT_INSTANCE,
        user: username,
        [OBJ]: uniqueXids.length,
      });
    }

    return res.send({ data: mappedStatusArray });
  })
);

export default router;
