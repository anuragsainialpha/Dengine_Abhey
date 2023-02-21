import { TransmissionService } from './../../../services/transmission.service';
import { AdminService } from './../../../services/admin.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transaction-settings',
  templateUrl: './transaction-settings.component.html',
  styleUrls: ['./transaction-settings.component.scss'],
})
export class TransactionSettingsComponent implements OnInit {
  constructor(public adminService: AdminService, public transmissionService: TransmissionService) {}
  transactionProps = [];
  newTransactionProps = [];
  showLoader = false;
  filters = [];
  count = 0;
  itemsPerPage = 12;
  error;
  data = [];

  async ngOnInit() {
    if (this.transmissionService.Transaction.length) {
      this.data = this.transmissionService.Transaction;
    } else {
      this.showLoader = true;
      const { data, error } = (await this.transmissionService.getTransaction()) as any;
      this.data = data;
      if (error) {
        this.showLoader = false;
        return (this.error = error);
      }
      this.transmissionService.Transaction = this.data;
    }
    this.transmissionService.displayTransaction = this.data.filter((d) => d.display);
    this.newTransactionProps = this.adminService.transactionProps = [...this.data];
    const filteredtype = new Set(this.data.map((d) => d.type));
    this.filters = Array.from(filteredtype);
    this.showLoader = false;
  }

  countItems(pno) {
    return (this.count = (pno - 1) * this.itemsPerPage);
  }

  filterItems(filter) {
    this.adminService.transactionProps = this.newTransactionProps.filter((d) => d.type === filter);
  }

  onSearch(term) {
    this.adminService.transactionProps = this.newTransactionProps.filter((d) =>
      d.name.toUpperCase().includes(term.toUpperCase())
    );
  }

  async onChange(transaction) {
    const { data } = (await this.transmissionService.updateTransaction(transaction)) as any;
    const i = this.transmissionService.Transaction.findIndex((d) => d._id === transaction._id);
    this.transmissionService.Transaction[i] = data;
    this.transmissionService.displayTransaction = this.transmissionService.Transaction.filter((d) => d.display);
  }
}
