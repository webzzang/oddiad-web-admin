import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BundlepurchaseMngComponent } from './bundlepurchase-mng.component';

describe('BundlepurchaseMngComponent', () => {
  let component: BundlepurchaseMngComponent;
  let fixture: ComponentFixture<BundlepurchaseMngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BundlepurchaseMngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BundlepurchaseMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
