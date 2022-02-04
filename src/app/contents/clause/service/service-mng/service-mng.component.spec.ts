import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceMngComponent } from './service-mng.component';

describe('ServiceMngComponent', () => {
  let component: ServiceMngComponent;
  let fixture: ComponentFixture<ServiceMngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceMngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
