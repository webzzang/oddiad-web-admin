import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvSubwayzoneListComponent } from './adv-subwayzone-list.component';

describe('AdvSubwayzoneListComponent', () => {
  let component: AdvSubwayzoneListComponent;
  let fixture: ComponentFixture<AdvSubwayzoneListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvSubwayzoneListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvSubwayzoneListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
