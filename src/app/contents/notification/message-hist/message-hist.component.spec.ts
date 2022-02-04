import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageHistComponent } from './message-hist.component';

describe('MessageHistComponent', () => {
  let component: MessageHistComponent;
  let fixture: ComponentFixture<MessageHistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageHistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageHistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
