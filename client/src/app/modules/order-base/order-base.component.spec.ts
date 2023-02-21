import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderBaseComponent } from './order-base.component';

describe('OrderBaseComponent', () => {
  let component: OrderBaseComponent;
  let fixture: ComponentFixture<OrderBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
