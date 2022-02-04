import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyMngComponent } from './privacy-mng.component';

describe('PrivacyMngComponent', () => {
  let component: PrivacyMngComponent;
  let fixture: ComponentFixture<PrivacyMngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivacyMngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
