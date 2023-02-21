import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TransmissionService } from './../../../services/transmission.service';
import { AdminService } from './../../../services/admin.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  constructor(public adminService: AdminService, public transmissionService: TransmissionService) {}
  @Input() newItemProps;
  @Input() elements;
  @Input() showLoader;
  @Input() filters;
  @Input() count;
  @Input() itemsPerPage;
  @Output() parentcountItems = new EventEmitter<any>();
  @Output() parentfilterItems = new EventEmitter<any>();
  @Output() parentonSearch = new EventEmitter<any>();
  @Output() parentonChange = new EventEmitter<any>();
  p;

  async ngOnInit() {
    if (!this.showLoader) {
      this.showLoader = true;
      setTimeout(() => (this.showLoader = false), 500);
    }
  }

  countItems(pno) {
    this.parentcountItems.emit(pno);
  }

  filterItems(op) {
    if (op.selected && op.selected.value) this.parentfilterItems.emit(op.selected.value);
  }

  onSearch(term) {
    this.parentonSearch.emit(term);
  }

  onChange(item) {
    this.parentonChange.emit(item);
  }
}
