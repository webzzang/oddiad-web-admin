import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageSendMngComponent } from './message-send-mng.component';

describe('MessageSendMngComponent', () => {
  let component: MessageSendMngComponent;
  let fixture: ComponentFixture<MessageSendMngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageSendMngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageSendMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
