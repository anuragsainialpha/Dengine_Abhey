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
  const Bom: any = { Bom: {}, BomComponent: {} };
  // const Bom: any = { Boms: {}, Contact: {}, ServiceProvider: {} };

  // Filtering parallel child for Gtm Structure
  _.keys(flattenJson)
    .map(path => {
      switch (true) {
        case path.search('GtmStructure') === -1:
          break;
        case path.search('GtmStructureComponent') !== -1:
          getChild(path, flattenJson, Bom, 'BomComponent');
          break;
        default:
          getChild(path, flattenJson, Bom, 'Bom');
      }
      return Bom;
    })
    .filter(el => el !== undefined);

  // returning childs with props
  Bom.Bom = extractProps(Bom.Bom);
  Bom.BomComponent = extractProps(Bom.BomComponent);
  return { Bom };

};

const getChild = (path, flattenJson, Bom, child) => {
  Bom[`${child}`][`${path}`] = flattenJson[`${path}`];
};

const extract = (path, Parent, child) => {
  let newPath = path;
  let newName = path;
  switch (true) {
    case child === 'InvolvedParty':
      newPath = convertPath(path, 'InvolvedParty').newPath;
      newName = convertPath(path, 'InvolvedParty').newName;
      break;
    case child === 'Remark':
      newPath = convertPath(path, 'Remark').newPath;
      newName = convertPath(path, 'Remark').newName;
      break;
    case child === 'Refnum':
      newPath = convertPath(path, 'Refnum').newPath;
      newName = convertPath(path, 'Refnum').newName;
      break;
  }

  if (!Parent[`${child}`]) Parent[`${child}`] = [];
  Parent[`${child}`].push({ name: getElementName(newName), path: newPath });
  Parent[`${child}`] = _.uniqBy(Parent[`${child}`], 'name');
};
