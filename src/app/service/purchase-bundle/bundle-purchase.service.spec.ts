import { TestBed } from '@angular/core/testing';

import { BundlePurchaseService } from './bundle-purchase.service';

describe('BundlePurchaseService', () => {
  let service: BundlePurchaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BundlePurchaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
