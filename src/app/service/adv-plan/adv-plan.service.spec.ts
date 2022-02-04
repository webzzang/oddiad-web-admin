import { TestBed } from '@angular/core/testing';

import { AdvPlanService } from './adv-plan.service';

describe('AdvPlanService', () => {
  let service: AdvPlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdvPlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
