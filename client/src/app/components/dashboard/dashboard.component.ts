import { TransmissionService } from './../../services/transmission.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  sidebar = [];
  error;
  constructor(public transmissionService: TransmissionService, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    const { data, error } = this.activatedRoute.snapshot.data.data as any;
    this.sidebar = data;
    if (error) return (this.error = error);
  }
}
