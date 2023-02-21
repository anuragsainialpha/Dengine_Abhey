import { NgModule } from '@angular/core';
import { OrderReleaseComponent } from './order-release.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { OrderReleaseService } from 'src/app/services/order-release.service';
import { AuthInterceptor } from 'src/app/AuthInterceptor';
const OrderReleaseRoutes: Routes = [{ path: '', component: OrderReleaseComponent }];
@NgModule({
  declarations: [OrderReleaseComponent],
  imports: [RouterModule.forChild(OrderReleaseRoutes), SharedModule],
  providers: [
    OrderReleaseService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class OrderReleaseModule {}
