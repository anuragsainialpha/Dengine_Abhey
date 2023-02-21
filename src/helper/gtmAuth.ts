import { dbXml } from '../api/gtm';

export const authDengineUser = async ({ url, username, password }) => {
  const sql = `SELECT NVL((SELECT NVL((SELECT (select ACR_ROLE_GID from GL_USER_ACR_ROLE  WHERE GL_USER_GID = '${username}' AND ACR_ROLE_GID LIKE '%GTM - DATA_UPLOAD_ADMIN' AND ROWNUM=1) GTM_CURRENT_USER_ACL FROM DUAL),(SELECT (select ACR_ROLE_GID from GL_USER_ACR_ROLE  WHERE GL_USER_GID = '${username}' AND ACR_ROLE_GID LIKE '%GTM - DATA_UPLOAD_USER' AND ROWNUM=1)  FROM DUAL))  FROM DUAL ),'NOT_AUTHORISED') GTM_CURRENT_USER_ACL FROM DUAL`;
  const queryXml = `<sql2xml><Query><RootName>GL_USER_ACR_ROLE</RootName><Statement>${sql}</Statement></Query></sql2xml>`;
  return dbXml(url, queryXml, username, password);
};
