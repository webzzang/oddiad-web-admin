import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanMngComponent } from './plan-mng.component';

describe('PlanMngComponent', () => {
  let component: PlanMngComponent;
  let fixture: ComponentFixture<PlanMngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanMngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
