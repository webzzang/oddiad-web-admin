import {MatDialog} from '@angular/material/dialog';
import {SearchService} from '../search.service';
import {SearchInputType, SearchOption} from '../index';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import {DatePipe} from '@angular/common';
import {Observable} from 'rxjs';
import {Korean} from 'flatpickr/dist/l10n/ko';
import * as $ from 'jquery';

@Component({
  selector: '[search]',
  providers: [SearchService, DatePipe],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  /**
   * Blank type 사용
   * { displayName: 'blank', inputType: SearchInputType.blank, width: 'w100-450'}, // < ---- 바로 개행이 필요할때, 한줄에 필요한 항목의 width를 뺀 나머지를 width로 잡아 개행한다. 빼야할 항목의 width는 일반적으로 50 ~ 100 더 준다.
   * { displayName: 'blank', inputType: SearchInputType.blank, width: 350 }
   * { displayName: 'blank', inputType: SearchInputType.blank } default 300px
   */
  intervalHolder: any;
  // 조회조건 정보
  // @Input() fieldInfo: any;
  @Input() fieldInfo: SearchOption;
  @Input() isClear: boolean;
  @Input() _dateRangeClear: boolean;
  @Input() _clearDateRange: string;
  @Input() itemWidth: number;
  @Output() userInputChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() searchFunc: EventEmitter<any> = new EventEmitter<any>();
  @Output() btnEvent: EventEmitter<any> = new EventEmitter<any>();



  @ViewChild('searchSelect') selectBox: ElementRef;
  _TEXT = SearchInputType.text;
  _RADIO = SearchInputType.radio;
  _LONG_RADIO = SearchInputType.longRadio;
  _DATERANGERADIO = SearchInputType.radio;
  _CHECK = SearchInputType.check;
  _LONG_CHECK = SearchInputType.longCheck;
  _SELECT = SearchInputType.select;
  _CALENDAR = SearchInputType.calendar;
  _BLANK = SearchInputType.blank;
  _BUTTON = SearchInputType.button;
  _SELTEXT = SearchInputType.selText;
  _SEL_DATERANGE_RADIO = SearchInputType.selDateRangeRadio;


  startDate;
  endDate;
  currDate = new Date().getMilliseconds();

  dateFormat = 'Y-m-d';
  // private readonly pickerLocale = Korean.ko;

  // 사용자 입력값
  public userInput: any;
  public userInputText: any; // second로 표기될 항목

  public placeholder = '';
  @HostBinding('style.width') public hostWidth = '';
  @HostBinding('style.width.px') public hostWidthPx;

  locale = Korean;

  totalTranslateCode = '';
  selTextDisable = false;

  constructor(private searchService: SearchService,
    public datePipe: DatePipe,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes.isClear) {
      this.clearInput();
    }

    if (changes._dateRangeClear) {
      this.clearDatePicker();
    }

    if (changes._clearDateRange) {
      if (changes._clearDateRange.currentValue !== ''
        && this.fieldInfo.inputType === SearchInputType.calendar
        && this.fieldInfo.isDateRange)
        if ((this.fieldInfo.id[0] + ',' + this.fieldInfo.id[1]) === changes._clearDateRange.currentValue)
          this.clearDatePicker();
    }

    this.clearSelDateRangePicker();
  }

  ngOnInit() {
    if (this.fieldInfo.useDisplayNamePostfix != false) {
      // useDisplayNamePostfix 가 없거나 true 면 '전체' 를 postfix로 붙여준다.
      this.totalTranslateCode = '전체';
    }
    if (this.fieldInfo.searchCondComo) {
      // searchCondComo true 면 '선택' 을 postfix로 붙여준다.
      this.totalTranslateCode = '선택';
    }

    /** 개행 옵션 */
    /*
    if (this.fieldInfo.lineBreak) {
      this.hostWidth = '100%';
    }
    else {
      if(this.fieldInfo.width){
        if(this.fieldInfo.nameWidth){
          this.hostWidthPx = this.fieldInfo.width + this.fieldInfo.nameWidth;
        } else {
          this.hostWidthPx = this.fieldInfo.width;
        }
      }
    }
    */

    if (this.fieldInfo.inputType === SearchInputType.select) {
      const options = [];
      Object.assign(options, this.fieldInfo.options);

      // 기본 name 으로 options 정렬, optionsOrderBy 가 'disable' 이면 정의된 순서 그대로 표현
      let sortKey = "ordering";
      if (!_.isEmpty(this.fieldInfo.optionsOrderBy)) {
        sortKey = this.fieldInfo.optionsOrderBy;
      }
      if (sortKey != 'disable') {
        this.fieldInfo.options = _.sortBy(options, sortKey);
      }

      if (!this.fieldInfo.selectedValue) {
        this.fieldInfo.selectedValue = '';
      } else {
        this.userInputChange.emit({
          'id': this.fieldInfo.id,
          'value': this.fieldInfo.selectedValue
        });
      }
      this.userInput = this.fieldInfo.selectedValue;
    }

    if (this.fieldInfo.inputType === SearchInputType.calendar) {
      if (this.fieldInfo.format) {
        this.dateFormat = this.fieldInfo.format.toUpperCase();
      }

      if (this.fieldInfo.selectedValue) {
        if (this.fieldInfo.selectedValue !== '_blank') {
          if (this.fieldInfo.isDateRange) {
            const dates = this.fieldInfo.selectedValue.split(',');
            this.startDate = dates[0];
            this.endDate = dates[1];
          } else {
            this.startDate = this.fieldInfo.selectedValue;
          }
        } else {
          this.startDate = null;
          if (this.fieldInfo.isDateRange) {
            this.endDate = null;
          }
        }
        this.setStartDate();
      }
      else {
        this.setToday();
      }
    }

    if (this.fieldInfo.inputType === SearchInputType.text && this.fieldInfo.selectedValue) {
      this.userInput = this.fieldInfo.selectedValue;
      this.userInputChange.emit({
        'id': this.fieldInfo.id,
        'value': this.fieldInfo.selectedValue
      });
    }

    if (this.fieldInfo.inputType === SearchInputType.button && this.fieldInfo.selectedValue) {
      this.userInputText = this.fieldInfo.selectedValue;
    }

    if (this.fieldInfo.inputType === SearchInputType.check && this.fieldInfo.selectedValue) {
      this.fieldInfo.options.forEach(option => {
        option.checked = (option.value === this.fieldInfo.selectedValue);
      });
    }
    //test
    if (this.fieldInfo.inputType === SearchInputType.check) {
      // checkbox선택이 미리 선택되어있는경우 초기화때부터 선택한 데이터를 전달.
      const checkedList = this.getCheckedList();
      const userInputValue = { 'id': this.fieldInfo.id, 'value': checkedList };
      this.userInputChange.emit(userInputValue);
    }

    if (this.fieldInfo.inputType === SearchInputType.selText) {

      const options = [];
      Object.assign(options, this.fieldInfo.options);

      // SearchInputType.select 와 다르게 기본 정렬 없음, optionsOrderBy 가 있으면 해당 key 로 정렬
      if (!_.isEmpty(this.fieldInfo.optionsOrderBy)) {
        let sortKey = this.fieldInfo.optionsOrderBy;
        this.fieldInfo.options = _.sortBy(options, sortKey);
      }

      if (this.fieldInfo.selectedValue || this.fieldInfo.selectedValue == "") {
        this.userInput = this.fieldInfo.selectedValue;
        this.userInputChange.emit({id: this.fieldInfo.selectId, value: this.userInput});

        this.keySelectChange();   // placeHolder 변경

        if (this.fieldInfo.selTextAllDisable) {
          this.selTextDisable = true;
        } else {
          if (this.fieldInfo.selTextDisable) {
            if (this.userInput) {
              this.selTextDisable = false;
            } else {
              this.selTextDisable = true;
            }
          }
        }
      }

      if (this.fieldInfo.selTextValue) {
        this.userInputText = this.fieldInfo.selTextValue;
        this.userInputChange.emit({id: this.fieldInfo.inputId, value: this.userInputText});
      }
    }

    if (this.fieldInfo.inputType === SearchInputType.selDateRangeRadio) {
      const options = [];
      Object.assign(options, this.fieldInfo.options);

      // SearchInputType.select 와 다르게 기본 정렬 없음, optionsOrderBy 가 있으면 해당 key 로 정렬
      if (!_.isEmpty(this.fieldInfo.optionsOrderBy)) {
        let sortKey = this.fieldInfo.optionsOrderBy;
        this.fieldInfo.options = _.sortBy(options, sortKey);
      }

      if (this.fieldInfo.selectedValue || this.fieldInfo.selectedValue == "") {
        this.userInput = this.fieldInfo.selectedValue;
        this.keySelectChange();   // placeHolder 변경

        if (this.fieldInfo.selTextAllDisable) {
          this.selTextDisable = true;
        } else {
          if (this.fieldInfo.selTextDisable) {
            if (this.userInput) {
              this.selTextDisable = false;
            } else {
              this.selTextDisable = true;
            }
          }
        }
      }

      this.clearSelDateRangePicker();
    }
  }

  ngAfterViewInit() {
    // setTimeout(() => {
    //   this.cdr.detach();
    //   this.setInterval();
    // }, 1000);
  }

  setInterval() {
    this.intervalHolder = setInterval(() => {
      this.cdr.detectChanges();
    }, 2000);
  }

  keySelectChange() {
    this.fieldInfo.options.forEach((item, idx) => {

      if (this.fieldInfo.selectedValue != '') {
        item.selected = 'selected';
      }

      if (this.userInput == '') {
        this.placeholder = this.fieldInfo?.placeHolder[0] || '';
      } else {
        if (item.value === this.userInput) {
          this.placeholder = this.fieldInfo?.placeHolder[idx + 1] || '';
        }
      }
    });
  }

  setStartDate() {
    let userInputValue;

    if (!this.fieldInfo.isDateRange) {
      userInputValue = {
        'id': this.fieldInfo.id,
        'value': this.startDate
      };
      this.userInputChange.emit(userInputValue);
    } else {
      userInputValue = {
        'id': this.fieldInfo.id[0],
        'value': this.startDate
      };
      this.userInputChange.emit(userInputValue);

      userInputValue = {
        'id': this.fieldInfo.id[1],
        'value': this.endDate
      };
      this.userInputChange.emit(userInputValue);
    }

    this.cdr.detectChanges();
  }

  // 입력값 변경시
  onInputChange(data: any) {
    let userInputValue = null;

    if (this.fieldInfo.inputType === this._SELTEXT) {
      this.keySelectChange();
      if (this.fieldInfo.selTextDisable) {
        if (this.userInput == "") {
          this.userInputText = "";
          this.selTextDisable = true;
        } else {
          if (!this.fieldInfo.selTextAllDisable) {
            this.selTextDisable = false;
          }
        }
      }

      if (data) {
        switch (data.type) {
          case 'select':
            this.userInputChange.emit({id: this.fieldInfo.selectId, value: data.value});

            break;
          case 'input' :
            this.userInputChange.emit({id: this.fieldInfo.inputId, value: data.value});

            break;
        }
      } else {
        this.userInputChange.emit({id: this.fieldInfo.inputId, value: this.userInputText});
      }
    } else {
      userInputValue = { 'id': this.fieldInfo.id, 'value': this.userInput };
      this.userInputChange.emit(userInputValue);
    }

    if (this.fieldInfo.inputType == this._CALENDAR) {

      this.startDate = moment($('#schStartDateInput').val()).format("YYYYMMDD");

      this.fieldInfo.selectedValue = this.startDate + "," + this.endDate
      if (this.fieldInfo.selectedValue) {
        if (this.fieldInfo.selectedValue !== '_blank') {
          if (this.fieldInfo.isDateRange) {
            const dates = this.fieldInfo.selectedValue.split(',');
            this.startDate = dates[0];
            this.endDate = dates[1];
          } else {
            this.startDate = this.fieldInfo.selectedValue;
          }
        } else {
          this.startDate = null;
          if (this.fieldInfo.isDateRange) {
            this.endDate = null;
          }
        }
      }

      if (this.startDate && this.endDate) {
        if (this.startDate > this.endDate) {
          setTimeout(() => {
            this.endDate = this.startDate;
          }, 1);
        }
      }

      if ($(".rangeRadio")) {
        $(".rangeRadio").prop('checked', false);
      }

      setTimeout(() => {
        this.setStartDate();
      }, 1);


    }

    if (this.fieldInfo.inputType == this._CHECK) {
      const checkedList = this.getCheckedList();
      userInputValue = { 'id': this.fieldInfo.id, 'value': checkedList };
      this.userInputChange.emit(userInputValue);
    }

    if (this.fieldInfo.inputType == this._LONG_CHECK) {
      const checkedList = this.getCheckedList();
      userInputValue = { 'id': this.fieldInfo.id, 'value': checkedList };
      this.userInputChange.emit(userInputValue);
    }

    if (this.fieldInfo.inputType == this._RADIO) {
      userInputValue = { 'id': this.fieldInfo.id, 'value': data.value };
      this.userInputChange.emit(userInputValue);
    }

    if (this.fieldInfo.inputType == this._LONG_RADIO) {
      userInputValue = { 'id': this.fieldInfo.id, 'value': data.value };
      this.userInputChange.emit(userInputValue);
    }
  }

  onSelDateRangeChange() {
    setTimeout(() => {
      this.userInputChange.emit({
        id    : 'startDate',
        value : this.startDate
      });

      this.userInputChange.emit({
        id    : 'endDate',
        value : this.endDate
      });
    }, 200);
  }

  onSelDateRangeRadioChange(data) {
    const sources = data.value.split(',');
    const value = sources[0];
    const type  = sources[1];
    const current = moment();
    const calcu   = moment().add(value, type);

    if (calcu.valueOf() < current.valueOf()) {
      this.startDate = calcu.format("YYYYMMDD");
      this.endDate   = current.format("YYYYMMDD");
    } else {
      this.startDate = current.format("YYYYMMDD");
      this.endDate   = calcu.format("YYYYMMDD");
    }

    setTimeout(() => {
      this.userInputChange.emit({
        id    : 'startDate',
        value : this.startDate
      });

      this.userInputChange.emit({
        id    : 'endDate',
        value : this.endDate
      });
    }, 200);
  }

  onDateRangeRadioChange(data) {

    if (this.fieldInfo.isDateRangeRadio) {

      this.startDate = moment().format('YYYYMMDD');
      this.endDate = moment().format('YYYYMMDD');

      this.setStartDate();

      this.setSubtractAddDate(data.value, data.type, data.offset, data.gubun);
      this.fieldInfo.selectedValue = this.startDate + "," + this.endDate;

      const dates = this.fieldInfo.selectedValue.split(',');

      this.startDate = dates[0];
      this.endDate = dates[1];

      setTimeout(() => {
        this.setStartDate();
      }, 200);

      let userInputValue = { 'id': this.fieldInfo.id, 'value': data.value };

      $('#schStartDateInput').val(this.startDate);
      $('#schEndDateInput').val(this.endDate);
      $('.startInputCal').val(moment(this.startDate).format('YYYY-MM-DD'));
      $('.endInputCal').val(moment(this.endDate).format('YYYY-MM-DD'));

    }
  }

  // 엔터키 입력시 검색 핸들러 호출.
  onKey(event: any) {
    // key code 8 backspace; 46 delete
    // if (event.keyCode == 8 || event.keyCode == 46) {
    //   this.userInput = null;
    // }

    if (event.keyCode == 13) { // enter key.
      this.onInputChange(null);
      this.searchService.publish('search-press');
      this.searchFunc.emit();
    }

  }

  // 초기화..
  clearInput() {
    if (this.fieldInfo.inputType == SearchInputType.text) {
      this.userInput = null;
    } else if (this.fieldInfo.inputType == SearchInputType.radio) {
      this.userInput = null;

      if (this.fieldInfo.isDateRangeRadio) {
        $(".radio-btn").prop('checked', false);
      }

    } else if (this.fieldInfo.inputType == SearchInputType.longRadio) {
      this.userInput = null;

      if (this.fieldInfo.isDateRangeRadio) {
        $(".radio-btn").prop('checked', false);
      }

    } else if (this.fieldInfo.inputType == SearchInputType.check) {
      this.fieldInfo.options.forEach((item) => {
        item.checked = false;
      });

    } else if (this.fieldInfo.inputType == SearchInputType.longCheck) {
      this.fieldInfo.options.forEach((item) => {
        item.checked = false;
      });

    } else if (this.fieldInfo.inputType == SearchInputType.select) {
      if (this.selectBox !== undefined) {
        if (!this.fieldInfo.required) {
          this.userInput = '';
        } else {
          this.userInput = this.fieldInfo.options[0].value;
        }
      }
    } else if (this.fieldInfo.inputType == SearchInputType.selText) {
      this.userInput = '';
      this.userInputText = null;
      this.placeholder = this.fieldInfo?.placeHolder[0] || '';

    } else if (this.fieldInfo.inputType == SearchInputType.calendar) {

      if (this.fieldInfo.selectedValue) {

        if (this.fieldInfo.selectedValue !== '_blank') {
          if (this.fieldInfo.isDateRange) {
            const dates = this.fieldInfo.selectedValue.split(',');
            this.startDate = dates[0];
            this.endDate = dates[1];
          } else {
            this.startDate = this.fieldInfo.selectedValue;
          }
        } else {
          this.startDate = null;
          if (this.fieldInfo.isDateRange) {
            this.endDate = null;
          }
        }
        this.setStartDate();
      }
      /*else {
        this.setToday();
      }*/
    } else if (this.fieldInfo.inputType == SearchInputType.selDateRangeRadio) {
      this.userInput = '';
    }
  }

  clearDatePicker() {
    if (this.fieldInfo.inputType == SearchInputType.calendar) {
      if (this.fieldInfo.selectedValue) {
        if (this.fieldInfo.selectedValue !== '_blank') {
          if (this.fieldInfo.isDateRange) {
            const dates = this.fieldInfo.selectedValue.split(',');

            this.startDate = dates[0];
            this.endDate = dates[1];
          }
        } else {
          this.startDate = null;
          if (this.fieldInfo.isDateRange) {
            this.endDate = null;
          }
        }
        this.setStartDate();
      }
    }
  }

  clearSelDateRangePicker() : void {
    if (this.fieldInfo.inputType == SearchInputType.selDateRangeRadio) {
      _.forEach(this.fieldInfo.dateRangeRadioOptions, (item, index) => {
        if (item.checked) {
          const sources = item.value.split(',');
          const value = sources[0];
          const type  = sources[1];
          const current = moment();
          const calcu   = moment().add(value, type);

          if (calcu.valueOf() < current.valueOf()) {
            this.startDate = calcu.format("YYYYMMDD");
            this.endDate   = current.format("YYYYMMDD");
          } else {
            this.startDate = current.format("YYYYMMDD");
            this.endDate   = calcu.format("YYYYMMDD");
          }

          setTimeout(() => {
            this.userInputChange.emit({
              id    : 'startDate',
              value : this.startDate
            });

            this.userInputChange.emit({
              id    : 'endDate',
              value : this.endDate
            });
          }, 200);

          return false;
        }
      });
    }
  }

  setToday() {
    this.startDate = moment().format('YYYYMMDD');
    this.endDate = moment().format('YYYYMMDD');

    this.setStartDate();
  }

  setSubtractAddDate(date, div, offset, gubun) {

    if (gubun == 'P') {
      this.startDate = moment().add(date, div).format('YYYYMMDD');
      this.endDate = moment(this.startDate).add((offset), div).format('YYYYMMDD');
    } else if (gubun == 'N') {
      //this.startDate = moment().add(date, div).format('YYYYMMDD');
      this.endDate = moment(this.startDate).add((offset), div).format('YYYYMMDD');
    }
  }

  /*
  checkSubtractDate(date, div): boolean {
    let currentDate = moment().format('YYYYMMDD');
    let start = moment().subtract(date, div).format('YYYYMMDD');
    return (start == this.startDate && currentDate == this.endDate);
  }

  setAddDate(date, div) {
    let currentDate = moment().format('YYYYMMDD');
    this.endDate = moment().add(date, div).format('YYYYMMDD');
    if (this.startDate == null) {
      this.startDate = currentDate;
    }
  }

  checkAddDate(date, div): boolean {
    let currentDate = moment().format('YYYYMMDD');
    let end = moment().add(date, div).format('YYYYMMDD');
    return (currentDate == this.startDate && end == this.endDate);
  }

  set1month() {
    const tempDate = new Date();
    const amonthAgo = tempDate.getMonth() - 1;
    this.startDate = new Date(tempDate.getFullYear(), amonthAgo, tempDate.getDate());
    if (this.endDate == null) {
      this.endDate = tempDate;
    }
    this.setStartDate();
  }

  set3month() {
    const tempDate = new Date();
    const amonthAgo = tempDate.getMonth() - 3;
    this.startDate = new Date(tempDate.getFullYear(), amonthAgo, tempDate.getDate());
    if (this.endDate == null) {
      this.endDate = tempDate;
    }
    this.setStartDate();
  }
 */
  callbackBtnClick() {
    const observer: Observable<any> = this.fieldInfo.btnClick.call(null);
    observer.subscribe(result => {
      if (this.fieldInfo.btnClickResultOpts) {
        const opt = this.fieldInfo.btnClickResultOpts;
        this.userInputText = result[opt.display];
        this.userInput = result[opt.value];
      } else {
        this.userInputText = result;
      }
      this.onInputChange(result);
    });
  }

  onClickBtn() {
    const checkData: any = [];
    if (this.fieldInfo.options) {
      this.fieldInfo.options.filter(item => {
        return item.checked;
      }).forEach(item => {
        checkData.push(item.value, item.checked);
      });
    }
    this.btnEvent.emit({ id: this.fieldInfo.id, check: checkData });
  }

  /*
  onClickDateAutoSetting(term, type) {
  }
*/
  private getCheckedList() {
    const checkedList: Array<string> = new Array<string>();
    this.fieldInfo.options.filter(item => {
      return item.checked;
    }).forEach(item => {
      checkedList.push(item.value);
    });
    return checkedList;
  }

  _disabledStartDate = (startValue) => {
    if (!startValue || !this.endDate) {
      return false;
    }
    return startValue.getTime() >= this.endDate.getTime();
  }
  _disabledEndDate = (endValue) => {
    if (!endValue || !this.startDate) {
      return false;
    }
    return endValue.getTime() <= this.startDate.getTime();
  }

  ngOnDestroy(): void {
    // clearInterval(this.intervalHolder);
  }

}

// 여기서
export { SearchOption } from './searchoption.interface';
export { SearchInputType } from './searchinput.enum';

