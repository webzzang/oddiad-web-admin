import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SitetopbannerComponent } from './sitetopbanner.component';

describe('SitetopbannerComponent', () => {
  let component: SitetopbannerComponent;
  let fixture: ComponentFixture<SitetopbannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SitetopbannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SitetopbannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
