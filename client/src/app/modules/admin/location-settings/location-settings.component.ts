import { AdminService } from './../../../services/admin.service';
import { TransmissionService } from './../../../services/transmission.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-location-settings',
  templateUrl: './location-settings.component.html',
  styleUrls: ['./location-settings.component.scss']
})
export class LocationSettingsComponent implements OnInit {
  constructor(public adminService: AdminService, public transmissionService: TransmissionService) {}
  locationProps = [];
  newLocationProps = [];
  showLoader = false;
  filters = [];
  count = 0;
  itemsPerPage = 12;
  error;
  data = [];

  async ngOnInit() {
    if (this.transmissionService.Location.length) {
      this.data = this.transmissionService.Location;
    } else {
      this.showLoader = true;
      const { data, error } = (await this.transmissionService.getLocation()) as any;
      this.data = data;
      if (error) {
        this.showLoader = false;
        return (this.error = error);
      }
      this.transmissionService.Location = this.data;
    }
    this.transmissionService.displayLocation = this.data.filter(d => d.display);
    this.newLocationProps = this.adminService.locationProps = [...this.data];
    const filteredtype = new Set(this.data.map(d => d.type));
    this.filters = Array.from(filteredtype);
    this.showLoader = false;
  }

  countItems(pno) {
    return (this.count = (pno - 1) * this.itemsPerPage);
  }

  filterItems(filter) {
    this.adminService.locationProps = this.newLocationProps.filter(d => d.type === filter);
  }

  onSearch(term) {
    this.adminService.locationProps = this.newLocationProps.filter(d =>
      d.name.toUpperCase().includes(term.toUpperCase())
    );
  }

  async onChange(location) {
    const { data } = (await this.transmissionService.updateLocation(location)) as any;
    const i = this.transmissionService.Location.findIndex(d => d._id === location._id);
    this.transmissionService.Location[i] = data;
    this.transmissionService.displayLocation = this.transmissionService.Location.filter(d => d.display);
  }
}
