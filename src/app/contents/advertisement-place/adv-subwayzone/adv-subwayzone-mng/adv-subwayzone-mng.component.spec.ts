import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvSubwayzoneMngComponent } from './adv-subwayzone-mng.component';

describe('AdvSubwayzoneMngComponent', () => {
  let component: AdvSubwayzoneMngComponent;
  let fixture: ComponentFixture<AdvSubwayzoneMngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvSubwayzoneMngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvSubwayzoneMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
