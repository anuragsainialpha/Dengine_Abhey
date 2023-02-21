import express from 'express';
const router = express.Router();
import fs from 'fs';
import path from 'path';
import * as fsExtra from 'fs-extra';
import { promisify } from 'util';
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
import multiparty from 'multiparty';
import auth from '../middleware/auth';
import admin from '../middleware/admin';
import { Setting } from '../models/setting';
import { RequestUser } from '../interfaces/User';
import { asyncRouteHandler } from '../helper/other';
import { FileDetail } from '../interfaces/FileDetails';

router.get(
  '/',
  [auth, admin],
  asyncRouteHandler(async (req: RequestUser, res) => {
    const { username, instance } = req.user;
    const domain = username.split('.')[0];
    fs.readdir(path.join(__dirname, '..', 'csv', instance, domain), async (err, files) => {
      const fileListDetails: FileDetail[] = [];
      if (err) {
        !fs.existsSync(path.join(__dirname, '..', 'csv')) ? fs.mkdirSync(path.join(__dirname, '..', 'csv')) : null;
        !fs.existsSync(path.join(__dirname, '..', 'csv', instance))
          ? fs.mkdirSync(path.join(__dirname, '..', 'csv', instance))
          : null;
        !fs.existsSync(path.join(__dirname, '..', 'csv', instance, domain))
          ? fs.mkdirSync(path.join(__dirname, '..', 'csv', instance, domain))
          : null;
        return res.status(200).json({ data: { files: [] } });
      }
      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        const fileDetails = file.toString().split('$$$');
        fileListDetails.push({
          id: index + 1,
          uploaduser: fileDetails[0],
          userrole: fileDetails[1],
          uploaddate: fileDetails[2],
          filename: fileDetails[3],
        });
      }
      const setting = await Setting(instance).findOne();
      return res.status(200).json({ data: { files: fileListDetails, setting } });
    });
  })
);

router.post(
  '/',
  [auth],
  asyncRouteHandler(async (req: RequestUser, res) => {
    const { username, instance } = req.user;
    const domain = username.split('.')[0];
    const form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
      const fullFileName = files[Object.keys(files)[0]][0].fieldName;
      if (!fullFileName) res.status(400).json('FileName not provided!');
      const filePath = files[Object.keys(files)[0]][0].path;
      if (!fs.existsSync(path.join(__dirname, '..', 'csv'))) fs.mkdirSync(path.join(__dirname, '..', 'csv'));
      if (!fs.existsSync(path.join(__dirname, '..', 'csv', instance)))
        fs.mkdirSync(path.join(__dirname, '..', 'csv', instance));
      if (!fs.existsSync(path.join(__dirname, '..', 'csv', instance, domain)))
        fs.mkdirSync(path.join(__dirname, '..', 'csv', instance, domain));
      copyTempFile(filePath, path.join(__dirname, '..', 'csv', instance, domain, fullFileName));
      return res.status(200).json({ data: 'CSV saved to server.' });
    });
  })
);

router.get(
  '/files',
  [auth, admin],
  asyncRouteHandler(async (req: RequestUser, res) => {
    const { username, instance } = req.user;
    const domain = username.split('.')[0];
    const file: string = req.query.file as string;
    fs.exists(path.join(__dirname, '..', 'csv', instance, domain, file), function (exist) {
      if (!exist) return res.status(404).end(`File ${file} not found!`);

      fs.readFile(path.join(__dirname, '..', 'csv', instance, domain, file), function (err, data) {
        if (err) return res.status(500).end(`Error getting the file: ${err}.`);
        return res.send(data.toString('UTF-8'));
      });
    });
  })
);

router.delete('/files', [auth, admin], async (req: RequestUser, res) => {
  const { username, instance } = req.user;
  const domain = username.split('.')[0];
  const file: string = req.query.file as string;

  fs.exists(path.join(__dirname, '..', 'csv', instance, domain, file), function (exist) {
    if (!exist) return res.status(404).end(`File ${file} not found!`);
    fs.unlink(path.join(__dirname, '..', 'csv', instance, domain, file), function (err) {
      if (err) return res.status(500).end(`Error deleting the file: ${err}.`);
      return res.send({ data: { success: true } });
    });
  });
});

router.delete('/files/all', [auth, admin], async (req: RequestUser, res) => {
  const { username, instance } = req.user;
  const domain = username.split('.')[0];

  fsExtra.exists(path.join(__dirname, '..', 'csv', instance, domain), function (exist) {
    if (!exist) return res.status(404).end(`Files not found!`);
    fsExtra.remove(path.join(__dirname, '..', 'csv', instance, domain), function (err) {
      if (err) return res.status(500).end(`Error deleting the file: ${err}.`);
      return res.send({ data: { success: true } });
    });
  });
});

async function copyTempFile(tempFilePath, desiredOutputPath) {
  const data = await readFile(tempFilePath);
  const csvData = data;
  await writeFile(desiredOutputPath, csvData);
}

export default router;
