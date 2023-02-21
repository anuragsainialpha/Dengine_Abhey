import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingEventSettingsComponent } from './tracking-event-settings.component';

describe('TrackingEventSettingsComponent', () => {
  let component: TrackingEventSettingsComponent;
  let fixture: ComponentFixture<TrackingEventSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackingEventSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingEventSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
