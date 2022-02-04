import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvideListComponent } from './provide-list.component';

describe('ProvideListComponent', () => {
  let component: ProvideListComponent;
  let fixture: ComponentFixture<ProvideListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvideListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvideListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
