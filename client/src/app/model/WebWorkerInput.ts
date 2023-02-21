export interface WebWorkerInput {
  fileData: any[];
  dragdropList: any[];
  containLines: boolean;
  parentGidIdentifierPathString: string;
  lineIdentifierPathString: string;
}

export type GetViewUrl = (viewURL: string, i: number, statusInitial: string, no?: string) => string;

export interface WebWorkerInputService {
  CSVfile: File;
  loader: { i: boolean; d: boolean };
  errors: { csv: any[]; server: string };
  xmlArray: any[];
  csvHeader: any[];
  csvRow: any[];
  uploadProgress: number;
  dragdropListTc: any[];
  dragdropList: any[];
  itemIdIndex: any;
  getViewUrl: GetViewUrl;
  statusCount: {
    p: number;
    e: number;
    s: number;
    f: number;
  };
  showStatus: boolean;
  statusRequest: {
    transmission: any[];
    reProcess: boolean;
    xids: any[];
    considerXid?: boolean;
  };
}

export interface WebWorkerInputProps {
  dragdropList: any[];
  containLines: boolean;
  parentGidIdentifierPathString: string;
  lineIdentifierPathString: string;
}
