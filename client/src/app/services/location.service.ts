import { TransmissionService } from './transmission.service';
import { Injectable } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { WebWorkerInputProps, WebWorkerInputService } from '../model/WebWorkerInput';

@Injectable({
  providedIn: 'root',
})
export class LocationService implements WebWorkerInputService {
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
  public itemIdIndex;
  public itemIdDomain;
  public statusRequest = { transmission: [], reProcess: true, xids: [] };

  public statusCount = { p: 0, e: 0, s: 0, f: 0 };
  public showStatus = false;

  public xids = [];
  public responseTransmissions = [];

  constructor(public transmissionService: TransmissionService) {}

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.dragdropList, event.previousIndex, event.currentIndex);
  }

  async valueChange(element) {
    if (element.required) {
      this.dragdropList = this.ElementList.filter((location) => location.required === true);
    } else this.dragdropList = this.dragdropList.filter((location) => location.name !== element.name);
    return await this.transmissionService.updateLocation(element);
  }

  async onUpload(InputFileEvent) {
    this.itemIdIndex = this.dragdropListTc.findIndex(
      (d) => d.path[0].includes('LocationGid') && d.path[0].includes('Xid')
    );
    this.itemIdDomain = this.dragdropListTc.findIndex(
      (d) => d.path[0].includes('LocationGid') && d.path[0].includes('DomainName')
    );
    const webWorkerProps: WebWorkerInputProps = {
      dragdropList: this.dragdropListTc,
      containLines: false,
      parentGidIdentifierPathString: '',
      lineIdentifierPathString: '',
    };
    await this.transmissionService.onUpload(InputFileEvent, webWorkerProps, this);
  }

  public async onRefreshStatus() {
    await this.transmissionService.onRefreshStatus(this);
  }

  public async sendDataToGtm() {
    await this.transmissionService.sendDataToGtm(this, 'LocationGid');
  }

  getViewUrl = (viewURL, i, statusInitial) => {
    if (statusInitial !== 'P') return (viewURL = '');
    const locationIDIndex = this.csvHeader.findIndex((d) => d === this.dragdropListTc[this.itemIdIndex].displayText);
    const locationDomainIndex = this.csvHeader.findIndex(
      (d) => d === this.dragdropListTc[this.itemIdDomain].displayText
    );
    if (locationIDIndex === -1) return (viewURL = '');
    return viewURL
      .replace('GTM_OTM_OBJECT', 'Location')
      .replace('GTM_OTM_MANAGER_LAYOUT_GID', 'GTM_LOCATION_VIEW')
      .replace('GTM_OTM_FINDER_SET', 'GTM_LOCATION')
      .replace(
        'GTM_OTM_OBJECT_GID',
        `${this.csvRow[i][locationDomainIndex] || this.transmissionService.userDetails.domain}.${this.csvRow[i][
          locationIDIndex
        ].toUpperCase()}`
      );
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
