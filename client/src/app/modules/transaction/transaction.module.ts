import { NgModule } from '@angular/core';
import { TransactionComponent } from './transaction.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared.module';
import { TransactionService } from '../../services/transaction.service';
const TransactionRoutes: Routes = [{ path: '', component: TransactionComponent }];
@NgModule({
  declarations: [TransactionComponent],
  imports: [SharedModule, RouterModule.forChild(TransactionRoutes)],
  providers: [TransactionService],
})
export class TransactionModule {}
