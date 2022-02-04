import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvOddizoneListComponent } from './adv-oddizone-list.component';

describe('AdvOddizoneListComponent', () => {
  let component: AdvOddizoneListComponent;
  let fixture: ComponentFixture<AdvOddizoneListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvOddizoneListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvOddizoneListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
