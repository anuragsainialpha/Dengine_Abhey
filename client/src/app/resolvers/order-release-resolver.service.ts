import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { TransmissionService } from '../services/transmission.service';

@Injectable({
  providedIn: 'root',
})
export class OrderReleaseResolverService implements Resolve<any> {
  constructor(private transmissionService: TransmissionService) {}
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Observable<any> | Promise<any> | any> {
    const { displayRelease, Release } = this.transmissionService;
    if (displayRelease.length) return { data: displayRelease };
    if (Release.length) {
      this.transmissionService.displayRelease = Release.filter(d => d.display);
      if (displayRelease.length) return { data: displayRelease };
    }
    const { data, error } = (await this.transmissionService.getDisplayRelease()) as any;
    this.transmissionService.displayRelease = data;
    return { data, error };
  }
}
