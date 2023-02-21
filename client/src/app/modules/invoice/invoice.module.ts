import { NgModule } from '@angular/core';
import { InvoiceComponent } from './invoice.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared.module';
const InvoiceRoutes: Routes = [{ path: '', component: InvoiceComponent }];
@NgModule({
  declarations: [InvoiceComponent],
  imports: [RouterModule.forChild(InvoiceRoutes), SharedModule]
})
export class InvoiceModule {}
