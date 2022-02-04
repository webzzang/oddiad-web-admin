import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountMngComponent } from './account-mng.component';

describe('AccountMngComponent', () => {
  let component: AccountMngComponent;
  let fixture: ComponentFixture<AccountMngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountMngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
