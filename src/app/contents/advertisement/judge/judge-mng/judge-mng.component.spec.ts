import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JudgeMngComponent } from './judge-mng.component';

describe('JudgeMngComponent', () => {
  let component: JudgeMngComponent;
  let fixture: ComponentFixture<JudgeMngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JudgeMngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JudgeMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
