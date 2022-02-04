import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvbottombannerMngComponent } from './envbottombanner-mng.component';

describe('EnvbottombannerMngComponent', () => {
  let component: EnvbottombannerMngComponent;
  let fixture: ComponentFixture<EnvbottombannerMngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvbottombannerMngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvbottombannerMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
