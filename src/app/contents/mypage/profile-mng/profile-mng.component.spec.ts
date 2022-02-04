import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileMngComponent } from './profile-mng.component';

describe('ProfileMngComponent', () => {
  let component: ProfileMngComponent;
  let fixture: ComponentFixture<ProfileMngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileMngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
