import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvhistoryComponent } from './advhistory.component';

describe('AdvhistoryComponent', () => {
  let component: AdvhistoryComponent;
  let fixture: ComponentFixture<AdvhistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvhistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
