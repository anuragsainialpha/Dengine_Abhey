import { Component, OnInit } from '@angular/core';
import { TransmissionService } from './../../../services/transmission.service';
import { AdminService } from './../../../services/admin.service';

@Component({
  selector: 'app-order-release-settings',
  templateUrl: './order-release-settings.component.html',
  styleUrls: ['./order-release-settings.component.scss']
})
export class OrderReleaseSettingsComponent implements OnInit {
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
    if (this.transmissionService.Release.length) {
      this.data = this.transmissionService.Release;
    } else {
      this.showLoader = true;
      const { data, error } = (await this.transmissionService.getRelease()) as any;
      this.data = data;
      if (error) {
        this.showLoader = false;
        return (this.error = error);
      }
      this.transmissionService.Release = this.data;
    }
    this.transmissionService.displayRelease = this.data.filter(d => d.display);
    this.newItemProps = this.adminService.releaseProps = [...this.data];
    const filteredtype = new Set(this.data.map(d => d.type));
    this.filters = Array.from(filteredtype);
    this.showLoader = false;
  }

  countItems(pno) {
    return (this.count = (pno - 1) * this.itemsPerPage);
  }

  filterItems(filter) {
    this.adminService.releaseProps = this.newItemProps.filter(d => d.type === filter);
  }

  onSearch(term) {
    this.adminService.releaseProps = this.newItemProps.filter(d => d.name.toUpperCase().includes(term.toUpperCase()));
  }

  async onChange(item) {
    const { data } = (await this.transmissionService.updateRelease(item)) as any;
    const i = this.transmissionService.Release.findIndex(d => d._id === item._id);
    this.transmissionService.Release[i] = data;
    this.transmissionService.displayRelease = this.transmissionService.Release.filter(d => d.display);
  }
}
