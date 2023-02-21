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
    case path.search('Refnum') !== -1:
      extract(path, Parent, 'Refnum');
      break;
    // case path.search('ShipmentStop') !== -1:
    //   extract(path, Parent, 'ShipmentStop');
    //   break;
    default:
      extract(path, Parent, 'Header');
  }
  // filtering and storing in temp obj to store all props
  return Parent;
};

export const getChilds = flattenJson => {
  const ActualShipment: any = { Shipment: {}, ShipmentStop: {}, ShipUnit: {} };
  //   const ActualShipment = { OrderBase: {}, OrderBaseLine: {} };
  // Filtering parallel child for TransOrder
  _.keys(flattenJson)
    .map(path => {
      switch (true) {
        case path.search('ActualShipment') === -1:
          break;
        case path.search('ShipmentStop') !== -1:
          getChild(path, flattenJson, ActualShipment, 'ShipmentStop');
          break;
        case path.search('ShipUnit') !== -1:
          getChild(path, flattenJson, ActualShipment, 'ShipUnit');
          break;
        default:
          getChild(path, flattenJson, ActualShipment, 'Shipment');
      }
      return ActualShipment;
    })
    .filter(el => el !== undefined);
  // returning childs with props
  ActualShipment.Shipment = extractProps(ActualShipment.Shipment);
  ActualShipment.ShipmentStop = extractProps(ActualShipment.ShipmentStop);
  ActualShipment.ShipUnit = extractProps(ActualShipment.ShipUnit);
  ActualShipment.Shipment.ShipmentStop = { ...ActualShipment.ShipmentStop };
  ActualShipment.Shipment.ShipUnit = { ...ActualShipment.ShipUnit };
  return { ActualShipment };
  // return { ActualShipment:ActualShipment.Shipment} ;
};

const getChild = (path, flattenJson, ActualShipment, child) => {
  ActualShipment[`${child}`][`${path}`] = flattenJson[`${path}`];
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
    default:
      break;
  }

  if (!Parent[`${child}`]) Parent[`${child}`] = [];
  Parent[`${child}`].push({ name: getElementName(newName), path: newPath });
  Parent[`${child}`] = _.uniqBy(Parent[`${child}`], 'name');
};
