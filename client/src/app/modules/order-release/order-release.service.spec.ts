import { TestBed } from '@angular/core/testing';

import { OrderReleaseService } from '../services/order-release.service';

describe('OrderReleaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrderReleaseService = TestBed.get(OrderReleaseService);
    expect(service).toBeTruthy();
  });
});
