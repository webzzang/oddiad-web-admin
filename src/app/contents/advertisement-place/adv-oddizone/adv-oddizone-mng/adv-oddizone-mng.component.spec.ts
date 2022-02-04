import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvOddizoneMngComponent } from './adv-oddizone-mng.component';

describe('AdvOddizoneMngComponent', () => {
  let component: AdvOddizoneMngComponent;
  let fixture: ComponentFixture<AdvOddizoneMngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvOddizoneMngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvOddizoneMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
