"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gtm_1 = require("../api/gtm");
exports.authDengineUser = async ({ url, username, password }) => {
    const sql = `SELECT NVL((SELECT NVL((SELECT (select ACR_ROLE_GID from GL_USER_ACR_ROLE  WHERE GL_USER_GID = '${username}' AND ACR_ROLE_GID LIKE '%GTM - DATA_UPLOAD_ADMIN' AND ROWNUM=1) GTM_CURRENT_USER_ACL FROM DUAL),(SELECT (select ACR_ROLE_GID from GL_USER_ACR_ROLE  WHERE GL_USER_GID = '${username}' AND ACR_ROLE_GID LIKE '%GTM - DATA_UPLOAD_USER' AND ROWNUM=1)  FROM DUAL))  FROM DUAL ),'NOT_AUTHORISED') GTM_CURRENT_USER_ACL FROM DUAL`;
    const queryXml = `<sql2xml><Query><RootName>GL_USER_ACR_ROLE</RootName><Statement>${sql}</Statement></Query></sql2xml>`;
    return gtm_1.dbXml(url, queryXml, username, password);
};
