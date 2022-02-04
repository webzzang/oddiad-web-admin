import { TestBed } from '@angular/core/testing';

import { PartnerQnaService } from './partner-qna.service';

describe('PartnerQnaService', () => {
  let service: PartnerQnaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartnerQnaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
