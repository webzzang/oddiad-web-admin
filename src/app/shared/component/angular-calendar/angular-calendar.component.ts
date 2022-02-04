import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import { format } from 'date-fns';
import { Subject } from 'rxjs';
import { Korean } from 'flatpickr/dist/l10n/ko';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView, CalendarDateFormatter, DAYS_OF_WEEK, CalendarWeekViewBeforeRenderEvent } from 'angular-calendar';
import { CustomDateFormatter } from './custom-date-formatter.provider';
import * as _flatpickr from 'flatpickr';
import { FlatpickrFn } from 'flatpickr/dist/types/instance';
const flatpickr: FlatpickrFn = _flatpickr as any;
import * as _weekSelectPlugin from 'flatpickr/dist/plugins/weekSelect/weekSelect';
import { Utils } from '../../utils/utils';
import * as $ from 'jquery';

const weekSelectPlugin: Function = _weekSelectPlugin as any;

const colors: any = {
  colorTemp: {// 페이크
    primary: '#000000',
    secondary: '#000000',
  }
};

@Component({
  selector: 'app-angular-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './angular-calendar.component.html',
  styleUrls: ['./angular-calendar.component.scss'],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter
    }
  ]
})
export class AngularCalendarComponent implements OnInit {

  @Input() paramCalendarView: any;

  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();

  @Output() popupHandler: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Week;

  weekStartsOn: number = DAYS_OF_WEEK.SUNDAY;
  weekendDays: number[] = [DAYS_OF_WEEK.SUNDAY, DAYS_OF_WEEK.SATURDAY];

  CalendarView = CalendarView;
  viewDate: Date;
  locale = Korean;

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];

  paramEvents: any = [];

  activeDayIsOpen: boolean = true;


  constructor() { }

  ngOnInit() {
    this.view = this.paramCalendarView;
    this.viewDate = new Date();
    this.drawDatePicker();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.preNextWeekChange();
    }, 1000);
  }

  drawDatePicker() {
    flatpickr("#weekSelect", {
      locale: this.locale,
      altInputClass: 'datepkLong',
      allowInput: true,
      altInput: true,
      dateFormat: "Y-m-d H:i",
      //dateFormat: 'D M d Y H:i:S \\G\\MT+0900',
      enableTime: true,
      time_24hr: true,
      minuteIncrement: 1,
      defaultHour: 0,
      altFormat: 'Y년 m월 W주',
      //altFormat: 'D M d Y H:i:S',
      defaultDate: this.viewDate,
      //defaultDate: utcInput.valueOf(),
      plugins: [
        weekSelectPlugin({
          weekNumbers: true
        })
      ],
      "onChange": [function () {
        const weekNumber = this.selectedDates[0] ? this.config.getWeek(this.selectedDates[0]) : null;
        console.log("weekNumber=" + weekNumber);
        console.log("주간 =" + this.weekStartDay + " ~ " + this.weekEndDay);
      }]
    });
  }

  onInputChange(date) {
    this.viewDate = new Date(date);

    let weekStartDate = format(Utils.thisWeekStartDate(this.viewDate), 'yyyyMMdd');
    let weekEndDate = format(Utils.thisWeekEndDate(this.viewDate), 'yyyyMMdd');

    let params = {
      startDate: weekStartDate,
      endDate: weekEndDate
    }

    this.valueChange.emit(params);
  }

  public reload() {
    this.events = [];

    this.paramEvents.forEach(event => {
      this.autoAddEvent(event);
    });

    this.closeOpenMonthViewDay();

    $("#addBtn").trigger('click');

    let index = 0;
    this.events.forEach(event => {
      if (index == (this.events.length - 1)) {
        this.deleteEvent(event);
      }
      index++;
    });
  }

  autoAddEvent(params): void {
    this.events = [
      ...this.events,
      {
        id: params.id,
        start: params.start,
        end: params.end,
        title: params.title,
        allDay: params.allDay,
        color: params.color,
        cssClass: params.cssClass,
        actions: params.action,
        /*
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        } 
        */
      },
    ];
  }

  //캘린더의 일정 클릭시 모달 오픈
  handleEvent(action: string, event: CalendarEvent): void {
    if (action == 'Dropped or resized') {

      //현재 사용 안함

    } else {
      let params;
      this.paramEvents.forEach(paramEvent => {
        if (paramEvent.id == event.id) {


          params = { gubun: paramEvent.gubun, id: paramEvent.id };
        }
      });

      this.popupHandler.emit(params);
    }
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  preNextWeekChange() {
    let weekStartDate = format(Utils.thisWeekStartDate(this.viewDate), 'yyyyMMdd');
    let weekEndDate = format(Utils.thisWeekEndDate(this.viewDate), 'yyyyMMdd');

    let params = {
      startDate: weekStartDate,
      endDate: weekEndDate
    }

    this.valueChange.emit(params);
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
    this.drawDatePicker();
  }


  addEvent(): void {

    let actionCustom: CalendarEventAction[] =
      [{
        label: '<i class="fas fa-fw fa-trash-alt"></i>',
        a11yLabel: 'Delete',
        onClick: ({ event }: { event: CalendarEvent }): void => {
          this.events = this.events.filter((iEvent) => iEvent !== event);
          //this.handleEvent('Deleted', event);
        }
      }];

    this.events = [
      ...this.events,
      {
        title: " ",
        start: this.viewDate,
        end: this.viewDate,
        color: colors.colorTemp,
        actions: actionCustom
        /*
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
        */
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  //일정 시간 변경 시 이벤트
  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }

      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  /*
//날짜 클릭 시 이벤트 (월 별 캘린더에서만 사용)
dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
  if (isSameMonth(date, this.viewDate)) {
    if (
      (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
      events.length === 0
    ) {
      this.activeDayIsOpen = false;
    } else {
      this.activeDayIsOpen = true;
    }
    this.viewDate = date;
  }
}
*/
}