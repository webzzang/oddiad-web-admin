import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMngComponent } from './group-mng.component';

describe('GroupMngComponent', () => {
  let component: GroupMngComponent;
  let fixture: ComponentFixture<GroupMngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupMngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
