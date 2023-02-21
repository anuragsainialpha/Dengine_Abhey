import { Component, OnInit } from '@angular/core';
import { TransmissionService } from './../../../services/transmission.service';
import { AdminService } from './../../../services/admin.service';

@Component({
  selector: 'app-party-settings',
  templateUrl: './party-settings.component.html',
  styleUrls: ['./party-settings.component.scss']
})
export class PartySettingsComponent implements OnInit {
  constructor(public adminService: AdminService, public transmissionService: TransmissionService) {}
  partyProps = [];
  newPartyProps = [];
  showLoader = false;
  filters = [];
  count = 0;
  itemsPerPage = 12;
  error;
  data = [];

  async ngOnInit() {
    if (this.transmissionService.Party.length) {
      this.data = this.transmissionService.Party;
    } else {
      this.showLoader = true;
      const { data, error } = (await this.transmissionService.getParty()) as any;
      this.data = data;
      if (error) {
        this.showLoader = false;
        return (this.error = error);
      }
      this.transmissionService.Party = this.data;
    }
    this.transmissionService.displayParty = this.data.filter(d => d.display);
    this.newPartyProps = this.adminService.partyProps = [...this.data];
    const filteredtype = new Set(this.data.map(d => d.type));
    this.filters = Array.from(filteredtype);
    this.showLoader = false;
  }

  countItems(pno) {
    return (this.count = (pno - 1) * this.itemsPerPage);
  }

  filterItems(filter) {
    this.adminService.partyProps = this.newPartyProps.filter(d => d.type === filter);
  }

  onSearch(term) {
    this.adminService.partyProps = this.newPartyProps.filter(d => d.name.toUpperCase().includes(term.toUpperCase()));
  }

  async onChange(party) {
    const { data } = (await this.transmissionService.updateParty(party)) as any;
    const i = this.transmissionService.Party.findIndex(d => d._id === party._id);
    this.transmissionService.Party[i] = data;
    this.transmissionService.displayParty = this.transmissionService.Party.filter(d => d.display);
  }
}
