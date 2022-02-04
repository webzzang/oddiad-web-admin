import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvbottombannerComponent } from './envbottombanner.component';

describe('EnvbottombannerComponent', () => {
  let component: EnvbottombannerComponent;
  let fixture: ComponentFixture<EnvbottombannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvbottombannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvbottombannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
