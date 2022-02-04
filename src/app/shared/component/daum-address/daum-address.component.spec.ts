import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DaumAddressComponent } from './daum-address.component';

describe('DaumAddressComponent', () => {
  let component: DaumAddressComponent;
  let fixture: ComponentFixture<DaumAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DaumAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaumAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
