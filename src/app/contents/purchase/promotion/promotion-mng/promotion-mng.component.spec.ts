import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionMngComponent } from './promotion-mng.component';

describe('PromotionMngComponent', () => {
  let component: PromotionMngComponent;
  let fixture: ComponentFixture<PromotionMngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotionMngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
