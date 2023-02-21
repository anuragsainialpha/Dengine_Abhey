import { WebWorkerInputService } from './../model/WebWorkerInput';
import { TransmissionService } from './transmission.service';
import { Injectable } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { WebWorkerInputProps, GetViewUrl } from '../model/WebWorkerInput';

@Injectable({
  providedIn: 'root',
})
export class ItemService implements WebWorkerInputService {
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
  constructor(public transmissionService: TransmissionService) {}

  async drop(event: CdkDragDrop<string[]>) {
    if (this.selfDragDrop(event)) return;
    const { item1, item2 } = this.swap(event);
    moveItemInArray(this.dragdropList, event.previousIndex, event.currentIndex);
    await this.transmissionService.updateItem(item1);
    await this.transmissionService.updateItem(item2);
  }

  private selfDragDrop(event: CdkDragDrop<string[], string[]>) {
    return this.dragdropList[event.currentIndex]._id === this.dragdropList[event.previousIndex]._id;
  }

  private swap(event: CdkDragDrop<string[], string[]>) {
    const item1 = { ...this.dragdropList[event.previousIndex], _id: this.dragdropList[event.currentIndex]._id };
    const item2 = { ...this.dragdropList[event.currentIndex], _id: this.dragdropList[event.previousIndex]._id };
    return { item1, item2 };
  }

  public async valueChange(element) {
    if (element.required) {
      this.dragdropList = this.ElementList.filter((item) => item.required === true);
    } else this.dragdropList = this.dragdropList.filter((item) => item.name !== element.name);
    return await this.transmissionService.updateItem(element);
  }

  async onUpload(InputFileEvent) {
    this.itemIdIndex = this.dragdropListTc.findIndex((d) => d.path[0].includes('ItemGid') && d.path[0].includes('Xid'));
    this.itemIdDomain = this.dragdropListTc.findIndex(
      (d) => d.path[0].includes('ItemGid') && d.path[0].includes('DomainName')
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
    await this.transmissionService.sendDataToGtm(this, 'ItemGid');
  }

  getViewUrl: GetViewUrl = (viewURL, i, statusInitial) => {
    if (statusInitial !== 'P') return (viewURL = '');
    const itemIDIndex = this.csvHeader.findIndex((d) => d === this.dragdropListTc[this.itemIdIndex].displayText);
    const itemDomainIndex = this.csvHeader.findIndex((d) => d === this.dragdropListTc[this.itemIdDomain].displayText);
    if (itemIDIndex === -1) return (viewURL = '');
    return viewURL
      .replace('GTM_OTM_OBJECT', 'GtmItem')
      .replace('GTM_OTM_MANAGER_LAYOUT_GID', 'GTM_ITEM_VIEW')
      .replace('GTM_OTM_FINDER_SET', 'GTM_ITEM')
      .replace(
        'GTM_OTM_OBJECT_GID',
        `${this.csvRow[i][itemDomainIndex] || this.transmissionService.userDetails.domain}.${this.csvRow[i][
          itemIDIndex
        ].toUpperCase()}`
      );
  };

  getInitialState = (params: { table: boolean }) => {
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
  };
}
