import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvironmentMngComponent } from './environment-mng.component';

describe('EnvironmentMngComponent', () => {
  let component: EnvironmentMngComponent;
  let fixture: ComponentFixture<EnvironmentMngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvironmentMngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvironmentMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
