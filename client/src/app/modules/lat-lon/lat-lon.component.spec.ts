import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LatLonComponent } from './lat-lon.component';

describe('LatLonComponent', () => {
  let component: LatLonComponent;
  let fixture: ComponentFixture<LatLonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LatLonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatLonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
