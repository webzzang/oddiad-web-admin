import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelExporterComponent } from './excel-exporter.component';

describe('ExcelExporterComponent', () => {
  let component: ExcelExporterComponent;
  let fixture: ComponentFixture<ExcelExporterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExcelExporterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcelExporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
