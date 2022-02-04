import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OddizoneComponent } from './oddizone.component';

describe('OddizoneComponent', () => {
  let component: OddizoneComponent;
  let fixture: ComponentFixture<OddizoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OddizoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OddizoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
