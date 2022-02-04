import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SitepopupListComponent } from './sitepopup-list.component';

describe('SitepopupListComponent', () => {
  let component: SitepopupListComponent;
  let fixture: ComponentFixture<SitepopupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SitepopupListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SitepopupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
