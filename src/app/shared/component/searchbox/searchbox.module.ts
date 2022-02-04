import { SearchService } from './search.service';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchboxComponent } from './searchbox.component';
import { SearchComponent } from './search/search.component';
import {CommonPipeModule} from '../../pipe/common-pipe.module';
import {TranslateModule} from '@ngx-translate/core';
import { ResponsiveModule } from 'ngx-responsive';
import { FlatpickrModule } from 'angularx-flatpickr';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CommonPipeModule,
    TranslateModule,
    ResponsiveModule,
    FlatpickrModule
  ],
  declarations: [
    SearchboxComponent,
    SearchComponent
  ],
  providers: [SearchService],
  exports: [SearchboxComponent]
})
export class SearchBoxModule {}
