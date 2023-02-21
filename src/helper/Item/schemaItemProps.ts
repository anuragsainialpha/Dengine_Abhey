import { getElementName } from '../renamer';
import _ from 'lodash';
import { convertPath } from '../other';

const extractProps = flattenJson => {
  // Creating temp obj to store all props
  const Parent = {};
  _.keys(flattenJson)
    .map(path => getProps(path, Parent))
    .filter(el => el !== undefined);
  // returning all props
  return Parent;
};

const getProps = (path, Parent) => {
  // Filtering child Props
  switch (true) {
    case path.search('Remark') !== -1:
      extract(path, Parent, 'Remark');
      break;
    case path.search('ItemFeature') !== -1:
      extract(path, Parent, 'ItemFeature');
      break;
    case path.search('GtmItemClassification') !== -1:
      extract(path, Parent, 'GtmItemClassification');
      break;
    case path.search('GtmItemDescription') !== -1:
      extract(path, Parent, 'GtmItemDescription');
      break;
    case path.search('GtmItemCountryOfOrigin') !== -1:
      extract(path, Parent, 'GtmItemCountryOfOrigin');
      break;
    case path.search('GtmItemUomConversion') !== -1:
      extract(path, Parent, 'GtmItemUomConversion');
      break;
    case path.search('Refnum') !== -1:
      extract(path, Parent, 'Refnum');
      break;
    case path.search('PricePerUnit') !== -1:
      extract(path, Parent, 'PricePerUnit');
      break;

    default:
      extract(path, Parent, 'Header');
  }

  // filtering and storing in temp obj to store all props
  return Parent;
};

export const getChilds = flattenJson => {
  const ItemMaster = { Item: {}, Packaging: {} };
  // Filtering parallel child for ItemMaster
  _.keys(flattenJson)
    .map(path => {
      switch (true) {
        case path.search('ItemMaster') === -1:
          break;
        case path.search('Packaging') !== -1:
          getChild(path, flattenJson, ItemMaster, 'Packaging');
          break;
        default:
          getChild(path, flattenJson, ItemMaster, 'Item');
      }
      return ItemMaster;
    })
    .filter(el => el !== undefined);
  // returning childs with props
  ItemMaster.Item = extractProps(ItemMaster.Item);
  ItemMaster.Packaging = extractProps(ItemMaster.Packaging);
  return { ItemMaster };
};

const getChild = (path, flattenJson, ItemMaster, child) => {
  ItemMaster[`${child}`][`${path}`] = flattenJson[`${path}`];
};

const extract = (path, Parent, child) => {
  let newPath = path;
  let newName = path;
  switch (true) {
    case child === 'Remark':
      newPath = convertPath(path, 'Remark').newPath;
      newName = convertPath(path, 'Remark').newName;
      break;
    case child === 'Refnum':
      newPath = convertPath(path, 'Refnum').newPath;
      newName = convertPath(path, 'Refnum').newName;
      break;
    case child === 'ItemFeature':
      newPath = convertPath(path, 'ItemFeature').newPath;
      newName = convertPath(path, 'ItemFeature').newName;
      break;
    case child === 'GtmItemClassification':
      newPath = convertPath(path, 'GtmItemClassification').newPath;
      newName = convertPath(path, 'GtmItemClassification').newName;
      break;
    case child === 'GtmItemDescription':
      newPath = convertPath(path, 'GtmItemDescription').newPath;
      newName = convertPath(path, 'GtmItemDescription').newName;
      break;
    case child === 'GtmItemCountryOfOrigin':
      newPath = convertPath(path, 'GtmItemCountryOfOrigin').newPath;
      newName = convertPath(path, 'GtmItemCountryOfOrigin').newName;
      break;
    case child === 'GtmItemUomConversion':
      newPath = convertPath(path, 'GtmItemUomConversion').newPath;
      newName = convertPath(path, 'GtmItemUomConversion').newName;
      break;
    default:
      break;
  }

  if (!Parent[`${child}`]) Parent[`${child}`] = [];
  Parent[`${child}`].push({ name: getElementName(newName), path: newPath });
  Parent[`${child}`] = _.uniqBy(Parent[`${child}`], 'name');
};
