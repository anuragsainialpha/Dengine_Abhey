import { TestBed } from '@angular/core/testing';

import { OrderBaseService } from '../services/order-base.service';

describe('OrderBaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrderBaseService = TestBed.get(OrderBaseService);
    expect(service).toBeTruthy();
  });
});
