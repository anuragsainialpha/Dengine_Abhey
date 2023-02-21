import { TransmissionService } from './../../services/transmission.service';
import { Component, OnInit } from '@angular/core';
import { Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-shared-tab',
  templateUrl: './shared-tab.component.html',
  styleUrls: ['./shared-tab.component.scss']
})
export class SharedTabComponent implements OnInit {
  @Input() itemService;
  @Input() tabTitle;
  // By default
  @Input() tabTitleExtension = 'Line';
  @Input() hasChild = false;
  @Input() showMessage: boolean;
  @Input() isAdminTab: boolean;
  @ViewChild('fileInput') myInputVariable: ElementRef;
  @ViewChild('refresh') refreshBtn: ElementRef;
  count = 0;
  itemsPerPage = 9;
  pg;

  constructor(public transmissionService: TransmissionService) {}

  ngOnInit() {}

  countItems(pno) {
    return (this.count = (pno - 1) * this.itemsPerPage);
  }

  onUpload(InputFileEvent) {
    this.itemService.onUpload(InputFileEvent);
    this.myInputVariable.nativeElement.value = '';
  }

  openNewWindow(url, width = 768, height = 400) {
    const leftPosition = window.screen.width / 2 - (width / 2 + 10);
    const topPosition = window.screen.height / 2 - (height / 2 + 50);
    window.open(
      url,
      'Window2',
      'status=no,height=' +
        height +
        ',width=' +
        width +
        ',resizable=yes,left=' +
        leftPosition +
        ',top=' +
        topPosition +
        ',screenX=' +
        leftPosition +
        ',screenY=' +
        topPosition +
        ',toolbar=no,menubar=no,scrollbars=no,location=no,directories=no'
    );
  }
}
