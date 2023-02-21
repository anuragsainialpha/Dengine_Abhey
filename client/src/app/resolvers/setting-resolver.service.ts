import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { TransmissionService } from '../services/transmission.service';

@Injectable({
  providedIn: 'root'
})
export class SettingResolverService implements Resolve<any> {
  constructor(private transmissionService: TransmissionService) {}
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Observable<any> | Promise<any> | any> {
    const { setting } = this.transmissionService;
    if (setting) return { data: setting };
    const { data, error } = (await this.transmissionService.getSettings()) as any;
    this.transmissionService.setting = data;
    return { data, error };
  }
}
