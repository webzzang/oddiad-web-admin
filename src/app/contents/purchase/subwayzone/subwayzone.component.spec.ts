import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubwayzoneComponent } from './subwayzone.component';

describe('SubwayzoneComponent', () => {
  let component: SubwayzoneComponent;
  let fixture: ComponentFixture<SubwayzoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubwayzoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubwayzoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
