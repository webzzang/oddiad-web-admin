import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvbottombannerListComponent } from './envbottombanner-list.component';

describe('EnvbottombannerListComponent', () => {
  let component: EnvbottombannerListComponent;
  let fixture: ComponentFixture<EnvbottombannerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvbottombannerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvbottombannerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
