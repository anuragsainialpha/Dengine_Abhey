/// <reference lib="webworker" />

import { WebWorkerInput } from './model/WebWorkerInput';

const autoGenFields = ['TransactionCode', 'DomainName'];

const csvDataToObject = (
  fileData,
  dragdropList,
  containLines,
  parentGidIdentifierPathString,
  lineIdentifierPathString
) => {
  const csvHeaderPaths = [];
  const _csvHeader = fileData[0];
  const csvHeader = getUniqueCsvHeaders(fileData, dragdropList);
  const csvRow = fileData.slice(1, fileData.length);
  const response = { data: [], error: [], csvHeader: [], csvRow: [] };
  if (!csvRow.length) return emptyCsvError(response, _csvHeader);
  getCsvHeaderPaths(csvHeader, dragdropList, csvHeaderPaths, response);
  if (response.error.length) return invalidCsvHeaderError(response, _csvHeader, csvRow);
  const objectPaths = getObjectPaths(csvRow, csvHeader, csvHeaderPaths, response, dragdropList);
  if (response.error.length) return otherErrors(response, _csvHeader, csvRow);
  getLinesMerged(
    containLines,
    objectPaths,
    parentGidIdentifierPathString,
    lineIdentifierPathString,
    response,
    _csvHeader,
    csvRow
  );
  return response;
};

addEventListener('message', async (msg) => {
  const {
    fileData,
    dragdropList,
    containLines,
    parentGidIdentifierPathString,
    lineIdentifierPathString,
  } = msg.data as WebWorkerInput;
  const result = csvDataToObject(
    fileData,
    dragdropList,
    containLines,
    parentGidIdentifierPathString,
    lineIdentifierPathString
  );
  postMessage({
    result: result.data,
    error: result.error,
    csvHeader: result.csvHeader,
    csvRow: result.csvRow,
  });
});

function otherErrors(
  response: { data: any[]; error: any[]; csvHeader: any[]; csvRow: any[] },
  _csvHeader: any,
  csvRow: any
) {
  response[`csvHeader`] = _csvHeader;
  response[`csvRow`] = csvRow;
  return response;
}

function invalidCsvHeaderError(
  response: { data: any[]; error: any[]; csvHeader: any[]; csvRow: any[] },
  _csvHeader: any,
  csvRow: any
) {
  response[`csvHeader`] = _csvHeader;
  response[`csvRow`] = csvRow;
  return response;
}

function emptyCsvError(response: { data: any[]; error: any[]; csvHeader: any[]; csvRow: any[] }, _csvHeader: any) {
  response.error.push(`csv must contain data`);
  response[`csvHeader`] = _csvHeader;
  return response;
}

function getLinesMerged(
  containLines: any,
  objectPaths: any[],
  parentGidIdentifierPathString: any,
  lineIdentifierPathString: any,
  response: { data: any[]; error: any[]; csvHeader: any[]; csvRow: any[] },
  _csvHeader: any,
  csvRow: any
) {
  if (containLines && objectPaths.length > 1) {
    loopAndMergeLines(objectPaths, parentGidIdentifierPathString, lineIdentifierPathString, response);
  } else {
    response[`data`] = objectPaths;
  }
  response[`csvHeader`] = _csvHeader;
  response[`csvRow`] = csvRow;
}

function loopAndMergeLines(
  objectPaths: any[],
  parentGidIdentifierPathString: any,
  lineIdentifierPathString: any,
  response: { data: any[]; error: any[]; csvHeader: any[]; csvRow: any[] }
) {
  const multiLineObject = [];
  const singleLineObject = [];
  const lineMergedObject = {};
  let lineCounter = 1;
  for (const transmission of objectPaths) {
    let index = 0;
    const xidIndex = Object.keys(transmission).findIndex(
      (d) => d.includes(parentGidIdentifierPathString) && d.includes('Xid')
    );
    const currentXID = transmission[`${Object.keys(transmission)[xidIndex]}`];
    const nextXID = objectPaths[index + xidIndex][`${Object.keys(objectPaths[index])[xidIndex]}`];
    if (currentXID === nextXID) {
      for (let i = 0; i < Object.keys(transmission).length; i++) {
        const path = Object.keys(transmission)[i];
        getLineMergedObject(path, lineIdentifierPathString, lineMergedObject, lineCounter, transmission);
      }
    } else {
      lineCounter = 1;
      singleLineObject.push(transmission);
    }
    index += 1;
    lineCounter += 1;
  }
  multiLineObject.push(lineMergedObject);
  response[`data`] = [...multiLineObject, ...singleLineObject];
}

function getLineMergedObject(
  path: string,
  lineIdentifierPathString: any,
  lineMergedObject: {},
  lineCounter: number,
  transmission: any
) {
  if (path.includes(lineIdentifierPathString + '.')) {
    lineMergedObject[
      `${path.replace(lineIdentifierPathString + '.', lineIdentifierPathString + '.' + lineCounter + '.')}`
    ] = transmission[`${path}`];
  } else {
    lineMergedObject[`${path}`] = transmission[`${path}`];
  }
}

