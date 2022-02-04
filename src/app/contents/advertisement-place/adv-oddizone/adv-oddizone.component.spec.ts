import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvOddizoneComponent } from './adv-oddizone.component';

describe('AdvOddizoneComponent', () => {
  let component: AdvOddizoneComponent;
  let fixture: ComponentFixture<AdvOddizoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvOddizoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvOddizoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
