import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import { Papa } from 'ngx-papaparse';
import { WebWorkerInput, WebWorkerInputProps, WebWorkerInputService } from '../model/WebWorkerInput';
import * as flatten from 'flat';
import * as parser from 'fast-xml-parser';
const unflatten = flatten.unflatten;
const JsonParser = parser.j2xParser;
const JSONtoXML = new JsonParser({});

@Injectable({
  providedIn: 'root',
})
export class TransmissionService {
  autoGenFields = ['TransactionCode', 'DomainName'];
  public Item = [];
  public displayItem = [];
  public Release = [];
  public displayRelease = [];
  public Location = [];
  public displayLocation = [];
  public Party = [];
  public displayParty = [];
  public Transaction = [];
  public displayTransaction = [];
  public OrderBase = [];
  public displayOrderBase = [];
  public TrackingEvent = [];
  public displayTrackingEvent = [];
  public Shipment = [];
  public displayShipment = [];
  public userDetails = { name: '', domain: '', role: '', instance: '', sidebar: [] };
  public setting;
  public isAuthenticated = false;
  public settingsSidebar = [];

  public CSVoptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: false,
    useBom: true,
    noDownload: false,
    headers: [],
    removeNewLines: true,
  };

  public showSidebar = true;

  private readonly auditRequired = this.userDetails.sidebar.find((s) => s.name.toLowerCase() === 'audit');

  constructor(private httpClient: HttpClient, private papa: Papa, private router: Router) {}

  public getInstanceColor = () => {
    switch (this.userDetails.instance) {
      case 'test':
        return 'warn';
      case 'prod':
        return 'warn';
      default:
        return 'warn';
    }
  };

  public getStatusColor = (status) => {
    if (status === 'P') return 'green';
    if (status === 'E') return 'red';
    return 'initial';
  };

  public getInstanceClass = () => this.userDetails.instance;

  public generateCsv = (tempName, dragdropList) => {
    this.CSVoptions.headers = [...dragdropList.map((d) => d.displayText)];
    // tslint:disable-next-line: no-unused-expression
    new Angular5Csv([], tempName, this.CSVoptions);
  };

  public parsePromise = (file) => {
    return new Promise((complete, error) => {
      this.papa.parse(file, { complete, error, skipEmptyLines: true });
    });
  };

  public getItem = () => {
    return this.asyncHandler(this.httpClient.get('/api/item').toPromise());
  };
  public getDisplayItem = () => {
    return this.asyncHandler(this.httpClient.get('/api/item?display=true').toPromise());
  };

  public updateItem = (item) => {
    return this.asyncHandler(this.httpClient.put('/api/item', { item }).toPromise());
  };

  public getRelease = () => {
    return this.asyncHandler(this.httpClient.get('/api/order-release').toPromise());
  };
  public getDisplayRelease = () => {
    return this.asyncHandler(this.httpClient.get('/api/order-release?display=true').toPromise());
  };
  public updateRelease = (release) => {
    return this.asyncHandler(this.httpClient.put('/api/order-release', { release }).toPromise());
  };
  public getOrderBase = () => {
    return this.asyncHandler(this.httpClient.get('/api/order-base').toPromise());
  };
  public getDisplayOrderBase = () => {
    return this.asyncHandler(this.httpClient.get('/api/order-base?display=true').toPromise());
  };

  public updateOrderBase = (orderBase) => {
    return this.asyncHandler(this.httpClient.put('/api/order-base', { orderBase }).toPromise());
  };

  public postAuditCsv = (data) => {
    return this.asyncHandler(this.httpClient.post('/api/audit', data).toPromise());
  };

  public getAuditData = () => {
    return this.asyncHandler(this.httpClient.get('/api/audit').toPromise());
  };
  public getAuditFileData = (fileName) => {
    return this.httpClient.get(`/api/audit/files?file=${fileName}`, { responseType: 'arraybuffer' }).toPromise();
  };

  public removeAuditFile = (fileName) => {
    return this.asyncHandler(this.httpClient.delete(`/api/audit/files?file=${fileName}`).toPromise());
  };
  public removeAllAuditFile = () => {
    return this.asyncHandler(this.httpClient.delete(`/api/audit/files/all`).toPromise());
  };

  public getStatus = (data) => {
    return this.asyncHandler(this.httpClient.post('/api/transmission/status', data).toPromise());
  };
  public getFileRawData = (data) => {
    return this.asyncHandler(this.httpClient.post('/api/transmission/filedata', data).toPromise());
  };

  public sendTransmission = (data) => {
    return this.asyncHandler(this.httpClient.post('/api/transmission', data).toPromise());
  };

  public getSettings = () => {
    return this.asyncHandler(this.httpClient.get('/api/settings').toPromise());
  };
  public updateSettings = (setting) => {
    return this.asyncHandler(this.httpClient.put('/api/settings', { setting }).toPromise());
  };

  public async asyncHandler(asyncFunction) {
    const result = {};
    try {
      const response = await asyncFunction;
      result[`data`] = response.data;
    } catch (ex) {
      result[`error`] = ex.error;
    }
    return result;
  }

  public getUserDetails() {
    const token = JSON.parse(localStorage.getItem('token'));
    if (!token) return null;
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    return (this.userDetails = decodedToken);
  }

  public getTokenData(token) {
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    return decodedToken;
  }

  public tokenExpired(token) {
    const helper = new JwtHelperService();
    return helper.isTokenExpired(token);
  }

  public login = (data) => {
    return this.asyncHandler(this.httpClient.post(`/api/auth`, data).toPromise());
  };

  public getLocation() {
    return this.asyncHandler(this.httpClient.get('/api/location').toPromise());
  }
  public getDisplayLocation() {
    return this.asyncHandler(this.httpClient.get('/api/location?display=true').toPromise());
  }

  public updateLocation = (location) => {
    return this.asyncHandler(this.httpClient.put('/api/location', { location }).toPromise());
  };

  // Party
  public getParty() {
    return this.asyncHandler(this.httpClient.get('/api/party').toPromise());
  }
  public getDisplayParty() {
    return this.asyncHandler(this.httpClient.get('/api/party?display=true').toPromise());
  }

  public updateParty = (party) => {
    return this.asyncHandler(this.httpClient.put('/api/party', { party }).toPromise());
  };
  // Transaction
  public getTransaction() {
    return this.asyncHandler(this.httpClient.get('/api/transaction').toPromise());
  }
  public getDisplayTransaction() {
    return this.asyncHandler(this.httpClient.get('/api/transaction?display=true').toPromise());
  }

  public updateTransaction = (transaction) => {
    return this.asyncHandler(this.httpClient.put('/api/transaction', { transaction }).toPromise());
  };
  // Tracking Event
  public getTrackingEvent = () => {
    return this.asyncHandler(this.httpClient.get('/api/tracking-event').toPromise());
  };
  public getDisplayTrackingEvent = () => {
    return this.asyncHandler(this.httpClient.get('/api/tracking-event?display=true').toPromise());
  };
  public updateTrackingEvent = (trackingEvent) => {
    return this.asyncHandler(this.httpClient.put('/api/tracking-event', { trackingEvent }).toPromise());
  };

  // Shipment
  public getShipment = () => {
    return this.asyncHandler(this.httpClient.get('/api/shipment').toPromise());
  };
  public getDisplayShipment = () => {
    return this.asyncHandler(this.httpClient.get('/api/shipment?display=true').toPromise());
  };
  public updateShipment = (shipment) => {
    return this.asyncHandler(this.httpClient.put('/api/shipment', { shipment }).toPromise());
  };

  public validateUser = (data) => {
    return this.asyncHandler(this.httpClient.get(`/api/user/me`, data).toPromise());
  };

  public getInitialAppData = async (sidebar) => {
    if (this.userNotAuthenticated()) return;
    this.fetchDataAsync(sidebar);
  };

  private fetchDataAsync(sidebar: any) {
    this.fetchSettingsDataAsync(sidebar);
    this.fetchPartyDataAsync(sidebar);
    this.fetchItemDataAsync(sidebar);
    this.fetchLocationDataAsync(sidebar);
    this.fetchTransactionDataAsync(sidebar);
    this.fetchOrderReleaseDataAsync(sidebar);
    this.fetchOrderBaseDataAsync(sidebar);
    this.fetchTrackingEventDataAsync(sidebar);
    this.fetchShipmentDataAsync(sidebar);
  }

  private fetchShipmentDataAsync(sidebar: any) {
    if (sidebar.find((s) => s.name.toLowerCase() === 'shipment'))
      this.getShipment().then((d: any) => {
        if (d.data && Array.isArray(d.data) && d.data.length && this.Shipment.length === 0) this.Shipment = d.data;
      });
  }

  private fetchTrackingEventDataAsync(sidebar: any) {
    if (sidebar.find((s: { name: string }) => s.name.toLowerCase() === 'tracking-event'))
      this.getTrackingEvent().then((d: any) => {
        if (d.data && Array.isArray(d.data) && d.data.length && this.TrackingEvent.length === 0)
          this.TrackingEvent = d.data;
      });
  }

  private fetchOrderBaseDataAsync(sidebar: any) {
    if (sidebar.find((s: { name: string }) => s.name.toLowerCase() === 'order-base'))
      this.getOrderBase().then((d: any) => {
        if (d.data && Array.isArray(d.data) && d.data.length && this.OrderBase.length === 0) this.OrderBase = d.data;
      });
  }

  private fetchOrderReleaseDataAsync(sidebar: any) {
    if (sidebar.find((s) => s.name.toLowerCase() === 'order-release'))
      this.getRelease().then((d: any) => {
        if (d.data && Array.isArray(d.data) && d.data.length && this.Release.length === 0) this.Release = d.data;
      });
  }

  private fetchTransactionDataAsync(sidebar: any) {
    if (sidebar.find((s) => s.name.toLowerCase() === 'transaction'))
      this.getTransaction().then((d: any) => {
        if (d.data && Array.isArray(d.data) && d.data.length && this.Transaction.length === 0)
          this.Transaction = d.data;
      });
  }

  private fetchLocationDataAsync(sidebar: any) {
    if (sidebar.find((s) => s.name.toLowerCase() === 'location'))
      this.getLocation().then((d: any) => {
        if (d.data && Array.isArray(d.data) && d.data.length && this.Location.length === 0) this.Location = d.data;
      });
  }

  private fetchItemDataAsync(sidebar: any) {
    if (sidebar.find((s) => s.name.toLowerCase() === 'item'))
      this.getItem().then((d: any) => {
        if (d.data && Array.isArray(d.data) && d.data.length && this.Item.length === 0) this.Item = d.data;
      });
  }

  private fetchPartyDataAsync(sidebar: any) {
    if (sidebar.find((s) => s.name.toLowerCase() === 'party'))
      this.getParty().then((d: any) => {
        if (d.data && Array.isArray(d.data) && d.data.length && this.Party.length === 0) this.Party = d.data;
      });
  }

  private fetchSettingsDataAsync(sidebar: any) {
    if (sidebar.find((s) => s.name.toLowerCase() === 'settings'))
      this.getSettings().then((d: any) => {
        if (d.data) return (this.setting = d.data);
      });
  }

  private userNotAuthenticated() {
    return !this.isAuthenticated;
  }

  public async urlAccessAllowed(url) {
    const token = JSON.parse(localStorage.getItem('token'));
    switch (true) {
      case !token: {
        if (url === '/login') return true;
        this.router.navigate(['/login']);
        return false;
      }
      case this.tokenExpired(token): {
        localStorage.removeItem('token');
        if (url === '/login') return true;
        this.router.navigate(['/login']);
        return false;
      }
      default: {
        const { data, error } = (await this.validateUser(token)) as any;
        if (error) {
          localStorage.removeItem('token');
          if (url === '/login') return true;
          this.router.navigate(['/login']);
          return false;
        } else {
          this.setAuthenticationStatusAndUserDetails(data);
          if (url === '/login') {
            this.router.navigate(['/item']);
            return false;
          }
          return true;
        }
      }
    }
  }

  private setAuthenticationStatusAndUserDetails(data: any) {
    this.isAuthenticated = true;
    this.userDetails = {
      name: data.username,
      domain: data.username.split('.')[0],
      role: data.isAdmin ? 'ADMIN' : 'USER',
      instance: data.instance,
      sidebar: data.sidebar,
    };
  }

  public async onRefreshStatus(itemService: WebWorkerInputService) {
    if (this.allTransmissionProcessed(itemService)) return this.exitTransmissionRefresh(itemService);
    this.beginTransmissionRefresh(itemService);
    this.removePreviousTransmissionresult(itemService);
    const { data: responseStatus, error } = (await this.getStatus(itemService.statusRequest)) as any;
    if (error) return this.onRefreshServerError(itemService, error);
    const auditCsvRow = this.getOnRefreshTransmissionStatus(itemService, responseStatus);
    this.onRefreshPrepareAndShowStatus(auditCsvRow, itemService);
    this.postOnRefreshAuditFile(itemService, auditCsvRow);
  }

  private postOnRefreshAuditFile(itemService: WebWorkerInputService, auditCsvRow: any[][]) {
    const auditCsvFile = [];
    this.onRefreshPrepareAndPostAuditCsvData(auditCsvFile, itemService, auditCsvRow);
  }

  private beginTransmissionRefresh(itemService: WebWorkerInputService) {
    itemService.showStatus = false;
    itemService.loader.i = true;
  }

  private exitTransmissionRefresh(itemService: WebWorkerInputService) {
    itemService.loader.i = false;
    return;
  }

  private allTransmissionProcessed(itemService: WebWorkerInputService) {
    return !itemService.statusCount.f && !itemService.statusCount.s;
  }

  private getOnRefreshTransmissionStatus(itemService: WebWorkerInputService, responseStatus: any) {
    itemService.csvRow.forEach((d) => d.pop());
    const auditCsvRow = itemService.csvRow.map((d) => [...d]);
    for (let i = 0; i < itemService.csvRow.length; i++) {
      this.onRefreshUpdateEachRowStatus(itemService, i, auditCsvRow, responseStatus);
    }
    return auditCsvRow;
  }

  private onRefreshUpdateEachRowStatus(
    itemService: WebWorkerInputService,
    i: number,
    auditCsvRow: any[][],
    responseStatus: any
  ) {
    const row = itemService.csvRow[i];
    const auditRow = auditCsvRow[i];
    const csvXidIndex = itemService.csvHeader.findIndex(this.getRefreshCsvXidIndex(itemService));
    const statusXidIndex = responseStatus.findIndex(this.getRefreshResponseXidIndex(row, csvXidIndex));
    if (statusXidIndex > -1)
      this.prepareOnRefreshRowStatus(responseStatus, statusXidIndex, row, itemService, i, auditRow);
  }

  private onRefreshPrepareAndPostAuditCsvData(
    auditCsvFile: any[],
    itemService: WebWorkerInputService,
    auditCsvRow: any[][]
  ) {
    auditCsvFile.push(itemService.csvHeader, ...auditCsvRow);
    const tempCSV = this.papa.unparse(auditCsvFile);
    const formData = this.getOnRefreshCsvDataAsFormData(tempCSV, itemService);
    if (this.auditRequired) this.postAuditCsv(formData);
    this.getInitialState(itemService, { table: false });
    itemService.loader.i = false;
  }

  private getOnRefreshCsvDataAsFormData(tempCSV: string, itemService: WebWorkerInputService) {
    const formData = new FormData();
    const { name, role } = this.userDetails;
    const csvBlob = new Blob([tempCSV], { type: 'text/csv' });
    formData.append(
      `${name}$$$${role}$$$${+new Date()}$$$${itemService.CSVfile.name}`,
      csvBlob,
      itemService.CSVfile.name
    );
    return formData;
  }

  private onRefreshPrepareAndShowStatus(auditCsvRow: any[][], itemService: WebWorkerInputService) {
    const statusCount = this.getOnRefreshStatusCount(auditCsvRow);
    this.setGlobalOnRefreshStatusCount(itemService, statusCount);
  }

  private getOnRefreshStatusCount(auditCsvRow: any[][]) {
    const uniqTransmissionStatus = this.getUniqueOnRefreshTransmissionStatus(auditCsvRow);
    const statusCount = { p: 0, e: 0, s: 0, f: 0 };
    for (let index = 0; index < uniqTransmissionStatus.length; index++) {
      const status = this.getEachRowStatusOnRefresh(uniqTransmissionStatus, index);
      this.updateLocalOnRefreshStatusCount(status, statusCount);
    }
    return statusCount;
  }

  private setGlobalOnRefreshStatusCount(
    itemService: WebWorkerInputService,
    statusCount: { p: number; e: number; s: number; f: number }
  ) {
    itemService.statusCount.p = statusCount.p;
    itemService.statusCount.e = statusCount.e;
    itemService.statusCount.f = statusCount.f;
    itemService.statusCount.s = statusCount.s;
    itemService.showStatus = true;
  }

  private updateLocalOnRefreshStatusCount(status: string, statusCount: { p: number; e: number; s: number; f: number }) {
    if (status === 'P') statusCount.p += 1;
    if (status === 'E') statusCount.e += 1;
    if (status === 'F') statusCount.f += 1;
    if (status === 'S') statusCount.s += 1;
  }

  private getEachRowStatusOnRefresh(uniqTransmissionStatus: any[], index: number) {
    const d = uniqTransmissionStatus[index] as string;
    const status = d.split(' ')[1];
    return status;
  }

  private getUniqueOnRefreshTransmissionStatus(auditCsvRow: any[][]) {
    return Array.from(new Set(auditCsvRow.map((d) => d[d.length - 1])));
  }

  private prepareOnRefreshRowStatus(
    responseStatus: any,
    statusXidIndex: any,
    row: any,
    itemService: WebWorkerInputService,
    i: number,
    auditRow: any[]
  ) {
    const no = responseStatus[statusXidIndex].transmission;
    const status = responseStatus[statusXidIndex].status[0];
    const reportUrl = responseStatus[statusXidIndex].instanceURL;
    const viewUrl = responseStatus[statusXidIndex].viewURL;
    this.onRefreshUpdateTransmissionColumn(row, no, status, reportUrl, itemService, viewUrl, i, auditRow);
  }

  private onRefreshUpdateTransmissionColumn(
    row: any,
    no: any,
    status: any,
    reportUrl: any,
    itemService: WebWorkerInputService,
    viewUrl: any,
    i: number,
    auditRow: any[]
  ) {
    row.push(`${no}$$$${status}$$$${reportUrl}$$$${itemService.getViewUrl(viewUrl, i, status, no)}`);
    auditRow.push(`${no} ${status}`);
  }

  private getRefreshCsvXidIndex(
    itemService: WebWorkerInputService
  ): (value: any, index: number, obj: any[]) => unknown {
    return (d) => d === itemService.dragdropListTc[itemService.itemIdIndex].displayText;
  }

  private getRefreshResponseXidIndex(row: any, csvXidIndex: number): any {
    return (s) =>
      s.xid.toUpperCase() === row[csvXidIndex].toUpperCase() ||
      s.xid === this.userDetails.domain + '.' + row[csvXidIndex].toUpperCase();
  }

  private onRefreshServerError(itemService: WebWorkerInputService, error: any) {
    itemService.errors.server = error;
    itemService.loader.i = false;
    return;
  }

  private removePreviousTransmissionresult(itemService: WebWorkerInputService) {
    for (let i = 0; i < itemService.csvRow.length; i++) {
      const row = itemService.csvRow[i];
      const rowTransResult = row[row.length - 1].split('$$$');
      const rowTransNo = rowTransResult[0];
      itemService.statusRequest.transmission.push(rowTransNo);
    }
  }

  public getInitialState(caller, params: { table: boolean }) {
    if (params.table) {
      this.getInitialStateWithTable(caller);
    }
    this.getInitialStateWithoutTable(caller);
  }

  public getFileData = async (fileTypes, fileExt, file) => {
    const { data } = (await this.parsePromise(file)) as any;
    return data;
  };

  private getInitialStateWithoutTable(caller: any) {
    caller.xmlArray.length = 0;
    caller.uploadProgress = 0;
    caller.errors.csv.length = 0;
    caller.errors.server = '';
  }

  private getInitialStateWithTable(caller: any) {
    caller.csvHeader.length = 0;
    caller.csvRow.length = 0;
    caller.showStatus = false;
    caller.statusCount = { p: 0, e: 0, s: 0, f: 0 };
  }

  public async readFileAsBinary(file) {
    const data = await new Promise((resolve) => {
      const fileReader = new FileReader();
      fileReader.onload = (e) => resolve(fileReader.result);
      fileReader.readAsBinaryString(file);
    });
    return data;
  }

  public async onUpload(InputFileEvent, webWorkerProps: WebWorkerInputProps, itemService: WebWorkerInputService) {
    const file = this.readAndStoreFile(itemService, InputFileEvent);
    const { fileTypes, fileExt } = this.getFileInfo(InputFileEvent);
    if (this.notAValidFile(fileTypes, fileExt)) return this.showInvalidFileError(itemService, fileTypes);
    await this.parseCsvAndGenerateXmls(file, webWorkerProps, itemService);
  }

  public getXML = (data) => {
    return new Promise((resolve, reject) => {
      resolve(data.map((e) => JSONtoXML.parse(unflatten(e))));
    });
  };

  private async parseCsvAndGenerateXmls(
    file: any,
    webWorkerProps: WebWorkerInputProps,
    itemService: WebWorkerInputService
  ) {
    const formData = this.getFileDataAsFormData(file);
    const { data: csvData } = (await this.getFileRawData(formData)) as any;
    this.extractXmlFromCsvData(csvData, webWorkerProps, itemService);
  }

  private showInvalidFileError(itemService: WebWorkerInputService, fileTypes: string[]) {
    itemService.loader.i = false;
    return itemService.errors.csv.push(`CSV error : Please use a valid ${fileTypes.join('/')} file!`);
  }

  private notAValidFile(fileTypes: string[], fileExt: any) {
    return !fileTypes.includes(fileExt);
  }

  private readAndStoreFile(itemService: WebWorkerInputService, InputFileEvent: any) {
    itemService.loader.i = true;
    this.getInitialState(itemService, { table: true });
    const file = InputFileEvent.target.files[0];
    itemService.CSVfile = file;
    return file;
  }

  private extractXmlFromCsvData(csvData: any, webWorkerProps: WebWorkerInputProps, itemService: WebWorkerInputService) {
    const workerData: WebWorkerInput = {
      fileData: csvData,
      ...webWorkerProps,
    };
    this.triggerWebWorker(workerData, itemService);
  }

  private triggerWebWorker(workerData: WebWorkerInput, itemService: WebWorkerInputService) {
    const worker = new Worker('../csv-web-worker.worker.ts', { type: 'module' });
    const arrBuf = new ArrayBuffer(0);
    worker.postMessage(workerData, [arrBuf]);
    worker.onmessage = ({ data }) => {
      this.getXMlsFromWebWorker(itemService, data);
    };
  }

  private getXMlsFromWebWorker(itemService: WebWorkerInputService, data: any) {
    itemService.errors.csv = data.error;
    if (!data.error.length) {
      itemService.xmlArray = data.result;
    }
    itemService.csvHeader = data.csvHeader;
    itemService.csvRow = data.csvRow;
    itemService.loader.i = false;
  }

  private getFileDataAsFormData(file: any) {
    const formData = new FormData();
    const { name, role } = this.userDetails;
    const csvBlob = new Blob([file], { type: file.type });
    formData.append(`${name}$$$${role}$$$${+new Date()}$$$${file.name}`, csvBlob, file.name);
    return formData;
  }

  private getFileInfo(InputFileEvent: any) {
    const fileTypes = ['csv', 'xlsx', 'xls', 'xlsm'];
    const fileNameSplit = InputFileEvent.target.files[0].name.split('.');
    const fileExt = fileNameSplit[fileNameSplit.length - 1];
    return { fileTypes, fileExt };
  }

  public async sendDataToGtm(itemService: WebWorkerInputService, gidMatchString: string, considerXid: boolean = false) {
    setTimeout(async () => {
      itemService.loader.d = true;
      const maxGlogElement = this.getMaxTransactionPerTransmission();
      let minTransmission = 0;
      let maxTransmission = maxGlogElement;
      let chunckedTransmissions = [];
      const responseTransmissions = [];
      let progressCount = 0;
      let xids = [];
      while (minTransmission <= itemService.xmlArray.length) {
        chunckedTransmissions = itemService.xmlArray.slice(minTransmission, maxTransmission);
        if (chunckedTransmissions.length === 0) break;
        chunckedTransmissions = (await this.getXML(chunckedTransmissions)) as any[];
        const { reqBody, finalXML } = this.getRequestBody(chunckedTransmissions, itemService);
        const { data: response, error } = (await this.sendTransmission(reqBody)) as any;
        if (error) {
          this.showServerError(itemService, error);
          break;
        }
        ({ xids, progressCount, minTransmission, maxTransmission } = this.getProgressData(
          finalXML,
          gidMatchString,
          xids,
          responseTransmissions,
          response,
          progressCount,
          chunckedTransmissions,
          itemService,
          minTransmission,
          maxGlogElement,
          maxTransmission
        ));
      }
      if (itemService.errors.server) {
        this.showProgressError(itemService);
        return;
      }
      const request = this.prepareGetStatusRequest(responseTransmissions, xids, considerXid, itemService);
      const { data: responseStatus, error } = (await this.getStatus(request)) as any;
      if (error) {
        this.showServerError(itemService, error);
        return;
      }
      this.postAuditDataAndShowStatus(itemService, responseStatus);
    }, 0);
  }

  public getElement = (d) => {
    if (d.path.length > 1) return d.display;
    if (d.display && !this.autoGenFields.find((e) => d.path[0].includes(e))) return d.display;
    return false;
  };

  private getMaxTransactionPerTransmission() {
    return this.setting.glogPerTrx || 10;
  }

  private postAuditDataAndShowStatus(itemService: WebWorkerInputService, responseStatus: any) {
    const auditCsvFile = [];
    const auditCsvRow = itemService.csvRow.map((d) => [...d]);
    itemService.csvHeader.push('Transmission');
    this.prepareStatus(itemService, auditCsvRow, responseStatus);
    this.showStatus(auditCsvRow, itemService);
    auditCsvFile.push(itemService.csvHeader, ...auditCsvRow);
    this.prepareAndSendAuditData(auditCsvFile, itemService);
  }

  private prepareGetStatusRequest(
    responseTransmissions: any[],
    xids: any[],
    considerXid: boolean,
    itemService: WebWorkerInputService
  ) {
    const request = {
      transmission: responseTransmissions,
      reProcess: false,
      xids,
      considerXid,
    };
    itemService.statusRequest = { ...request, reProcess: true, transmission: [] };
    return request;
  }

  private showProgressError(itemService: WebWorkerInputService) {
    itemService.loader.d = false;
    itemService.xmlArray.length = 0;
  }

  private getProgressData(
    finalXML: string,
    gidMatchString: string,
    xids: any[],
    responseTransmissions: any[],
    response: any,
    progressCount: number,
    chunckedTransmissions: any[],
    itemService: WebWorkerInputService,
    minTransmission: number,
    maxGlogElement: any,
    maxTransmission: any
  ) {
    xids = this.getAllXid(finalXML, gidMatchString, xids);
    responseTransmissions.push(response.ReferenceTransmissionNo);
    progressCount = this.calculateProgress(progressCount, chunckedTransmissions, itemService);
    itemService.uploadProgress = Math.floor(progressCount);
    minTransmission = minTransmission + maxGlogElement;
    maxTransmission = maxTransmission + maxGlogElement;
    return { xids, progressCount, minTransmission, maxTransmission };
  }

  private calculateProgress(progressCount: number, chunckedTransmissions: any[], itemService: WebWorkerInputService) {
    progressCount += (chunckedTransmissions.length / itemService.xmlArray.length) * 100;
    return progressCount;
  }

  private getAllXid(finalXML: string, gidMatchString: string, xids: any[]) {
    const xidContentString = finalXML.match(new RegExp(gidMatchString + '(.*?)' + gidMatchString, 'g'));
    xids = [...xids, ...xidContentString.map((d) => d.match(/Xid>(.*?)</)[1])];
    return xids;
  }

  private showServerError(itemService: WebWorkerInputService, error: any) {
    itemService.errors.server = error;
    itemService.loader.d = false;
    itemService.xmlArray.length = 0;
  }

  private getRequestBody(chunckedTransmissions: any[], itemService: WebWorkerInputService) {
    const finalXML = this.getFinalXMl(chunckedTransmissions);
    const reqBody = { xml: finalXML, xmlNs: itemService.dragdropList[0].xmlNs };
    return { reqBody, finalXML };
  }

  private getFinalXMl(chunckedTransmissions: any[]) {
    const transHeader = `<Transmission><TransmissionBody>`;
    const transTail = `</TransmissionBody></Transmission>`;
    let transBody = chunckedTransmissions.join('').replace(new RegExp(transHeader, 'g'), '');
    transBody = transBody.replace(new RegExp(transTail, 'g'), '');
    const finalXML = `${transHeader}${transBody}${transTail}`;
    return finalXML;
  }

  private prepareAndSendAuditData(auditCsvFile: any[], itemService: WebWorkerInputService) {
    const tempCSV = this.papa.unparse(auditCsvFile);
    const formData = new FormData();
    const { name, role } = this.userDetails;
    const csvBlob = new Blob([tempCSV], { type: 'text/csv' });
    this.getAuditFileDataReady(formData, name, role, itemService, csvBlob);
    if (this.userDetails.sidebar.find((s) => s.name.toLowerCase() === 'audit')) this.postAuditCsv(formData);
    itemService.loader.d = false;
    this.getInitialState(itemService, { table: false });
  }

  private prepareStatus(itemService: WebWorkerInputService, auditCsvRow: any[][], responseStatus: any) {
    for (let i = 0; i < itemService.csvRow.length; i++) {
      const row = itemService.csvRow[i];
      const auditRow = auditCsvRow[i];
      const csvXidIndex = this.getXidIndex(itemService);
      const statusXidIndex = this.getResponseStatusXidIndex(responseStatus, row, csvXidIndex);
      if (statusXidIndex > -1) {
        const { no, status, reportUrl, viewUrl } = this.getEachRowStatus(responseStatus, statusXidIndex);
        this.updateTransmissionColumn(row, no, status, reportUrl, itemService, viewUrl, i, auditRow);
      }
    }
  }

  private getEachRowStatus(responseStatus: any, statusXidIndex: any) {
    const no = responseStatus[statusXidIndex].transmission;
    const status = responseStatus[statusXidIndex].status[0];
    const reportUrl = responseStatus[statusXidIndex].instanceURL;
    const viewUrl = responseStatus[statusXidIndex].viewURL;
    return { no, status, reportUrl, viewUrl };
  }

  private updateTransmissionColumn(
    row: any,
    no: any,
    status: any,
    reportUrl: any,
    itemService: WebWorkerInputService,
    viewUrl: any,
    i: number,
    auditRow: any[]
  ) {
    row.push(`${no}$$$${status}$$$${reportUrl}$$$${itemService.getViewUrl(viewUrl, i, status, no)}`);
    auditRow.push(`${no} ${status}`);
  }

  private getResponseStatusXidIndex(responseStatus: any, row: any, csvXidIndex: number) {
    return responseStatus.findIndex((s) => s.xid === row[csvXidIndex].toUpperCase());
  }

  private getXidIndex(itemService: WebWorkerInputService) {
    return itemService.csvHeader.findIndex(
      (d) => d === itemService.dragdropListTc[itemService.itemIdIndex].displayText
    );
  }

  private showStatus(auditCsvRow: any[][], itemService: WebWorkerInputService) {
    const uniqTransmissionStatus = Array.from(new Set(auditCsvRow.map((d) => d[d.length - 1])));
    const statusCount = this.getLocalStatusCount(uniqTransmissionStatus);
    this.setGlobalStatusCount(itemService, statusCount);
    itemService.showStatus = true;
  }

  private setGlobalStatusCount(
    itemService: WebWorkerInputService,
    statusCount: { p: number; e: number; s: number; f: number }
  ) {
    itemService.statusCount.p = statusCount.p;
    itemService.statusCount.e = statusCount.e;
    itemService.statusCount.f = statusCount.f;
    itemService.statusCount.s = statusCount.s;
  }

  private getLocalStatusCount(uniqTransmissionStatus: any[]) {
    const statusCount = { p: 0, e: 0, s: 0, f: 0 };
    for (let index = 0; index < uniqTransmissionStatus.length; index++) {
      const d = uniqTransmissionStatus[index] as string;
      const status = d.split(' ')[1];
      if (status === 'P') statusCount.p += 1;
      if (status === 'E') statusCount.e += 1;
      if (status === 'F') statusCount.f += 1;
      if (status === 'S') statusCount.s += 1;
    }
    return statusCount;
  }

  private getAuditFileDataReady(
    formData: FormData,
    name: string,
    role: string,
    itemService: WebWorkerInputService,
    csvBlob: Blob
  ) {
    formData.append(
      `${name}$$$${role}$$$${+new Date()}$$$${itemService.CSVfile.name}`,
      csvBlob,
      itemService.CSVfile.name
    );
  }
}
