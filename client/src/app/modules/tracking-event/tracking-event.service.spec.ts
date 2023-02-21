import { TestBed } from '@angular/core/testing';

import { TrackingEventService } from '../services/tracking-event.service';

describe('TrackingEventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrackingEventService = TestBed.get(TrackingEventService);
    expect(service).toBeTruthy();
  });
});
