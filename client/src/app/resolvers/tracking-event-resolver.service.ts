import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { TransmissionService } from '../services/transmission.service';

@Injectable({
  providedIn: 'root'
})
export class TrackingEventResolverService implements Resolve<any> {
  constructor(private transmissionService: TransmissionService) {}
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Observable<any> | Promise<any> | any> {
    const { displayTrackingEvent, TrackingEvent } = this.transmissionService;
    if (displayTrackingEvent.length) return { data: displayTrackingEvent };
    if (TrackingEvent.length) {
      this.transmissionService.displayTrackingEvent = TrackingEvent.filter(d => d.display);
      if (displayTrackingEvent.length) return { data: displayTrackingEvent };
    }
    const { data, error } = (await this.transmissionService.getDisplayTrackingEvent()) as any;
    this.transmissionService.displayTrackingEvent = data;
    return { data, error };
  }
}