import { SearchOption, SearchComponent } from './search/search.component';
import { Subscription } from 'rxjs';
import { SearchService } from './search.service';
import {
  Component, OnInit, Input, Output, EventEmitter, OnDestroy, QueryList, ViewChildren,
  AfterViewInit, ChangeDetectorRef
} from '@angular/core';
import * as _ from 'lodash';
import { Utils } from '../../utils/utils';
import { RestClient } from '../../http/rest-client';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'search-box',
  templateUrl: './searchbox.component.html',
  styleUrls: ['./searchbox.component.scss']
})
export class SearchboxComponent extends RestClient implements OnInit, AfterViewInit, OnDestroy {

  intervalHolder: any;
  // 조회조건
  // @Input() searchInfo: any;
  @Input() searchInfo: SearchOption[];

  // 조회조건 배열 컬럼 수
  @Input() colCount: number;

  // 조회 조건 클릭시 외부에서 주입한 핸들러(function) 호출용
  @Output() searchBtnHandler: EventEmitter<any> = new EventEmitter<any>();

  @Output() clearBtnHandler: EventEmitter<any> = new EventEmitter<any>();

  @Output() onInputChange: EventEmitter<any> = new EventEmitter<any>();

  @Output() btnEvent: EventEmitter<any> = new EventEmitter<any>();

  @Output() dateRangeHandler: EventEmitter<any> = new EventEmitter<any>();

  //특정 이벤트 호출용
  @Output() onUserChangeEvent: EventEmitter<any> = new EventEmitter<any>();


  @ViewChildren('search') searchList: QueryList<SearchComponent>;

  // 사용자 입력값 취합 배열
  public userInputArray: Array<any>;

  // 마지막 search 항목
  private _searchParam: any;

  // 조회 조건 클래스
  public colClass: string;

  public isAllClear = false;

  public dateRangeClear = false;

  public clearDateRangeValue = '';

  public subscription: Subscription;

  constructor(protected http: HttpClient,
    public searchService: SearchService,
    private cdr: ChangeDetectorRef) {
    super('', http);
    this.defaultHeaders = {
      'Content-Type': 'application/json;charset=utf-8',
      'Accept': 'application/json;charset=utf-8'
    };
    this.setHeader(this.defaultHeaders);
  }

  ngOnInit() {
    this.userInputArray = new Array();
    this.colClass = 'dl ' + 'row' + this.colCount + ' h39';
    this.subscription = this.searchService.on('search-press').subscribe(() => {
      let searchParams = {};
      _.each(this.userInputArray, item => {
        searchParams[item.id] = item.value;
      });
      this._searchParam = searchParams;
      this.searchBtnHandler.emit(searchParams);
    });
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

  onSearchBtnClick(event) {
    Utils.cacheSearchParams(this.userInputArray, false);
    let searchParams = {};
    _.each(this.userInputArray, item => {
      searchParams[item.id] = item.value || '';
    });

    this._searchParam = searchParams;
    this.searchBtnHandler.emit(searchParams);
  }

  search(params?: any) {
    if (params) {
      let keys = _.keys(params);
      this.userInputArray = keys.map(key => {
        return { id: key, value: params[key] };
      });
    }
    this.onSearchBtnClick(null);
  }

  searchLatest() {
    this.searchBtnHandler.emit(this._searchParam);
  }

  getSearchLatest() {
    return this._searchParam;
  }

  onClearBtnClick() {
    this.userInputArray = new Array();
    this.isAllClear = !this.isAllClear;
    this._searchParam = null;
    this.clearBtnHandler.emit('clear');
  }

  clearDateRange() {
    this.dateRangeClear = !this.dateRangeClear;
  }

  clearDateRangeByIds(value) {
    this.clearDateRangeValue = value;

    setTimeout(() => {
      this.clearDateRangeValue = '';
    }, 500);
  }

  changeSearchValue(value) {
    this.userInputArray = value;
  }

  userInputHandler(event) {

    this.userInputArray.push(event);

    _.forEach(this.userInputArray, (inputData) => {

      if (inputData == undefined) {
        return;
      }
      if ((inputData.id === event.id) && (inputData.value === event.value)) {
        // 기존 값을 삭제한다
        _.remove(this.userInputArray, (value) => {
          return value.id == event.id;
        });
        // 새 값을 넣는다.
        this.userInputArray.push(event);
      }

      if (inputData.value === null) {
        _.remove(this.userInputArray, (value) => {
          return value.id == event.id;
        });
      }
    });

    // 변경된 항목이 다른 항목의 parentId로 지정되어 있으면 parentId로 지정된 항목은 삭제.
    this.setChildSearchInfoReset(event); // recursive function

    this.onInputChange.emit(event);

    this.cdr.detectChanges();

  }

  setChildSearchInfoReset(event) {
    // 변경된 항목이 다른 항목의 parentId로 지정되어 있으면 parentId로 지정된 항목은 삭제.
    let targetId1 = null;
    let targetId2 = null;
    _.some(this.searchInfo, (item) => {
      if (item.parentId == event.id) {
        _.remove(this.userInputArray, (inputItem) => inputItem.id == item.id);
        targetId1 = item.id;
        return true;
      }
    });

    // 위 parentId에 삭제된 항목의 bind 변수도 초기화
    if (this.searchList) {
      this.searchList.some(search => {
        if (search.fieldInfo.parentId == event.id) {
          search.userInput = "";
          targetId2 = search.fieldInfo.id;
          return true;
        }
      });
    }

    if (_.isEmpty(targetId1) == false && _.isEmpty(targetId2) == false) {
      if (targetId1 == targetId2) {
        // 현재 child로 지정된 항목의 child가 있는지 재귀함수호출
        this.setChildSearchInfoReset({ id: targetId1 });
      }
    }
  }

  onClickBtn(event?: any) {
    this.btnEvent.emit(event);
  }

  isLandscape(): boolean {
    return window.outerWidth > window.outerHeight;
  }

  ngOnDestroy() {
    // unsubscribe를 하지 않으면 메모리 릭 발생.
    this.subscription.unsubscribe();
    clearInterval(this.intervalHolder);
  }
}
