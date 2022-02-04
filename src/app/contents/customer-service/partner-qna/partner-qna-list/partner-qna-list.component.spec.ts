import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerQnaListComponent } from './partner-qna-list.component';

describe('PartnerQnaListComponent', () => {
  let component: PartnerQnaListComponent;
  let fixture: ComponentFixture<PartnerQnaListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerQnaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerQnaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
