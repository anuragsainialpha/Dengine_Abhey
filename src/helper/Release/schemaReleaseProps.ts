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
    case path.search('InvolvedParty') !== -1:
      extract(path, Parent, 'InvolvedParty');
      break;
    case path.search('Remark') !== -1:
      extract(path, Parent, 'Remark');
      break;
    case path.search('ItemAttributes') !== -1:
      extract(path, Parent, 'ItemAttributes');
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
  const Release = { Release: {}, ReleaseLine: {} };
  // Filtering parallel child for ItemMaster
  _.keys(flattenJson)
    .map(path => {
      switch (true) {
        case path.search('Release') === -1 || path.search('ReleaseStatus') > -1:
          break;
        case path.search('ReleaseLine') !== -1:
          getChild(path, flattenJson, Release, 'ReleaseLine');
          break;
        default:
          getChild(path, flattenJson, Release, 'Release');
      }
      return Release;
    })
    .filter(el => el !== undefined);
  // returning childs with props
  Release.Release = extractProps(Release.Release);
  Release.ReleaseLine = extractProps(Release.ReleaseLine);
  return { Release };
};

const getChild = (path, flattenJson, Release, child) => {
  Release[`${child}`][`${path}`] = flattenJson[`${path}`];
};

const extract = (path, Parent, child) => {
  let newPath = path;
  let newName = path;
  switch (true) {
    case child === 'Remark':
      newPath = convertPath(path, 'Remark').newPath;
      newName = convertPath(path, 'Remark').newName;
      break;
    case child === 'InvolvedParty':
      newPath = convertPath(path, 'InvolvedParty').newPath;
      newName = convertPath(path, 'InvolvedParty').newName;
      break;
    case child === 'Refnum':
      newPath = convertPath(path, 'Refnum').newPath;
      newName = convertPath(path, 'Refnum').newName;
      break;
    case child === 'ItemAttributes':
      newPath = convertPath(path, 'ItemAttributes').newPath;
      newName = convertPath(path, 'ItemAttributes').newName;
      break;
    default:
      break;
  }

  if (!Parent[`${child}`]) Parent[`${child}`] = [];
  Parent[`${child}`].push({ name: getElementName(newName), path: newPath });
  Parent[`${child}`] = _.uniqBy(Parent[`${child}`], 'name');
};
