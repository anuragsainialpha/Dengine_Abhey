import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { TransmissionService } from '../services/transmission.service';

@Injectable({
  providedIn: 'root',
})
export class ShipmentResolverService implements Resolve<any> {
  constructor(private transmissionService: TransmissionService) {}
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Observable<any> | Promise<any> | any> {
    const { Shipment, displayShipment } = this.transmissionService;
    if (displayShipment.length) return { data: displayShipment };
    if (Shipment.length) {
      this.transmissionService.displayShipment = Shipment.filter(d => d.display);
      if (displayShipment.length) return { data: displayShipment };
    }
    const { data, error } = (await this.transmissionService.getDisplayShipment()) as any;
    this.transmissionService.displayShipment = data;
    return { data, error };
  }
}
