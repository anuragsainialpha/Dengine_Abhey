import { Injectable } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { TransmissionService } from './transmission.service';
import { WebWorkerInputProps, GetViewUrl, WebWorkerInputService } from '../model/WebWorkerInput';

@Injectable({
  providedIn: 'root',
})
export class OrderBaseService implements WebWorkerInputService {
  public dragdropList = [];
  public dragdropListTc = [];
  public ElementList = [];
  public releasedragdropList = [];
  public releaseElementList = [];
  public linedragdropList = [];
  public lineElementList = [];
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
  public showStatus = false;
  public statusCount = { p: 0, e: 0, s: 0, f: 0 };

  public xids = [];
  public responseTransmissions = [];

  constructor(public transmissionService: TransmissionService) {}

  linedrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.linedragdropList, event.previousIndex, event.currentIndex);
    this.dragdropList = [...this.releasedragdropList, ...this.linedragdropList];
  }
  releasedrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.releasedragdropList, event.previousIndex, event.currentIndex);
    this.dragdropList = [...this.releasedragdropList, ...this.linedragdropList];
  }

  public async releaseValueChange(element) {
    if (element.required) {
      this.releasedragdropList = this.releaseElementList.filter((item) => item.required === true);
    } else this.releasedragdropList = this.releasedragdropList.filter((item) => item.name !== element.name);
    this.dragdropList = [...this.releasedragdropList, ...this.linedragdropList];
    return await this.transmissionService.updateOrderBase(element);
  }
  public async lineValueChange(element) {
    if (element.required) {
      this.linedragdropList = this.lineElementList.filter((item) => item.required === true);
    } else this.linedragdropList = this.linedragdropList.filter((item) => item.name !== element.name);
    this.dragdropList = [...this.releasedragdropList, ...this.linedragdropList];
    return await this.transmissionService.updateOrderBase(element);
  }

  async onUpload(InputFileEvent) {
    this.itemIdIndex = this.dragdropListTc.findIndex(
      (d) => d.path[0].includes('TransOrderGid') && d.path[0].includes('Xid')
    );
    this.itemIdDomain = this.dragdropListTc.findIndex(
      (d) => d.path[0].includes('TransOrderGid') && d.path[0].includes('DomainName')
    );
    const webWorkerProps: WebWorkerInputProps = {
      dragdropList: this.dragdropListTc,
      containLines: true,
      parentGidIdentifierPathString: 'TransOrderGid',
      lineIdentifierPathString: 'TransOrderLine',
    };
    await this.transmissionService.onUpload(InputFileEvent, webWorkerProps, this);
  }

  public async onRefreshStatus() {
    await this.transmissionService.onRefreshStatus(this);
  }

  public async sendDataToGtm() {
    await this.transmissionService.sendDataToGtm(this, 'TransOrderGid');
  }
  getViewUrl: GetViewUrl = (viewURL, i, statusInitial) => {
    if (statusInitial !== 'P') return (viewURL = '');
    const itemIDIndex = this.csvHeader.findIndex((d) => d === this.dragdropListTc[this.itemIdIndex].displayText);
    const itemDomainIndex = this.csvHeader.findIndex((d) => d === this.dragdropListTc[this.itemIdDomain].displayText);
    if (itemIDIndex === -1) return (viewURL = '');
    return viewURL
      .replace('GTM_OTM_OBJECT', 'OrderBase')
      .replace('GTM_OTM_MANAGER_LAYOUT_GID', 'ORDER_BASE_VIEW')
      .replace('GTM_OTM_FINDER_SET', 'OB_ORDER_BASE')
      .replace(
        'GTM_OTM_OBJECT_GID',
        `${this.csvRow[i][itemDomainIndex] || this.transmissionService.userDetails.domain}.${this.csvRow[i][
          itemIDIndex
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
