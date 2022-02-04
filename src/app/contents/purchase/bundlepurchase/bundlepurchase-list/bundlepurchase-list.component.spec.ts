import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BundlepurchaseListComponent } from './bundlepurchase-list.component';

describe('BundlepurchaseListComponent', () => {
  let component: BundlepurchaseListComponent;
  let fixture: ComponentFixture<BundlepurchaseListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BundlepurchaseListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BundlepurchaseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
