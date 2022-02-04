import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageHistListComponent } from './message-hist-list.component';

describe('MessageHistListComponent', () => {
  let component: MessageHistListComponent;
  let fixture: ComponentFixture<MessageHistListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageHistListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageHistListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
