import { PartyService } from './../../services/party.service';
import { NgModule } from '@angular/core';
import { PartyComponent } from './party.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared.module';

const PartyRoutes: Routes = [{ path: '', component: PartyComponent }];

@NgModule({
  declarations: [PartyComponent],
  imports: [RouterModule.forChild(PartyRoutes), SharedModule],
  providers: [PartyService]
})
export class PartyModule {}
