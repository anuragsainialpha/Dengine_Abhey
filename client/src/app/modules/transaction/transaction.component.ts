import { TransactionService } from '../../services/transaction.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TransmissionService } from '../../services/transmission.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent implements OnInit {
  @ViewChild('fileInput') myInputVariable: ElementRef;
  isAdminTab = false;
  error;
  constructor(
    public itemService: TransactionService,
    public transmissionService: TransmissionService,
    private activatedRoute: ActivatedRoute
  ) {}

  async ngOnInit() {
    const { data, error } = this.activatedRoute.snapshot.data.data as any;
    if (error) return (this.error = error);
    this.itemService.ElementList = data.filter((d) => this.getElement(d));
    this.transmissionService.displayTransaction = data;
    this.itemService.dragdropList = this.itemService.ElementList.filter((d) => d.required);
    this.itemService.dragdropListTc = data.filter((d) => d.required);

    this.itemService.releaseElementList = data.filter((d) => this.getReleaseElement(d));
    this.itemService.lineElementList = data.filter((d) => this.getLineElement(d));

    this.itemService.releasedragdropList = this.itemService.releaseElementList.filter((d) => d.display && d.required);
    this.itemService.linedragdropList = this.itemService.lineElementList.filter((d) => d.display && d.required);
  }

  getElement(d) {
    return this.transmissionService.getElement(d);
  }
  getReleaseElement(d) {
    if (d.path.length > 1) return !d.type.includes('Transaction Line') && d.display;
    if (d.display && this.transmissionService.getElement(d)) return !d.type.includes('Transaction Line') && d.display;
    return false;
  }
  getLineElement(d) {
    if (d.path.length > 1) return d.display && d.type.includes('Transaction Line');
    if (d.display && this.transmissionService.getElement(d)) return d.display && d.type.includes('Transaction Line');
    return false;
  }
}
