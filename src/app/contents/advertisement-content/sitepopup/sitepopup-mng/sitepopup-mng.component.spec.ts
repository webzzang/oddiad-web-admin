import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SitepopupMngComponent } from './sitepopup-mng.component';

describe('SitepopupMngComponent', () => {
  let component: SitepopupMngComponent;
  let fixture: ComponentFixture<SitepopupMngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SitepopupMngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SitepopupMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
