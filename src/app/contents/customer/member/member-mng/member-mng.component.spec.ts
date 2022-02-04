import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberMngComponent } from './member-mng.component';

describe('MemberMngComponent', () => {
  let component: MemberMngComponent;
  let fixture: ComponentFixture<MemberMngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberMngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
