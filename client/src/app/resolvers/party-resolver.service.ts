import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { TransmissionService } from '../services/transmission.service';

@Injectable({
  providedIn: 'root',
})
export class PartyResolverService implements Resolve<any> {
  constructor(private transmissionService: TransmissionService) {}
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Observable<any> | Promise<any> | any> {
    const { displayParty, Party } = this.transmissionService;
    if (displayParty.length) return { data: displayParty };
    if (Party.length) {
      this.transmissionService.displayParty = Party.filter(d => d.display);
      if (displayParty.length) return { data: displayParty };
    }
    const { data, error } = (await this.transmissionService.getDisplayParty()) as any;
    this.transmissionService.displayParty = data;
    return { data, error };
  }
}
