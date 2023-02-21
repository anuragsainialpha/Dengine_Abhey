import { Component, OnInit } from '@angular/core';
import { TransmissionService } from './../../../services/transmission.service';
import { AdminService } from './../../../services/admin.service';

@Component({
  selector: 'app-shipment-settings',
  templateUrl: './shipment-settings.component.html',
  styleUrls: ['./shipment-settings.component.scss']
})
export class ShipmentSettingsComponent implements OnInit {
  constructor(public adminService: AdminService, public transmissionService: TransmissionService) {}
  shipmentProps = [];
  newShipmentProps = [];
  showLoader = false;
  filters = [];
  count = 0;
  itemsPerPage = 12;
  error;
  data = [];

  async ngOnInit() {
    if (this.transmissionService.Shipment.length) {
      this.data = this.transmissionService.Shipment;
    } else {
      this.showLoader = true;
      const { data, error } = (await this.transmissionService.getShipment()) as any;
      this.data = data;
      if (error) {
        this.showLoader = false;
        return (this.error = error);
      }
      this.transmissionService.Shipment = this.data;
    }
    this.transmissionService.displayShipment = this.data.filter(d => d.display);
    this.newShipmentProps = this.adminService.shipmentProps = [...this.data];
    const filteredtype = new Set(this.data.map(d => d.type));
    this.filters = Array.from(filteredtype);
    this.showLoader = false;
  }

  countItems(pno) {
    return (this.count = (pno - 1) * this.itemsPerPage);
  }

  filterItems(filter) {
    this.adminService.shipmentProps = this.newShipmentProps.filter(d => d.type === filter);
  }

  onSearch(term) {
    this.adminService.shipmentProps = this.newShipmentProps.filter(d =>
      d.name.toUpperCase().includes(term.toUpperCase())
    );
  }

  async onChange(shipment) {
    const { data } = (await this.transmissionService.updateShipment(shipment)) as any;
    const i = this.transmissionService.Shipment.findIndex(d => d._id === shipment._id);
    this.transmissionService.Shipment[i] = data;
    this.transmissionService.displayShipment = this.transmissionService.Shipment.filter(d => d.display);
  }
}
