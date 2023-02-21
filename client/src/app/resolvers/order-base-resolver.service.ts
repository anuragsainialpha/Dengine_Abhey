import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { TransmissionService } from '../services/transmission.service';

@Injectable({
  providedIn: 'root'
})
export class OrderBaseResolverService implements Resolve<any> {
  constructor(private transmissionService: TransmissionService) {}
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Observable<any> | Promise<any> | any> {
    const { displayOrderBase, OrderBase } = this.transmissionService;
    if (displayOrderBase.length) return { data: displayOrderBase };
    if (OrderBase.length) {
      this.transmissionService.displayOrderBase = OrderBase.filter(d => d.display);
      if (displayOrderBase.length) return { data: displayOrderBase };
    }
    const { data, error } = (await this.transmissionService.getDisplayOrderBase()) as any;
    this.transmissionService.displayOrderBase = data;
    return { data, error };
  }
}
