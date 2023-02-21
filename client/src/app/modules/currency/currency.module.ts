import { NgModule } from '@angular/core';
import { CurrencyComponent } from './currency.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared.module';
const CurrencyRoutes: Routes = [{ path: '', component: CurrencyComponent }];
@NgModule({
  declarations: [CurrencyComponent],
  imports: [RouterModule.forChild(CurrencyRoutes), SharedModule]
})
export class CurrencyModule {}
