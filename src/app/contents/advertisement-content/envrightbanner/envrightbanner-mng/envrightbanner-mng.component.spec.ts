import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvrightbannerMngComponent } from './envrightbanner-mng.component';

describe('EnvrightbannerMngComponent', () => {
  let component: EnvrightbannerMngComponent;
  let fixture: ComponentFixture<EnvrightbannerMngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvrightbannerMngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvrightbannerMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
