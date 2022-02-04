import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageGroupSearchComponent } from './message-group-search.component';

describe('MessageGroupSearchComponent', () => {
  let component: MessageGroupSearchComponent;
  let fixture: ComponentFixture<MessageGroupSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageGroupSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageGroupSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
