import { TransactionResolverService } from './resolvers/transaction-resolver.service';
import { LocationResolverService } from './resolvers/location-resolver.service';
import { OrderReleaseResolverService } from './resolvers/order-release-resolver.service';
import { OrderBaseResolverService } from './resolvers/order-base-resolver.service';
import { PartyResolverService } from './resolvers/party-resolver.service';
import { TrackingEventResolverService } from './resolvers/tracking-event-resolver.service';
import { ShipmentResolverService } from './resolvers/shipment-resolver.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, NoPreloading } from '@angular/router';
import { ItemResolverService } from './resolvers/item-resolver.service';
import { DashboardResolverService } from './resolvers/dashboard-resolver.service';
import { NavComponent } from './components/nav/nav.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  {
    path: '',
    component: NavComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: {
          title: 'Dashboard',
          preload: true,
          delay: false
        },
        canActivateChild: [AuthGuard],
        resolve: { data: DashboardResolverService }
      },
      {
        path: 'item',
        loadChildren: () => import('./modules/item/item.module').then(m => m.ItemModule),
        resolve: { data: ItemResolverService },
        data: {
          title: 'Item',
          preload: true,
          delay: false
        },
        canActivateChild: [AuthGuard]
      },
      {
        path: 'bom',
        loadChildren: () => import('./modules/bom/bom.module').then(m => m.BomModule),
        data: {
          title: 'Bom',
          preload: true,
          delay: true
        },
        canActivateChild: [AuthGuard]
      },
      {
        path: 'party',
        loadChildren: () => import('./modules/party/party.module').then(m => m.PartyModule),
        resolve: { data: PartyResolverService },
        data: {
          title: 'Party',
          preload: true,
          delay: true
        },
        canActivateChild: [AuthGuard]
      },
      {
        path: 'location',
        loadChildren: () => import('./modules/location/location.module').then(m => m.LocationModule),
        resolve: { data: LocationResolverService },
        data: {
          title: 'Location',
          preload: true,
          delay: true
        },
        canActivateChild: [AuthGuard]
      },
      {
        path: 'transaction',
        loadChildren: () => import('./modules/transaction/transaction.module').then(m => m.TransactionModule),
        data: {
          title: 'Transaction',
          preload: true,
          delay: true
        },
        resolve: { data: TransactionResolverService },
        canActivateChild: [AuthGuard]
      },
      {
        path: 'order-release',
        loadChildren: () => import('./modules/order-release/order-release.module').then(m => m.OrderReleaseModule),
        data: {
          title: 'Order-Release',
          preload: true,
          delay: true
        },
        resolve: { data: OrderReleaseResolverService },
        canActivateChild: [AuthGuard]
      },
      {
        path: 'order-base',
        loadChildren: () => import('./modules/order-base/order-base.module').then(m => m.OrderBaseModule),
        data: {
          title: 'Order-Base',
          preload: true,
          delay: true
        },
        resolve: { data: OrderBaseResolverService },
        canActivateChild: [AuthGuard]
      },
      {
        path: 'shipment',
        loadChildren: () => import('./modules/shipment/shipment.module').then(m => m.ShipmentModule),
        data: {
          title: 'Shipment',
          preload: true,
          delay: true
        },
        resolve: { data: ShipmentResolverService },
        canActivateChild: [AuthGuard]
      },
      {
        path: 'tracking-event',
        loadChildren: () => import('./modules/tracking-event/tracking-event.module').then(m => m.TrackingEventModule),
        resolve: { data: TrackingEventResolverService },
        data: {
          title: 'Tracking-Event',
          preload: true,
          delay: true
        },
        canActivateChild: [AuthGuard]
      },
      {
        path: 'admin',
        loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
        data: {
          title: 'Admin',
          preload: true,
          delay: true
        },
        canActivateChild: [AuthGuard, AdminGuard]
      }
    ],
    data: { title: 'Dengine' },
    canActivate: [AuthGuard]
  },

  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Dengine | Login' },
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard]
  },

  {
    path: '**',
    redirectTo: '/item',
    pathMatch: 'full',
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: NoPreloading })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
