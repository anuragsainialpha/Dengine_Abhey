import { SharedTabComponent } from '../components/shared-tab/shared-tab.component';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTreeModule } from '@angular/material/tree';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { OrderModule } from 'ngx-order-pipe';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TransmissionService } from 'src/app/services/transmission.service';
import { ItemResolverService } from 'src/app/resolvers/item-resolver.service';
import { PartyResolverService } from 'src/app/resolvers/party-resolver.service';
import { LocationResolverService } from 'src/app/resolvers/location-resolver.service';
import { OrderReleaseResolverService } from 'src/app/resolvers/order-release-resolver.service';
import { TransactionResolverService } from 'src/app/resolvers/transaction-resolver.service';
import { AuditResolverService } from 'src/app/resolvers/audit-resolver.service';
import { DashboardResolverService } from 'src/app/resolvers/dashboard-resolver.service';
import { OrderBaseResolverService } from 'src/app/resolvers/order-base-resolver.service';
import { TrackingEventResolverService } from 'src/app/resolvers/tracking-event-resolver.service';
import { ShipmentResolverService } from 'src/app/resolvers/shipment-resolver.service';
import { SettingResolverService } from 'src/app/resolvers/setting-resolver.service';
import { AuthInterceptor } from 'src/app/AuthInterceptor';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [SharedTabComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    DragDropModule,
    ScrollingModule,
    MatCheckboxModule,
    MatTabsModule,
    MatExpansionModule,
    MatTreeModule,
    MatInputModule,
    NgxPaginationModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatSelectModule,
    MatStepperModule,
    OrderModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatRadioModule,
    MatChipsModule,
    MatBadgeModule,
    MatTooltipModule,
  ],
  exports: [
    FormsModule,
    HttpClientModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    DragDropModule,
    ScrollingModule,
    MatCheckboxModule,
    CommonModule,
    MatTabsModule,
    MatExpansionModule,
    MatTreeModule,
    MatInputModule,
    NgxPaginationModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatSelectModule,
    MatStepperModule,
    OrderModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatRadioModule,
    MatChipsModule,
    SharedTabComponent,
    MatBadgeModule,
    MatTooltipModule,
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        TransmissionService,
        ItemResolverService,
        PartyResolverService,
        LocationResolverService,
        OrderReleaseResolverService,
        TransactionResolverService,
        AuditResolverService,
        DashboardResolverService,
        OrderBaseResolverService,
        TrackingEventResolverService,
        ShipmentResolverService,
        SettingResolverService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        },
      ],
    };
  }
}
