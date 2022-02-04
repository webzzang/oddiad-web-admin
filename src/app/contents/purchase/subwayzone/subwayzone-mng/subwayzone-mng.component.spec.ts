import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubwayzoneMngComponent } from './subwayzone-mng.component';

describe('SubwayzoneMngComponent', () => {
  let component: SubwayzoneMngComponent;
  let fixture: ComponentFixture<SubwayzoneMngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubwayzoneMngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubwayzoneMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
