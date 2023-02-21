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
    case path.search('Refnum') !== -1:
      extract(path, Parent, 'Refnum');
      break;

    default:
      extract(path, Parent, 'Header');
  }

  // filtering and storing in temp obj to store all props
  return Parent;
};

export const getChilds = flattenJson => {
  const ShipmentStatus = { ShipmentStatus: {} };
  // Filtering parallel child for ShipmentStatus
  _.keys(flattenJson)
    .map(path => {
      switch (true) {
        case path.search('ShipmentStatus') === -1:
          break;

        default:
          getChild(path, flattenJson, ShipmentStatus, 'ShipmentStatus');
      }
      return ShipmentStatus;
    })
    .filter(el => el !== undefined);
  // returning childs with props
  ShipmentStatus.ShipmentStatus = extractProps(ShipmentStatus.ShipmentStatus);
  return { ShipmentStatus: ShipmentStatus.ShipmentStatus };
};

const getChild = (path, flattenJson, ShipmentStatus, child) => {
  ShipmentStatus[`${child}`][`${path}`] = flattenJson[`${path}`];
};

const extract = (path, Parent, child) => {
  let newPath = path;
  let newName = path;
  switch (true) {
    case child === 'Refnum':
      newPath = convertPath(path, 'Refnum').newPath;
      newName = convertPath(path, 'Refnum').newName;
      break;
    default:
      break;
  }

  if (!Parent[`${child}`]) Parent[`${child}`] = [];
  Parent[`${child}`].push({ name: getElementName(newName), path: newPath });
  Parent[`${child}`] = _.uniqBy(Parent[`${child}`], 'name');
};
