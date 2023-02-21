import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingEventComponent } from './tracking-event.component';

describe('TrackingEventComponent', () => {
  let component: TrackingEventComponent;
  let fixture: ComponentFixture<TrackingEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackingEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
