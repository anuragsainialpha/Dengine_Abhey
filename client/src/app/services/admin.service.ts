import { TransmissionService } from './transmission.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  public itemProps = [];
  public releaseProps = [];
  public locationProps = [];
  public partyProps = [];
  public transactionProps = [];
  public orderBaseProps = [];
  public trackingEventProps = [];
  public shipmentProps = [];

  constructor(private httpClient: HttpClient, public transmissionService: TransmissionService) {}

  async readFile(event) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    return await new Response(file).text();
  }
}
