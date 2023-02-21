import { Component, OnInit } from '@angular/core';
import { TransmissionService } from './../../../services/transmission.service';
import { AdminService } from './../../../services/admin.service';

@Component({
  selector: 'app-order-base-settings',
  templateUrl: './order-base-settings.component.html',
  styleUrls: ['./order-base-settings.component.scss']
})
export class OrderBaseSettingsComponent implements OnInit {
  constructor(public adminService: AdminService, public transmissionService: TransmissionService) {}
  orderBaseProps = [];
  newOrderBaseProps = [];
  showLoader = false;
  filters = [];
  count = 0;
  itemsPerPage = 12;
  error;
  data = [];

  async ngOnInit() {
    if (this.transmissionService.OrderBase.length) {
      this.data = this.transmissionService.OrderBase;
    } else {
      this.showLoader = true;
      const { data, error } = (await this.transmissionService.getOrderBase()) as any;
      this.data = data;
      if (error) {
        this.showLoader = false;
        return (this.error = error);
      }
      this.transmissionService.OrderBase = this.data;
    }
    this.transmissionService.displayOrderBase = this.data.filter(d => d.display);
    this.newOrderBaseProps = this.adminService.orderBaseProps = [...this.data];
    const filteredtype = new Set(this.data.map(d => d.type));
    this.filters = Array.from(filteredtype);
    this.showLoader = false;
  }

  countItems(pno) {
    return (this.count = (pno - 1) * this.itemsPerPage);
  }

  filterItems(filter) {
    this.adminService.orderBaseProps = this.newOrderBaseProps.filter(d => d.type === filter);
  }

  onSearch(term) {
    this.adminService.orderBaseProps = this.newOrderBaseProps.filter(d =>
      d.name.toUpperCase().includes(term.toUpperCase())
    );
  }

  async onChange(orderBase) {
    const { data } = (await this.transmissionService.updateOrderBase(orderBase)) as any;
    const i = this.transmissionService.OrderBase.findIndex(d => d._id === orderBase._id);
    this.transmissionService.OrderBase[i] = data;
    this.transmissionService.displayOrderBase = this.transmissionService.OrderBase.filter(d => d.display);
  }
}
