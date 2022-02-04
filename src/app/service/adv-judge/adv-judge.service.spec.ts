import { TestBed } from '@angular/core/testing';

import { AdvJudgeService } from './adv-judge.service';

describe('AdvJudgeService', () => {
  let service: AdvJudgeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdvJudgeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
