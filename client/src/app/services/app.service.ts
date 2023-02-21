import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AppService {
  sidebarMenu = [];
  constructor(private httpClient: HttpClient) { }
  public getSidebarMenu() {
    this.httpClient.get('http://localhost:3000/sidebar').subscribe((d: any[]) => this.sidebarMenu = d);
  }
}
