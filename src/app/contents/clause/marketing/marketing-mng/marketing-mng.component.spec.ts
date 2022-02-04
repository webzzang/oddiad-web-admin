import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingMngComponent } from './marketing-mng.component';

describe('MarketingMngComponent', () => {
  let component: MarketingMngComponent;
  let fixture: ComponentFixture<MarketingMngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketingMngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
