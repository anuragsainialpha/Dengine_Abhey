import { TrackingEventService } from './../../services/tracking-event.service';
import { NgModule } from '@angular/core';
import { TrackingEventComponent } from './tracking-event.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared.module';

const TrackingEventRoutes: Routes = [{ path: '', component: TrackingEventComponent }];
@NgModule({
  declarations: [TrackingEventComponent],
  imports: [RouterModule.forChild(TrackingEventRoutes), SharedModule],
  providers: [TrackingEventService]
})
export class TrackingEventModule {}
