import { TransmissionService } from '../../services/transmission.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LocationService } from '../../services/location.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
  @ViewChild('fileInput') myInputVariable: ElementRef;
  isAdminTab = false;
  error;
  constructor(
    public locationService: LocationService,
    public transmissionService: TransmissionService,
    private activatedRoute: ActivatedRoute
  ) {}

  async ngOnInit() {
    const { data, error } = this.activatedRoute.snapshot.data.data as any;
    if (error) return (this.error = error);
    this.locationService.ElementList = data.filter(d => this.getElement(d));
    this.locationService.dragdropList = this.locationService.ElementList.filter(d => d.required);
    this.locationService.dragdropListTc = data.filter(d => d.required);
  }

  getElement(d) {
    return this.transmissionService.getElement(d);
  }
}
