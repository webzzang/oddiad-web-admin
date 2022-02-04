import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Korean } from 'flatpickr/dist/l10n/ko';
import { ConfirmService } from 'src/app/shared/component/confirm/confirm.service';

@Component({
  selector: 'app-datepk',
  templateUrl: './datepk.component.html',
  styleUrls: ['./datepk.component.scss']
})
export class DatepkComponent implements OnInit {

  locale = Korean;

  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();

  @Input() placeHolder;
  @Input() sPlaceHolder;
  @Input() ePlaceHolder;
  @Input() date;
  @Input() sdate;
  @Input() edate;
  @Input() minDate;

  dateRange = false;

  constructor(private confirm: ConfirmService) { }

  ngOnInit() {

    if (this.date) {
      this.dateRange = false;
    }
    if (this.sdate && this.edate) {
      this.dateRange = true;
    }
  }

  onInputChange(data) {
    this.valueChange.emit(data);
  }

  onInputChange1(data) {
    if (this.sdate && this.edate) {
      if (this.sdate > this.edate) {
        this.edate = this.sdate;
      } else {
        this.valueChange.emit({ sdate: this.sdate, edate: this.edate });
      }
    }
  }

  onInputChange2(data) {
    if (this.sdate && this.edate) {
      if (this.sdate > this.edate) {
        // this.sdate = this.edate;
        setTimeout(() => {
          this.edate = this.sdate;
        }, 1);
      } else {
        this.valueChange.emit({ sdate: this.sdate, edate: this.edate });
      }
    }
  }

}
