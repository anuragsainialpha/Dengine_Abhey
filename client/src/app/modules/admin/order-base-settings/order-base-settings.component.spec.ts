import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderBaseSettingsComponent } from './order-base-settings.component';

describe('OrderBaseSettingsComponent', () => {
  let component: OrderBaseSettingsComponent;
  let fixture: ComponentFixture<OrderBaseSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderBaseSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderBaseSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
