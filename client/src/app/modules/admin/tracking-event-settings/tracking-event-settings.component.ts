import { Component, OnInit } from '@angular/core';
import { TransmissionService } from './../../../services/transmission.service';
import { AdminService } from './../../../services/admin.service';

@Component({
  selector: 'app-tracking-event-settings',
  templateUrl: './tracking-event-settings.component.html',
  styleUrls: ['./tracking-event-settings.component.scss']
})
export class TrackingEventSettingsComponent implements OnInit {
  constructor(public adminService: AdminService, public transmissionService: TransmissionService) {}
  trackingEventProps = [];
  newTrackingEventProps = [];
  showLoader = false;
  filters = [];
  count = 0;
  itemsPerPage = 12;
  error;
  data = [];

  async ngOnInit() {
    if (this.transmissionService.TrackingEvent.length) {
      this.data = this.transmissionService.TrackingEvent;
    } else {
      this.showLoader = true;
      const { data, error } = (await this.transmissionService.getTrackingEvent()) as any;
      this.data = data;
      if (error) {
        this.showLoader = false;
        return (this.error = error);
      }
      this.transmissionService.TrackingEvent = this.data;
    }
    this.transmissionService.displayTrackingEvent = this.data.filter(d => d.display);
    this.newTrackingEventProps = this.adminService.trackingEventProps = [...this.data];
    const filteredtype = new Set(this.data.map(d => d.type));
    this.filters = Array.from(filteredtype);
    this.showLoader = false;
  }

  countItems(pno) {
    return (this.count = (pno - 1) * this.itemsPerPage);
  }

  filterItems(filter) {
    this.adminService.trackingEventProps = this.newTrackingEventProps.filter(d => d.type === filter);
  }

  onSearch(term) {
    this.adminService.trackingEventProps = this.newTrackingEventProps.filter(d =>
      d.name.toUpperCase().includes(term.toUpperCase())
    );
  }

  async onChange(trackingEvent) {
    const { data } = (await this.transmissionService.updateTrackingEvent(trackingEvent)) as any;
    const i = this.transmissionService.TrackingEvent.findIndex(d => d._id === trackingEvent._id);
    this.transmissionService.TrackingEvent[i] = data;
    this.transmissionService.displayTrackingEvent = this.transmissionService.TrackingEvent.filter(d => d.display);
  }
}
