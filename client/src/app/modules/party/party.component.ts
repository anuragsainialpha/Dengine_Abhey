import { TransmissionService } from '../../services/transmission.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PartyService } from '../../services/party.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-party',
  templateUrl: './party.component.html',
  styleUrls: ['./party.component.scss']
})
export class PartyComponent implements OnInit {
  @ViewChild('fileInput') myInputVariable: ElementRef;
  isAdminTab = false;
  error;
  constructor(public partyService: PartyService, public transmissionService: TransmissionService, private activatedRoute: ActivatedRoute) {}

  async ngOnInit() {
    const { data, error } = this.activatedRoute.snapshot.data.data as any;
    if (error) return (this.error = error);
    this.partyService.ElementList = data.filter(d => this.getElement(d));
    this.partyService.dragdropList = this.partyService.ElementList.filter(d => d.required);
    this.partyService.dragdropListTc = data.filter(d => d.required);
  }

  getElement(d) {
    return this.transmissionService.getElement(d);
  }
}
