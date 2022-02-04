import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SitetopbannerMngComponent } from './sitetopbanner-mng.component';

describe('SitetopbannerMngComponent', () => {
  let component: SitetopbannerMngComponent;
  let fixture: ComponentFixture<SitetopbannerMngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SitetopbannerMngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SitetopbannerMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
