import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { TransmissionService } from '../services/transmission.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionResolverService implements Resolve<any> {
  constructor(private transmissionService: TransmissionService) {}
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Observable<any> | Promise<any> | any> {
    const { Transaction, displayTransaction } = this.transmissionService;
    if (displayTransaction.length) return { data: displayTransaction };
    if (Transaction.length) {
      this.transmissionService.displayTransaction = Transaction.filter(d => d.display);
      if (displayTransaction.length) return { data: displayTransaction };
    }
    const { data, error } = (await this.transmissionService.getDisplayTransaction()) as any;
    this.transmissionService.displayTransaction = data;
    return { data, error };
  }
}
