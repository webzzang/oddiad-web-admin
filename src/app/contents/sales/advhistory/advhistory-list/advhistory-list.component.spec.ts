import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvhistoryListComponent } from './advhistory-list.component';

describe('AdvhistoryListComponent', () => {
  let component: AdvhistoryListComponent;
  let fixture: ComponentFixture<AdvhistoryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvhistoryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvhistoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
