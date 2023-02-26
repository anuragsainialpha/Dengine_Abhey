"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const curl = __importStar(require("curlrequest"));
exports.wmServlet = (baseURL, query, username, password) => {
    const uriParam = '/GC3/glog.integration.servlet.WMServlet';
    const auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
    const options = {
        url: baseURL + uriParam,
        retries: 30,
        data: query,
        headers: { 'content-type': 'text/xml', Authorization: auth },
    };
    return new Promise((resolve, reject) => {
        const response = { data: '', error: '' };
        curl.request(options, function (err, data) {
            if (err) {
                response.error = err;
                reject(response);
            }
            else {
                response.data = data;
                resolve(response);
            }
        });
    });
};
exports.dbXml = (baseURL, query, username, password) => {
    const uriParam = '/GC3/glog.integration.servlet.DBXMLServlet?command=xmlExport';
    const auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
    const options = {
        url: baseURL + uriParam,
        retries: 30,
        data: query,
        headers: { 'content-type': 'text/xml', Authorization: auth },
    };
    return new Promise((resolve, reject) => {
        const response = { data: '', error: '' };
        curl.request(options, function (err, data) {
            if (err) {
                response.error = err;
                reject(response);
            }
            else {
                response.data = data;
                resolve(response);
            }
        });
    });
};
