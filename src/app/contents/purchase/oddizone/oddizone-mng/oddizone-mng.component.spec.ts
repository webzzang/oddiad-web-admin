import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OddizoneMngComponent } from './oddizone-mng.component';

describe('OddizoneMngComponent', () => {
  let component: OddizoneMngComponent;
  let fixture: ComponentFixture<OddizoneMngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OddizoneMngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OddizoneMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
