import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {SearchboxComponent} from "../../../../shared/component/searchbox/searchbox.component";
import {AgGridComponent} from "../../../../shared/component/ag-grid/ag-grid.component";
import {SearchInputType} from "../../../../shared/component/searchbox";
import * as moment from "moment/moment";
import {AdminAccountService} from "../../../../service/admin-account/admin-account.service";
import {Router} from "@angular/router";
import {CommonComponent} from "../../../common-component";

/**
 * 관리자 계정 목록
 */
@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss']
})
export class AccountListComponent extends CommonComponent implements OnInit {

  @ViewChild('searchBox') searchBox: SearchboxComponent;
  @ViewChild('dataGrid')  dataGrid : AgGridComponent;

  @Output('moveMngEvent') moveMngEventEmitter: EventEmitter<string> = new EventEmitter();

  search : any = {};
  grid : any = {};
  selectLists : any = {};

  constructor(protected router: Router,
              protected adminAccountService : AdminAccountService) {

    super();

    this.adminAccountService.searchCodes().subscribe(res => {
      let statusList = res.statusCode.map(item => {
        return {name: item.name, value: item.code};
      });

      let roleList = res.roleList.map(item => {
        return {name: item.name, value: item.seq};
      });

      this.init(statusList, roleList);
    });
  }

  ngOnInit() : void {
  }

  private init(statusList: Array<any>, groupList: Array<any>) : void {
    this.grid = {
      api: AdminAccountService.URL.SEARCH_LIST,
      isInitLoad: false,
      rowClassRules: {},
      columnDefs: [
        { headerName: '관리자 이메일', field: 'id', width: 200,
          cellRenderer: "buttonRenderer",
          cellRendererParams: {
            onClick: this.moveAccountMng.bind(this)
          }
        },
        { headerName: '관리자 이름', field: 'name', width: 150 },
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
        { headerName: '소속 그룹', field: 'roleName', width: 150 },
        { headerName: '상태', field: 'stateCodeName', width: 150 },
        { headerName: '등록 일시', field: 'regDate', width: 150 },
        { headerName: '최종 접속 일시', field: 'loginDate', width: 150 }
      ]
    };

    if (this.possibleRegister(true)) {
      this.grid.funcButtons = [
        {
          label: '관리자 등록',
          clickEventHandler: this.moveAccountMng.bind(this)
        }
      ];
    }

    this.selectLists = {
      adminStatus: statusList,
      adminGroup : groupList,
      searchType: [
        { name: '관리자 ID', value: 'id' },
        { name: '관리자 이름', value: 'name' },
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
          options: this.selectLists.adminStatus, selectedValue: '', width: 150, class: '' },
        { displayName: "소속 그룹", nameWidth: '150', inputType: SearchInputType.select, id: 'roleSeq',
          options: this.selectLists.adminGroup, selectedValue: '', width: 150, class: '' },
        { displayName: "검색어", nameWidth: '150', inputType: SearchInputType.selText, id: 'searchType', searchCondComo: true,
          options: this.selectLists.searchType, selectedValue: '', width: 500, class: '', placeHolder: '', selTextValue: ' ', selectId: 'searchType', inputId: 'searchValue'},
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
   * 관리자 목록 조회
   * ex flyer company
   * @param params 조회조건
   * @private
   */
  private searchMemberList(params) : void {
    this.dataGrid.getList(params);
  }

  /**
   * 관리자 관리 페이지로 이동
   *
   * @param event
   * @private
   */
  private moveAccountMng(event) : void {
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
