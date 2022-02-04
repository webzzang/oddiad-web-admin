import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvSubwayzoneComponent } from './adv-subwayzone.component';

describe('AdvSubwayzoneComponent', () => {
  let component: AdvSubwayzoneComponent;
  let fixture: ComponentFixture<AdvSubwayzoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvSubwayzoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvSubwayzoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
