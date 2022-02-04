import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyMngComponent } from './apply-mng.component';

describe('ApplyMngComponent', () => {
  let component: ApplyMngComponent;
  let fixture: ComponentFixture<ApplyMngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplyMngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
