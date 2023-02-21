import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { TransmissionService } from '../services/transmission.service';

@Injectable({
  providedIn: 'root',
})
export class ItemResolverService implements Resolve<any> {
  constructor(private transmissionService: TransmissionService) {}
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Observable<any> | Promise<any> | any> {
    const { displayItem, Item } = this.transmissionService;
    if (displayItem.length) return { data: displayItem };
    if (Item.length) {
      this.transmissionService.displayItem = Item.filter(d => d.display);
      if (displayItem.length) return { data: displayItem };
    }
    const { data, error } = (await this.transmissionService.getDisplayItem()) as any;
    this.transmissionService.displayItem = data;
    return { data, error };
  }
}
