import { LocationService } from './../../services/location.service';
import { NgModule } from '@angular/core';
import { LocationComponent } from './location.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared.module';

const LocationRoutes: Routes = [{ path: '', component: LocationComponent }];

@NgModule({
  declarations: [LocationComponent],
  imports: [RouterModule.forChild(LocationRoutes), SharedModule],
  providers: [LocationService]
})
export class LocationModule {}
