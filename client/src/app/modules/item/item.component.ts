import { TransmissionService } from '../../services/transmission.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ItemService } from '../../services/item.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnInit {
  @ViewChild('fileInput') myInputVariable: ElementRef;
  isAdminTab = false;
  error;
  constructor(
    public itemService: ItemService,
    public transmissionService: TransmissionService,
    private activatedRoute: ActivatedRoute
  ) {}

  async ngOnInit() {
    const { data, error } = this.activatedRoute.snapshot.data.data as any;
    if (error) return (this.error = error);
    this.itemService.ElementList = data.filter((d) => this.getElement(d));
    this.itemService.dragdropList = this.itemService.ElementList.filter((d) => d.required);
    this.itemService.dragdropListTc = data.filter((d) => d.required);
  }

  getElement(d) {
    return this.transmissionService.getElement(d);
  }
}
