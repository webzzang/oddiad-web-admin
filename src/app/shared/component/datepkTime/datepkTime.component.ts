import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Korean } from 'flatpickr/dist/l10n/ko';
import { ConfirmService } from 'src/app/shared/component/confirm/confirm.service';

@Component({
  selector: 'app-datepkTime',
  templateUrl: './datepkTime.component.html',
  styleUrls: ['./datepkTime.component.scss']
})
export class DatepkTimeComponent implements OnInit {

  locale = Korean;

  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();

  @Input() hourTime;
  @Input() dateFormat;
  @Input() minuteIncrement;
  @Input() time24hr;
  @Input() defaultHour;

  constructor(private confirm: ConfirmService) { }

  ngOnInit() {
    if (!this.dateFormat) {
      this.dateFormat = 'Y-m-d H:i';
    }
    if (!this.minuteIncrement) {
      this.minuteIncrement = 30;
    }
    if (!this.time24hr) {
      this.time24hr = false;
    }
    if (!this.defaultHour) {
      this.defaultHour = "12"
    }
  }

  onInputChange(data) {
    this.valueChange.emit(data);
  }
}
