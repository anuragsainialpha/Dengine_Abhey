import { NgModule } from '@angular/core';
import { DistanceTimeComponent } from './distance-time.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared.module';
const DisatnceTimeRoutes: Routes = [{ path: '', component: DistanceTimeComponent }];
@NgModule({
  declarations: [DistanceTimeComponent],
  imports: [RouterModule.forChild(DisatnceTimeRoutes), SharedModule]
})
export class DistanceTimeModule {}
