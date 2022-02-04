import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupcouponMngComponent } from './signupcoupon-mng.component';

describe('SignupcouponMngComponent', () => {
  let component: SignupcouponMngComponent;
  let fixture: ComponentFixture<SignupcouponMngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupcouponMngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupcouponMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
