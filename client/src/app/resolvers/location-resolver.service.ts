import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { TransmissionService } from '../services/transmission.service';

@Injectable({
  providedIn: 'root',
})
export class LocationResolverService implements Resolve<any> {
  constructor(private transmissionService: TransmissionService) {}
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Observable<any> | Promise<any> | any> {
    const { displayLocation, Location } = this.transmissionService;
    if (displayLocation.length) return { data: displayLocation };
    if (Location.length) {
      this.transmissionService.displayLocation = Location.filter(d => d.display);
      if (displayLocation.length) return { data: displayLocation };
    }
    const { data, error } = (await this.transmissionService.getDisplayLocation()) as any;
    this.transmissionService.displayLocation = data;
    return { data, error };
  }
}
