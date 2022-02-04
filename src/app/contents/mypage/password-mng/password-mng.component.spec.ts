import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordMngComponent } from './password-mng.component';

describe('PasswordMngComponent', () => {
  let component: PasswordMngComponent;
  let fixture: ComponentFixture<PasswordMngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordMngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
