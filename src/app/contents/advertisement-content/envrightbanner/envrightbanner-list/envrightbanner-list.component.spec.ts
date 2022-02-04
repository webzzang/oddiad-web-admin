import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvrightbannerListComponent } from './envrightbanner-list.component';

describe('EnvrightbannerListComponent', () => {
  let component: EnvrightbannerListComponent;
  let fixture: ComponentFixture<EnvrightbannerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvrightbannerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvrightbannerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
