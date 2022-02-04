import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqMngComponent } from './faq-mng.component';

describe('FaqMngComponent', () => {
  let component: FaqMngComponent;
  let fixture: ComponentFixture<FaqMngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaqMngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
