import { getElementName } from '../renamer';
import _ from 'lodash';
import { convertPath } from '../other';

const extractProps = (flattenJson) => {
  // Creating temp obj to store all props
  const Parent = {};
  _.keys(flattenJson)
    .map((path) => getProps(path, Parent))
    .filter((el) => el !== undefined);
  // returning all props
  return Parent;
};

const getProps = (path, Parent) => {
  // Filtering child Props
  switch (true) {
    case path.search('ItemGid') !== -1:
      extract(path, Parent, 'ItemGid');
      break;
    case path.search('Currency') !== -1:
      extract(path, Parent, 'Currency');
      break;
    case path.search('TransactionCurrency') !== -1:
      extract(path, Parent, 'TransactionCurrency');
      break;
    case path.search('Quantity') !== -1:
      extract(path, Parent, 'Quantity');
      break;
    case path.search('TransactionQuantity') !== -1:
      extract(path, Parent, 'TransactionQuantity');
      break;
    case path.search('TransLineDate') !== -1:
      extract(path, Parent, 'TransLineDate');
      break;
    case path.search('TransDate') !== -1:
      extract(path, Parent, 'TransDate');
      break;
    case path.search('TransactionInvLocation') !== -1:
      extract(path, Parent, 'TransactionInvLocation');
      break;
    case path.search('InvolvedParty') !== -1:
      extract(path, Parent, 'InvolvedParty');
      break;
    case path.search('UserDefinedClassification') !== -1:
      extract(path, Parent, 'UserDefinedClassification');
      break;
    case path.search('PortInfo') !== -1:
      extract(path, Parent, 'PortInfo');
      break;
    case path.search('Remark') !== -1:
      extract(path, Parent, 'Remark');
      break;
    case path.search('Refnum') !== -1:
      extract(path, Parent, 'Refnum');
      break;
    case path.search('Contact') !== -1:
      extract(path, Parent, 'Contact');
      break;
    default:
      extract(path, Parent, 'Header');
  }
  // filtering and storing in temp obj to store all props
  return Parent;
};

export const getChilds = (flattenJson) => {
  const GtmTransaction = { GtmTransaction: {}, GtmTransactionLine: {} };
  // Filtering parallel child for ItemMaster
  _.keys(flattenJson)
    .map((path) => {
      switch (true) {
        case path.search('GtmTransaction') === -1:
          break;
        case path.search('GtmTransactionLine') !== -1:
          getChild(path, flattenJson, GtmTransaction, 'GtmTransactionLine');
          break;
        default:
          getChild(path, flattenJson, GtmTransaction, 'GtmTransaction');
      }
      return GtmTransaction;
    })
    .filter((el) => el !== undefined);
  // returning childs with props
  GtmTransaction.GtmTransaction = extractProps(GtmTransaction.GtmTransaction);
  GtmTransaction.GtmTransactionLine = extractProps(GtmTransaction.GtmTransactionLine);
  return { GtmTransaction };
};

const getChild = (path, flattenJson, GtmTransaction, child) => {
  GtmTransaction[`${child}`][`${path}`] = flattenJson[`${path}`];
};

const extract = (path, Parent, child) => {
  let newPath = path;
  let newName = path;
  switch (true) {
    case child === 'ItemGid':
      newPath = convertPath(path, 'ItemGid').newPath;
      newName = convertPath(path, 'ItemGid').newName;
      break;
    case child === 'Currency':
      newPath = convertPath(path, 'Currency').newPath;
      newName = convertPath(path, 'Currency').newName;
      break;
    case child === 'TransactionCurrency':
      newPath = convertPath(path, 'TransactionCurrency').newPath;
      newName = convertPath(path, 'TransactionCurrency').newName;
      break;
    case child === 'Quantity':
      newPath = convertPath(path, 'Quantity').newPath;
      newName = convertPath(path, 'Quantity').newName;
      break;
    case child === 'TransactionQuantity':
      newPath = convertPath(path, 'TransactionQuantity').newPath;
      newName = convertPath(path, 'TransactionQuantity').newName;
      break;
    case child === 'TransLineDate':
      newPath = convertPath(path, 'TransLineDate').newPath;
      newName = convertPath(path, 'TransLineDate').newName;
      break;
    case child === 'TransDate':
      newPath = convertPath(path, 'TransDate').newPath;
      newName = convertPath(path, 'TransDate').newName;
      break;
    case child === 'TransactionInvLocation':
      newPath = convertPath(path, 'TransactionInvLocation').newPath;
      newName = convertPath(path, 'TransactionInvLocation').newName;
      break;
    case child === 'UserDefinedClassification':
      newPath = convertPath(path, 'UserDefinedClassification').newPath;
      newName = convertPath(path, 'UserDefinedClassification').newName;
      break;
    case child === 'Remark':
      newPath = convertPath(path, 'Remark').newPath;
      newName = convertPath(path, 'Remark').newName;
      break;
    case child === 'PortInfo':
      newPath = convertPath(path, 'PortInfo').newPath;
      newName = convertPath(path, 'PortInfo').newName;
      break;
    case child === 'Refnum':
      newPath = convertPath(path, 'Refnum').newPath;
      newName = convertPath(path, 'Refnum').newName;
      break;
    case child === 'InvolvedParty':
      newPath = convertPath(path, 'InvolvedParty').newPath;
      newName = convertPath(path, 'InvolvedParty').newName;
      break;
    case child === 'Contact':
      newPath = convertPath(path, 'Contact').newPath;
      newName = convertPath(path, 'Contact').newName;
      break;
    default:
      break;
  }

  if (!Parent[`${child}`]) Parent[`${child}`] = [];
  Parent[`${child}`].push({ name: getElementName(newName), path: newPath });
  Parent[`${child}`] = _.uniqBy(Parent[`${child}`], 'name');
};
