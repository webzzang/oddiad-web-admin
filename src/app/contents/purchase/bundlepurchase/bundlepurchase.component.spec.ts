import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BundlepurchaseComponent } from './bundlepurchase.component';

describe('BundlepurchaseComponent', () => {
  let component: BundlepurchaseComponent;
  let fixture: ComponentFixture<BundlepurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BundlepurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BundlepurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
