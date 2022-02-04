import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvrightbannerComponent } from './envrightbanner.component';

describe('EnvrightbannerComponent', () => {
  let component: EnvrightbannerComponent;
  let fixture: ComponentFixture<EnvrightbannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvrightbannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvrightbannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
