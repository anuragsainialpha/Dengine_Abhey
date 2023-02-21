import { NgModule } from '@angular/core';
import { BomComponent } from './bom.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared.module';

const BomRoutes: Routes = [{ path: '', component: BomComponent }];
@NgModule({
  declarations: [BomComponent],
  imports: [RouterModule.forChild(BomRoutes), SharedModule]
})
export class BomModule {}
