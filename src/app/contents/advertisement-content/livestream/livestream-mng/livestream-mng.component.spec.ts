import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LivestreamMngComponent } from './livestream-mng.component';

describe('LivestreamMngComponent', () => {
  let component: LivestreamMngComponent;
  let fixture: ComponentFixture<LivestreamMngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LivestreamMngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LivestreamMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
