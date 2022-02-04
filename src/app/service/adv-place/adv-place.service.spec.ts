import { TestBed } from '@angular/core/testing';

import { AdvPlaceService } from './adv-place.service';

describe('AdvPlaceService', () => {
  let service: AdvPlaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdvPlaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
