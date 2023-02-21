import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { TransmissionService } from '../services/transmission.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardResolverService implements Resolve<any> {
  constructor(private transmissionService: TransmissionService) {}
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Observable<any> | Promise<any> | any> {
    const { userDetails } = this.transmissionService;
    if (userDetails.sidebar.length) return { data: userDetails.sidebar };
    return { error: 'Unauthenticated' };
  }
}
