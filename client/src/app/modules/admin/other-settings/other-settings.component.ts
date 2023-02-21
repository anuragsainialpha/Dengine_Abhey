import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TransmissionService } from './../../../services/transmission.service';

@Component({
  selector: 'app-other-settings',
  templateUrl: './other-settings.component.html',
  styleUrls: ['./other-settings.component.scss']
})
export class OtherSettingsComponent implements OnInit {
  constructor(public transmissionService: TransmissionService, private activatedRoute: ActivatedRoute) {}
  loading = false;
  error;
  count;
  data;
  sidebar = [];

  async ngOnInit() {
    this.sidebar = this.transmissionService.settingsSidebar;
    const { data, error } = this.activatedRoute.snapshot.data.data as any;
    this.data = data;
    if (error) return (this.error = error);
    this.transmissionService.setting = data;
  }

  async onSubmit() {
    this.loading = true;
    const { data } = (await this.transmissionService.updateSettings(this.transmissionService.setting)) as any;
    this.transmissionService.setting = data;
    this.loading = false;
  }

  getCount(obj) {
    return `${this.transmissionService.userDetails.instance}_${obj.toLowerCase()}`;
  }
}
