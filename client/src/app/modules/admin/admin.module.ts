import { NgModule } from '@angular/core';
import { SettingsComponent } from './settings/settings.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared.module';
import { AuditComponent } from './audit/audit.component';
import { UsersComponent } from './users/users.component';
import { ItemSettingsComponent } from './item-settings/item-settings.component';
import { PartySettingsComponent } from './party-settings/party-settings.component';
import { AdminComponent } from './admin.component';
import { OrderReleaseSettingsComponent } from './order-release-settings/order-release-settings.component';
import { OtherSettingsComponent } from './other-settings/other-settings.component';
import { LocationSettingsComponent } from './location-settings/location-settings.component';
import { TransactionSettingsComponent } from './transaction-settings/transaction-settings.component';
import { OrderBaseSettingsComponent } from './order-base-settings/order-base-settings.component';
import { TrackingEventSettingsComponent } from './tracking-event-settings/tracking-event-settings.component';
import { ShipmentSettingsComponent } from './shipment-settings/shipment-settings.component';
import { SettingResolverService } from 'src/app/resolvers/setting-resolver.service';
import { AuditResolverService } from 'src/app/resolvers/audit-resolver.service';
import { AdminService } from 'src/app/services/admin.service';

const AdminRoutes: Routes = [
  {
    path: 'settings',
    children: [
      {
        path: 'item',
        component: ItemSettingsComponent
      },
      {
        path: 'party',
        component: PartySettingsComponent
      },
      {
        path: 'order-release',
        component: OrderReleaseSettingsComponent
      },
      {
        path: 'order-base',
        component: OrderBaseSettingsComponent
      },
      {
        path: 'shipment',
        component: ShipmentSettingsComponent
      },
      {
        path: 'tracking-event',
        component: TrackingEventSettingsComponent
      },
      {
        path: 'location',
        component: LocationSettingsComponent
      },
      {
        path: 'transaction',
        component: TransactionSettingsComponent
      },
      {
        path: 'other',
        component: OtherSettingsComponent,
        resolve: {
          data: SettingResolverService
        }
      },
      {
        path: '',
        redirectTo: '/admin/settings/other',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'audit',
    component: AuditComponent,
    resolve: {
      data: AuditResolverService
    }
  },
  { path: 'users', component: UsersComponent }
];
@NgModule({
  declarations: [
    SettingsComponent,
    AuditComponent,
    UsersComponent,
    ItemSettingsComponent,
    PartySettingsComponent,
    AdminComponent,
    OrderReleaseSettingsComponent,
    OtherSettingsComponent,
    LocationSettingsComponent,
    TransactionSettingsComponent,
    OrderBaseSettingsComponent,
    TrackingEventSettingsComponent,
    ShipmentSettingsComponent
  ],
  imports: [SharedModule, RouterModule.forChild(AdminRoutes)],
  providers: [AdminService]
})
export class AdminModule {}
