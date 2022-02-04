import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeMngComponent } from './notice-mng.component';

describe('NoticeMngComponent', () => {
  let component: NoticeMngComponent;
  let fixture: ComponentFixture<NoticeMngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticeMngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticeMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
