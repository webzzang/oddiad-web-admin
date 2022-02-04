import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvPlaceSearchComponent } from './adv-place-search.component';

describe('AdvPlaceSearchComponent', () => {
  let component: AdvPlaceSearchComponent;
  let fixture: ComponentFixture<AdvPlaceSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvPlaceSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvPlaceSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
