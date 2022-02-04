import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SitepopupComponent } from './sitepopup.component';

describe('SitepopupComponent', () => {
  let component: SitepopupComponent;
  let fixture: ComponentFixture<SitepopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SitepopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SitepopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
