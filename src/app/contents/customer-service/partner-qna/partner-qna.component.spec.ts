import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerQnaComponent } from './partner-qna.component';

describe('PartnerQnaComponent', () => {
  let component: PartnerQnaComponent;
  let fixture: ComponentFixture<PartnerQnaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerQnaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerQnaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
