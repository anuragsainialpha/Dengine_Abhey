import { NgModule } from '@angular/core';
import { LatLonComponent } from './lat-lon.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared.module';
const LatLonRoutes: Routes = [{ path: '', component: LatLonComponent }];
@NgModule({
  declarations: [LatLonComponent],
  imports: [RouterModule.forChild(LatLonRoutes), SharedModule]
})
export class LatLonModule {}
