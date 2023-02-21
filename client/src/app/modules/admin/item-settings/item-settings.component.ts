import { AdminService } from './../../../services/admin.service';
import { TransmissionService } from './../../../services/transmission.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-item-settings',
  templateUrl: './item-settings.component.html',
  styleUrls: ['./item-settings.component.scss']
})
export class ItemSettingsComponent implements OnInit {
  constructor(public adminService: AdminService, public transmissionService: TransmissionService) {}
  itemProps = [];
  newItemProps = [];
  showLoader = false;
  filters = [];
  count = 0;
  itemsPerPage = 12;
  error;
  data = [];

  async ngOnInit() {
    if (this.transmissionService.Item.length) {
      this.data = this.transmissionService.Item;
    } else {
      this.showLoader = true;
      const { data, error } = (await this.transmissionService.getItem()) as any;
      this.data = data;
      if (error) {
        this.showLoader = false;
        return (this.error = error);
      }
      this.transmissionService.Item = this.data;
    }
    this.transmissionService.displayItem = this.data.filter(d => d.display);
    this.newItemProps = this.adminService.itemProps = [...this.data];
    const filteredtype = new Set(this.data.map(d => d.type));
    this.filters = Array.from(filteredtype);
    this.showLoader = false;
  }

  countItems(pno) {
    return (this.count = (pno - 1) * this.itemsPerPage);
  }

  filterItems(filter) {
    this.adminService.itemProps = this.newItemProps.filter(d => d.type === filter);
  }

  onSearch(term) {
    this.adminService.itemProps = this.newItemProps.filter(d => d.name.toUpperCase().includes(term.toUpperCase()));
  }

  async onChange(item) {
    const { data } = (await this.transmissionService.updateItem(item)) as any;
    const i = this.transmissionService.Item.findIndex(d => d._id === item._id);
    this.transmissionService.Item[i] = data;
    this.transmissionService.displayItem = this.transmissionService.Item.filter(d => d.display);
  }
}
