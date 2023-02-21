import { ItemService } from './../../services/item.service';
import { NgModule } from '@angular/core';
import { ItemComponent } from './item.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared.module';

const ItemRoutes: Routes = [{ path: '', component: ItemComponent }];

@NgModule({
  declarations: [ItemComponent],
  imports: [RouterModule.forChild(ItemRoutes), SharedModule],
  providers: [ItemService]
})
export class ItemModule {}
