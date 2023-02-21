import { ShipmentService } from './../../services/shipment.service';
import { NgModule } from '@angular/core';
import { ShipmentComponent } from './shipment.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared.module';
const ShipmentRoutes: Routes = [{ path: '', component: ShipmentComponent }];
@NgModule({
  declarations: [ShipmentComponent],
  imports: [RouterModule.forChild(ShipmentRoutes), SharedModule],
  providers: [ShipmentService]
})
export class ShipmentModule {}
