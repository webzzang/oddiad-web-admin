import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvideMngComponent } from './provide-mng.component';

describe('ProvideMngComponent', () => {
  let component: ProvideMngComponent;
  let fixture: ComponentFixture<ProvideMngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvideMngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvideMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
