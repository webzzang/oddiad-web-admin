import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {SearchInputType} from "../../../../shared/component/searchbox";
import * as moment from "moment/moment";
import {AgGridComponent} from "../../../../shared/component/ag-grid/ag-grid.component";
import {SearchboxComponent} from "../../../../shared/component/searchbox/searchbox.component";
import {MemberService} from "../../../../service/customer/member.service";
import {CommonComponent} from "../../../common-component";

/**
 * 고객 목록
 */
@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent extends CommonComponent implements OnInit {

  @Output('moveMngEvent')
  protected moveMngEventEmitter: EventEmitter<string> = new EventEmitter();

  @ViewChild('searchBox') searchBox: SearchboxComponent;
  @ViewChild('dataGrid')  dataGrid : AgGridComponent;

  search : any = {};
  grid : any = {};
  selectLists : any = {};

  constructor(protected memberService: MemberService) {
    super();
  }

  ngOnInit(): void {
    this.memberService.searchCodes().subscribe((res) => {
      let statusList = res.statusCode.map((item) => {
        return { name: item.name, value: item.code };
      });

      this.init(statusList);
    });
  }

  ngAfterViewInit() {
  }

  private init(statusList: Array<any>) {
    this.grid = {
      api: MemberService.URL.SEARCH_LIST,
      isInitLoad: false,
      rowClassRules: {},
      columnDefs: [
        { headerName: '고객 이메일', field: 'email', width: 150,
          cellRenderer: "buttonRenderer",
          cellRendererParams: {
            onClick: this.moveMemberMng.bind(this)
          }
        },
        { headerName: '고객 이름', field: 'name', width: 150 },
        { headerName: '휴대전화번호', field: 'phoneNumber', width: 150,
          cellRenderer: (item) => {
            let pieces: Array<string> = [];

            if (item.value && 11 == item.value.length) {
              pieces.push(item.value.substr(0, 3));
              pieces.push(item.value.substr(3, 4));
              pieces.push(item.value.substr(7, 4));
            }

            return pieces.join('-');
          }
        },
        { headerName: '가입일시', field: 'signupDate', width: 150 },
        { headerName: '최종접속일', field: 'loginDate', width: 150 },
        { headerName: '상태', field: 'statusCodeName', width: 150 }
      ]
    };

    this.selectLists = {
      customerStatus: statusList,
      searchType: [
        { name: '고객 이메일', value: 'email' },
        { name: '고객 이름', value: 'name' },
        { name: '휴대전화번호', value: 'phoneNumber' }
      ],
      periodType: [
        { name: '가입일', value: 'searchReg' },
        { name: '최종접속일', value: 'searchLogin' }
      ]
    };

    this.search = {
      params: {},
      info: [
        { displayName: "상태", nameWidth: '150', inputType: SearchInputType.select, id: 'statusCode',
          options: this.selectLists.customerStatus, selectedValue: '', width: 150, class: '' },
        { displayName: "검색어", nameWidth: '150', inputType: SearchInputType.selText, id: 'searchType', searchCondComo: true,
          options: this.selectLists.searchType, selectedValue: '', width: 310, class: '', placeHolder: '', selTextValue: ' ', selectId: 'searchType', inputId: 'searchValue'},
        { displayName: "기간검색", nameWidth: '150', inputType: SearchInputType.selDateRangeRadio, id: 'periodType', searchCondComo: true,
          options: this.selectLists.periodType, selectedValue: '', width: 1000, class: '', placeHolder:' ',
          group: moment().milliseconds(),
          dateRangeRadioOptions: [
            {value: '-1,M', label: '1개월 전'},
            {value: '-7,d', label: '7일 전', checked: true},
            {value:  '0,d', label: '오늘'}
          ]}
      ],
      searchBtnHandler: ($event) : void => {
        this.search.params = $event;

        let searchType  = this.search.params.searchType;
        let searchValue = this.search.params.searchValue;

        if (searchType && searchValue) {
          this.search.params[searchType] = searchValue;
        }

        let periodType = this.search.params.periodType;
        let startDate  = this.search.params.startDate;
        let endDate    = this.search.params.endDate;

        if (periodType && startDate && endDate) {
          this.search.params[periodType + 'StartDate'] = startDate;
          this.search.params[periodType + 'EndDate'] = endDate;
        }

        ['searchType', 'searchValue', 'periodType', 'startDate', 'endDate'].forEach((name) => {
          delete this.search.params[name];
        });

        this.searchMemberList(this.search.params);
      },
      clearBtnHandler: () : void => {
        this.searchBox.onSearchBtnClick(null);
      }
    };

    setTimeout(() => {
      this.searchBox.onSearchBtnClick(null);
    });
  }

  /**
   * 고객 목록 조회
   * ex flyer company
   * @param params 조회조건
   * @private
   */
  private searchMemberList(params) : void {
    this.dataGrid.getList(params);
  }

  /**
   * 고객 관리 페이지로 이동
   *
   * @param event
   * @private
   */
  private moveMemberMng(event) : void {
    this.moveMngEventEmitter.emit(event?.rowData?.id);
  }

  /**
   * 페이지 갱신
   *  - 외부 컴포넌트 조작용
   */
  public refresh() : void {
    this.searchMemberList(this.search.params);
  }
}