function getObjectPaths(
  csvRow: any,
  csvHeader: unknown[],
  csvHeaderPaths: any[],
  response: { data: any[]; error: any[]; csvHeader: any[]; csvRow: any[] },
  dragdropList: any
) {
  const objectPaths = [];
  for (let rowIndex = 0; rowIndex < csvRow.length; rowIndex++) {
    const pathCollector = {};
    for (let csvHeaderCounter = 0; csvHeaderCounter < csvHeader.length; csvHeaderCounter++) {
      const row = csvRow[rowIndex];
      const cellValue = row[csvHeaderCounter];
      if (cellValue && csvHeaderPaths[csvHeaderCounter].length > 1) {
        getOtherPropsFields(csvHeaderPaths, csvHeaderCounter, csvHeader, cellValue, response, rowIndex, pathCollector);
      } else if (cellValue) {
        pathCollector[csvHeaderPaths[csvHeaderCounter]] = cellValue;
      } else {
        getDefaultAndMandatoryFields(dragdropList, csvHeaderPaths, csvHeaderCounter, pathCollector, response, rowIndex);
      }
    }
    objectPaths.push(pathCollector);
  }
  return objectPaths;
}

function getOtherPropsFields(
  csvHeaderPaths: any[],
  csvHeaderCounter: number,
  csvHeader: unknown[],
  cellValue: any,
  response: { data: any[]; error: any[]; csvHeader: any[]; csvRow: any[] },
  rowIndex: number,
  pathCollector: {}
) {
  const propPaths = csvHeaderPaths[csvHeaderCounter];
  propPaths.forEach((propPath, indice) => {
    if (indice === 0) {
      getValidatedValue(csvHeader, csvHeaderCounter, cellValue, response, rowIndex, pathCollector, propPath);
    } else {
      if (propPath.value !== 'PUBLIC') {
        pathCollector[`${propPath.path}`] = propPath.value;
      }
    }
  });
}

function getDefaultAndMandatoryFields(
  dragdropList: any,
  csvHeaderPaths: any[],
  csvHeaderCounter: number,
  pathCollector: {},
  response: { data: any[]; error: any[]; csvHeader: any[]; csvRow: any[] },
  rowIndex: number
) {
  const autoField = dragdropList.find((d) => d.path === csvHeaderPaths[csvHeaderCounter]);
  if (autoField && autoField.defaultValue) {
    pathCollector[csvHeaderPaths[csvHeaderCounter]] = autoField.defaultValue;
  } else if (autoField.disabled) {
    response.error.push(`${autoField.displayText} is missing at row  ${rowIndex}`);
  }
}

function getUniqueCsvHeaders(fileData: any, dragdropList: any) {
  return Array.from(
    new Set(
      fileData[0].concat(
        dragdropList
          .filter((d) => autoGenFields.find((a) => d.name.includes(a)) || d.disabled)
          .map((e) => e.displayText)
      )
    )
  );
}

function getCsvHeaderPaths(
  csvHeader: unknown[],
  dragdropList: any,
  csvHeaderPaths: any[],
  response: { data: any[]; error: any[]; csvHeader: any[]; csvRow: any[] }
) {
  for (let index = 0; index < csvHeader.length; index++) {
    const d = csvHeader[index];
    const CSVHeaderIndex = dragdropList.findIndex((el) => el.displayText === d);
    if (CSVHeaderIndex > -1) {
      csvHeaderPaths.push(dragdropList[CSVHeaderIndex].path);
    } else {
      response.error.push(`Column ${d} not allowed`);
    }
  }
}

function getValidatedValue(
  csvHeader: unknown[],
  csvHeaderCounter: number,
  cellValue: any,
  response: { data: any[]; error: any[]; csvHeader: any[]; csvRow: any[] },
  rowIndex: number,
  pathCollector: {},
  propPath: any
) {
  if (String(csvHeader[csvHeaderCounter]).includes('YYYY-MM-DD') && !isValidDate(cellValue)) {
    response.error.push(`${cellValue} value for ${csvHeader[csvHeaderCounter]} is invalid at row  ${rowIndex + 1}`);
  }
  if (String(csvHeader[csvHeaderCounter]).includes('YYYY-MM-DD') && isValidDate(cellValue)) {
    pathCollector[`${propPath.path}`] = cellValue.replace(/-/gi, '').concat('080000');
  } else {
    pathCollector[`${propPath.path}`] = cellValue;
  }
}
function isValidDate(dateString: string) {
  const regEx = /^\d{4}-\d{2}-\d{2}$/;
  if (!String(dateString).match(regEx)) return false; // Invalid format
  const d = new Date(dateString);
  const dNum = d.getTime();
  if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
  return d.toISOString().slice(0, 10) === dateString;
}
