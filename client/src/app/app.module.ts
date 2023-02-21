import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SharedModule } from './modules/shared.module';

@NgModule({
  declarations: [AppComponent, NavComponent, LoginComponent, DashboardComponent],
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, SharedModule, SharedModule.forRoot()],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
