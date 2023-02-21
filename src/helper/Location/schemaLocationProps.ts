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
    case path.search('AddressLines') !== -1:
      extract(path, Parent, 'AddressLines');
      break;

    default:
      extract(path, Parent, 'Header');
  }

  // filtering and storing in temp obj to store all props
  return Parent;
};

export const getChilds = flattenJson => {
  const Location: any = { Locations: {}, Contact: {}, ServiceProvider: {} };
  // Filtering parallel child for ItemMaster
  _.keys(flattenJson)
    .map(path => {
      switch (true) {
        case path.search('Location') === -1:
          break;
        case path.search('Contact') !== -1:
          getChild(path, flattenJson, Location, 'Contact');
          break;
        case path.search('ServiceProvider') !== -1:
          getChild(path, flattenJson, Location, 'ServiceProvider');
          break;
        default:
          getChild(path, flattenJson, Location, 'Locations');
      }
      return Location;
    })
    .filter(el => el !== undefined);
  // returning childs with props
  Location.Locations = extractProps(Location.Locations);
  Location.Contact = extractProps(Location.Contact);
  Location.ServiceProvider = extractProps(Location.ServiceProvider);
  Location.Locations.Contact = { ...Location.Contact };
  Location.Locations.ServiceProvider = { ...Location.ServiceProvider };

  return { Location: Location.Locations };
};

const getChild = (path, flattenJson, Location, child) => {
  Location[`${child}`][`${path}`] = flattenJson[`${path}`];
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
    case child === 'AddressLines':
      newPath = convertPath(path, 'AddressLines').newPath;
      newName = convertPath(path, 'AddressLines').newName;
      break;
  }

  if (!Parent[`${child}`]) Parent[`${child}`] = [];
  Parent[`${child}`].push({ name: getElementName(newName), path: newPath });
  Parent[`${child}`] = _.uniqBy(Parent[`${child}`], 'name');
};
