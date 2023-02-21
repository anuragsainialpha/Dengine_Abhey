import { TransmissionService } from './../../services/transmission.service';
import { Event, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  showLoadingIndicator = false;
  isMiniSidebar = false;
  isSettingsNavVisible = false;
  sidebar = [];
  settingsSidebar = [];
  constructor(
    private breakpointObserver: BreakpointObserver,
    public transmissionService: TransmissionService,
    public router: Router
  ) {
    this.router.events.subscribe((routerEvent: Event) => {
      if (routerEvent instanceof NavigationStart) {
        if (!this.router.url.includes('/admin/settings/')) {
          this.showLoadingIndicator = true;
        }
      }
      if (routerEvent instanceof NavigationEnd) {
        if (this.router.url.includes('/dashboard')) {
          this.transmissionService.showSidebar = false;
        } else {
          this.transmissionService.showSidebar = true;
        }
        if (this.router.url.includes('/admin/settings/')) {
          this.isSettingsNavVisible = true;
        } else {
          this.isSettingsNavVisible = false;
        }
        this.showLoadingIndicator = false;
      }
    });
  }

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map((result) => result.matches));

  ngOnInit(): void {
    this.sidebar = this.transmissionService.userDetails.sidebar;
    this.settingsSidebar = this.transmissionService.userDetails.sidebar.filter(
      (d) => d.name !== 'Audit' && d.name !== 'Settings'
    );
    this.transmissionService.settingsSidebar = this.transmissionService.userDetails.sidebar.filter(
      (d) => d.name !== 'Audit' && d.name !== 'Settings'
    );
    this.settingsSidebar.push({
      name: 'Other',
      link: 'other',
      icon: 'settings',
      api: 'settings',
    });

    this.transmissionService.getInitialAppData(this.sidebar);
  }

  logOut() {
    localStorage.removeItem('token');
    window.location.href = '/';
  }
}
