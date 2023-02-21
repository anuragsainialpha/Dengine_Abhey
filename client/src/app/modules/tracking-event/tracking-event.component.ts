import { TransmissionService } from '../../services/transmission.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TrackingEventService } from '../../services/tracking-event.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tracking-event',
  templateUrl: './tracking-event.component.html',
  styleUrls: ['./tracking-event.component.scss']
})
export class TrackingEventComponent implements OnInit {
  @ViewChild('fileInput') myInputVariable: ElementRef;
  isAdminTab = false;
  error;
  constructor(
    public trackingEventService: TrackingEventService,
    public transmissionService: TransmissionService,
    private activatedRoute: ActivatedRoute
  ) {}

  async ngOnInit() {
    const { data, error } = this.activatedRoute.snapshot.data.data as any;
    if (error) return (this.error = error);
    this.trackingEventService.ElementList = data.filter(d => this.getElement(d));
    this.trackingEventService.dragdropList = this.trackingEventService.ElementList.filter(d => d.required);
    this.trackingEventService.dragdropListTc = data.filter(d => d.required);
  }

  getElement(d) {
    return this.transmissionService.getElement(d);
  }
}
