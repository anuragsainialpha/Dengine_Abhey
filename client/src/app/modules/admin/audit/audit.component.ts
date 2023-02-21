import { TransmissionService } from './../../../services/transmission.service';
import { Component, OnInit } from '@angular/core';
import { OrderPipe } from 'ngx-order-pipe';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss']
})
export class AuditComponent implements OnInit {
  auditFiles = [];
  collection = [];
  sortedCollection: any[];
  order = 'uploaddate';
  reverse = false;
  count = 0;
  itemsPerPage = 12;
  pg;
  error;
  fileDeleted = false;
  deletedFileName;
  sidebar;
  countData = { data: null, error: null };
  loader = false;

  constructor(
    public transmissionService: TransmissionService,
    private orderPipe: OrderPipe,
    private activatedRoute: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.loader = true;
    this.sidebar = this.transmissionService.settingsSidebar;
    const { data, error } = this.activatedRoute.snapshot.data.data as any;
    if (error) {
      this.loader = false;
      return (this.error = error);
    }
    if (!data.files) return;
    this.countData.data = data.setting;
    this.auditFiles = this.collection = data.files;
    this.sortedCollection = this.orderPipe.transform(this.collection, 'uploaddate');

    this.loader = false;
  }

  async getFile(file) {
    const fileName = `${file.uploaduser}$$$${file.userrole}$$$${file.uploaddate}$$$${file.filename}`;
    try {
      const response = (await this.transmissionService.getAuditFileData(fileName)) as any;
      this.saveFile(response, file.filename);
    } catch (err) {}
  }

  saveFile(data, fileName) {
    const a = document.createElement('a') as any;
    document.body.appendChild(a);
    a.style = 'display: none';
    const blob = new Blob([data], { type: 'octet/stream' });
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }
  async deleteFile(file) {
    const fileName = `${file.uploaduser}$$$${file.userrole}$$$${file.uploaddate}$$$${file.filename}`;
    this.deletedFileName = file.filename;
    const { data } = (await this.transmissionService.removeAuditFile(fileName)) as any;
    if (data.success) {
      this.auditFiles = this.auditFiles.filter(d => d.id !== file.id);
      this.auditFiles = this.collection = this.auditFiles;
      this.sortedCollection = this.orderPipe.transform(this.collection, 'uploaddate');
      this.fileDeleted = true;
    }
    setTimeout(() => {
      this.fileDeleted = false;
      this.deletedFileName = '';
    }, 2500);
  }
  async deleteAll() {
    const { data } = (await this.transmissionService.removeAllAuditFile()) as any;
    if (data.success) {
      this.auditFiles = [];
      this.auditFiles = this.collection = this.auditFiles;
      this.sortedCollection = this.orderPipe.transform(this.collection, 'uploaddate');
      this.fileDeleted = true;
    }
    setTimeout(() => (this.fileDeleted = false), 2000);
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  countItems(pno) {
    return (this.count = (pno - 1) * this.itemsPerPage);
  }

  getCount(obj: string) {
    return `${obj.toLowerCase().replace(' ', '-')}`;
  }
}
