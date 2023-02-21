import { TransmissionService } from './transmission.service';
import { Injectable } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { WebWorkerInputProps, GetViewUrl, WebWorkerInputService } from '../model/WebWorkerInput';

@Injectable({
  providedIn: 'root'
})
export class TrackingEventService implements WebWorkerInputService {
  public dragdropList = [];
  public dragdropListTc = [];
  public ElementList = [];
  public csvHeader = [];
  public csvRow = [];
  public xmlArray = [];
  public loader = { i: false, d: false };
  public errors = { csv: [], server: '' };
  public uploadProgress = 0;
  public CSVfile: File;
  public statusRequest = { transmission: [], reProcess: true, xids: [] };
  public itemIdIndex;
  public itemIdDomain;
  public statusCount = { p: 0, e: 0, s: 0, f: 0 };
  public showStatus = false;

  constructor(public transmissionService: TransmissionService) {}

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.dragdropList, event.previousIndex, event.currentIndex);
  }

  async valueChange(element) {
    if (element.required) {
      this.dragdropList = this.ElementList.filter(trackingEvent => trackingEvent.required === true);
    } else this.dragdropList = this.dragdropList.filter(trackingEvent => trackingEvent.name !== element.name);
    return await this.transmissionService.updateTrackingEvent(element);
  }

  async onUpload(InputFileEvent) {
    this.itemIdIndex = this.dragdropListTc.findIndex(
      d => d.path[0].includes('StatusCodeGid') && d.path[0].includes('Xid')
    );
    this.itemIdDomain = this.dragdropListTc.findIndex(
      d => d.path[0].includes('StatusCodeGid') && d.path[0].includes('DomainName')
    );

    const webWorkerProps: WebWorkerInputProps = {
      dragdropList: this.dragdropListTc,
      containLines: false,
      parentGidIdentifierPathString: '',
      lineIdentifierPathString: ''
    };
    await this.transmissionService.onUpload(InputFileEvent, webWorkerProps, this);
  }

  public async onRefreshStatus() {
    await this.transmissionService.onRefreshStatus(this);
  }

  public async sendDataToGtm() {
    await this.transmissionService.sendDataToGtm(this, 'StatusCodeGid', true);
  }

  getViewUrl: GetViewUrl = (viewURL, i, statusInitial, no) => {
    if (statusInitial !== 'P') return (viewURL = '');
    const trackingEventIDIndex = this.csvHeader.findIndex(d => d === this.dragdropListTc[this.itemIdIndex].displayText);
    if (trackingEventIDIndex === -1) return (viewURL = '');
    return viewURL
      .replace('GTM_OTM_OBJECT', 'IeShipmentstatus')
      .replace('GTM_OTM_MANAGER_LAYOUT_GID', 'IE_SHIPMENTSTATUS_VIEW')
      .replace('GTM_OTM_FINDER_SET', 'IE_SHIPMENTSTATUS')
      .replace('GTM_OTM_OBJECT_GID', `${no}`);
  };

  getInitialState(params: { table: boolean }) {
    if (params.table) {
      this.csvHeader.length = 0;
      this.csvRow.length = 0;
      this.showStatus = false;
      this.statusCount = { p: 0, e: 0, s: 0, f: 0 };
    }
    this.xmlArray.length = 0;
    this.uploadProgress = 0;
    this.errors.csv.length = 0;
    this.errors.server = '';
  }
}
