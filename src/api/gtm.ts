import * as curl from 'curlrequest';
import { AsyncResult } from '../interfaces/AsynResult';

export const wmServlet: any = (baseURL, query, username, password) => {
  const uriParam = '/GC3/glog.integration.servlet.WMServlet';
  const auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
  const options = {
    url: baseURL + uriParam,
    retries: 30,
    data: query,
    headers: { 'content-type': 'text/xml', Authorization: auth },
  };
  return new Promise((resolve, reject) => {
    const response: AsyncResult = { data: '', error: '' };
    curl.request(options, function (err, data) {
      if (err) {
        response.error = err;
        reject(response);
      } else {
        response.data = data;
        resolve(response);
      }
    });
  });
};

export const dbXml: any = (baseURL, query, username, password?) => {
  const uriParam = '/GC3/glog.integration.servlet.DBXMLServlet?command=xmlExport';
  const auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
  const options = {
    url: baseURL + uriParam,
    retries: 30,
    data: query,
    headers: { 'content-type': 'text/xml', Authorization: auth },
  };
  return new Promise((resolve, reject) => {
    const response: AsyncResult = { data: '', error: '' };
    curl.request(options, function (err, data) {
      if (err) {
        response.error = err;
        reject(response);
      } else {
        response.data = data;
        resolve(response);
      }
    });
  });
};
