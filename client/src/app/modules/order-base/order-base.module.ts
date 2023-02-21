import { NgModule } from '@angular/core';
import { OrderBaseComponent } from './order-base.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { OrderBaseService } from 'src/app/services/order-base.service';
import { AuthInterceptor } from 'src/app/AuthInterceptor';
const OrderBaseRoutes: Routes = [{ path: '', component: OrderBaseComponent }];
@NgModule({
  declarations: [OrderBaseComponent],
  imports: [RouterModule.forChild(OrderBaseRoutes), SharedModule],
  providers: [
    OrderBaseService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class OrderBaseModule {}
