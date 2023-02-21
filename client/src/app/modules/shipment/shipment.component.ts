import { ShipmentService } from '../../services/shipment.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TransmissionService } from '../../services/transmission.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shipment',
  templateUrl: './shipment.component.html',
  styleUrls: ['./shipment.component.scss']
})
export class ShipmentComponent implements OnInit {
  @ViewChild('fileInput') myInputVariable: ElementRef;
  isAdminTab = false;
  error;
  constructor(
    public itemService: ShipmentService,
    public transmissionService: TransmissionService,
    private activatedRoute: ActivatedRoute
  ) {}

  async ngOnInit() {
    const { data, error } = this.activatedRoute.snapshot.data.data as any;
    if (error) return (this.error = error);
    this.itemService.ElementList = data.filter(d => this.getElement(d));
    this.transmissionService.displayShipment = data;
    this.itemService.dragdropList = this.itemService.ElementList.filter(d => d.required);
    this.itemService.dragdropListTc = data.filter(d => d.required);

    this.itemService.releaseElementList = data.filter(d => this.getReleaseElement(d));
    this.itemService.lineElementList = data.filter(d => this.getLineElement(d));

    this.itemService.releasedragdropList = this.itemService.releaseElementList.filter(d => d.display && d.required);
    this.itemService.linedragdropList = this.itemService.lineElementList.filter(d => d.display && d.required);
  }

  getElement(d) {
    return this.transmissionService.getElement(d);
  }
  getReleaseElement(d) {
    if (d.path.length > 1) return !d.type.includes('Stop') && d.display;
    if (d.display && this.transmissionService.getElement(d)) return !d.type.includes('Stop') && d.display;
    return false;
  }
  getLineElement(d) {
    if (d.path.length > 1) return d.display && d.type.includes('Stop');
    if (d.display && this.transmissionService.getElement(d)) return d.display && d.type.includes('Stop');
    return false;
  }
}
