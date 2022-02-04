import {CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders, NgModule} from '@angular/core';
import {AgGridModule} from 'ag-grid-angular';
import {AgGridHeaderComponent} from './component/ag-grid/ag-grid-header/ag-grid-header.component';
import {AgGridComponent} from './component/ag-grid/ag-grid.component';
import {AgGridFilterComponent} from './component/ag-grid-filter/ag-grid-filter.component';
import {AngularCalendarComponent} from './component/angular-calendar/angular-calendar.component';
import {SimplePagingComponent} from './component/simple-paging/simple-paging.component';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {SearchBoxModule} from './component/searchbox/searchbox.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ConfirmService} from './component/confirm/confirm.service';
import {ConfirmComponent} from './component/confirm/confirm.component';
import {SearchboxComponent} from './component/searchbox/searchbox.component';
import {StringFormatPipe} from './pipe/string-format.pipe';
import {CommonPipeModule} from './pipe/common-pipe.module';
import {StringToDate} from './pipe/string-to-date.pipe';
import {NavigationService} from './service/navigation.service';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {NgxSpinnerModule} from 'ngx-spinner';
import {DatepkComponent} from './component/datepk/datepk.component';
import {DatepkTimeComponent} from './component/datepkTime/datepkTime.component';
import {FlatpickrModule} from 'angularx-flatpickr';
import {EditorComponent} from './component/editor/editor.component';
import {NgxSummernoteModule} from 'ngx-summernote';
import {NaverMapComponent} from './component/naver-map/naver-map.component';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {Ng2ChartComponent} from './component/ng2-chart/ng2-chart.component';
import {DaumAddressComponent} from './component/daum-address/daum-address.component';
import {NgChartsModule} from "ng2-charts";

@NgModule({
    imports: [
      CommonModule,
      HttpClientModule,
      SearchBoxModule,
      FormsModule,
      ReactiveFormsModule,
      CommonPipeModule,
      TranslateModule,
      AgGridModule,
      NgxSpinnerModule,
      NgbModalModule,
      FlatpickrModule.forRoot(),
      CalendarModule.forRoot({
        provide: DateAdapter,
        useFactory: adapterFactory,
      }),    
      NgChartsModule,
      NgxSummernoteModule
    ],
    declarations: [
      ConfirmComponent,
      SimplePagingComponent,
      AgGridComponent,
      AgGridHeaderComponent,
      AgGridFilterComponent,
      AngularCalendarComponent,
      DatepkComponent,
      DatepkTimeComponent,
      Ng2ChartComponent,
      EditorComponent,
      NaverMapComponent,
      DaumAddressComponent
    ],
    entryComponents: [
      ConfirmComponent,
      SimplePagingComponent,
      AgGridComponent,
      AgGridHeaderComponent,
      AgGridFilterComponent,
      AngularCalendarComponent,
      DatepkComponent,
      DatepkTimeComponent,
      Ng2ChartComponent,
      EditorComponent,
      NaverMapComponent,
      DaumAddressComponent
    ],
    providers: [
      ConfirmService,
      TranslateService
    ],
    exports: [
      StringFormatPipe,
      StringToDate,
      SearchboxComponent,
      ConfirmComponent,
      SimplePagingComponent,
      AgGridComponent,
      AgGridFilterComponent,
      AngularCalendarComponent,
      DatepkComponent,
      DatepkTimeComponent,
      Ng2ChartComponent,
      EditorComponent,
      NaverMapComponent,
      DaumAddressComponent
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
  })
export class SharedModule {

  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        { provide: NavigationService }
      ]
    };
  }

}
