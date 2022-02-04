import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SitetopbannerListComponent } from './sitetopbanner-list.component';

describe('SitetopbannerListComponent', () => {
  let component: SitetopbannerListComponent;
  let fixture: ComponentFixture<SitetopbannerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SitetopbannerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SitetopbannerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
