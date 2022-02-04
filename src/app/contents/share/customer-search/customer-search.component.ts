import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {SearchboxComponent} from "../../../shared/component/searchbox/searchbox.component";
import {AgGridComponent} from "../../../shared/component/ag-grid/ag-grid.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CodeService} from "../../../service/code/code.service";
import * as _ from "lodash";
import {SearchInputType} from "../../../shared/component/searchbox";
import {NotificationService} from "../../../service/notification/notification.service";

/**
 * 회원 조회
 */
@Component({
  selector: 'app-customer-search',
  templateUrl: './customer-search.component.html',
  styleUrls: ['./customer-search.component.scss']
})
export class CustomerSearchComponent implements OnInit {
  public static readonly OPEN_TYPE: any = { SINGLE: 0, MULTIPLE: 1 };

  @ViewChild('popupSearchBox') searchBox: SearchboxComponent;
  @ViewChild('popupDataGrid')  dataGrid : AgGridComponent;

  search : any = {};
  grid : any = {};
  selectLists: any = {
  };

  openType  : number;
  statusCode: string;
  excludeMemberIds: Array<string>;

  selectRowsCheckIntervalId: any;

  constructor(@Inject(MAT_DIALOG_DATA) data: any,
              private codeService: CodeService,
              protected dialogRef: MatDialogRef<CustomerSearchComponent>) {
    this.openType   = data.openType;
    this.statusCode = data.statusCode || '';
    this.excludeMemberIds = data.excludeMemberIds || [];

    this.codeService.searchCodeList('CTS').subscribe((res) => {
      _.forEach(res, (item, index) => {
        if ('CTS004' == item.code) {
          res.splice(index, 1);
          return false;
        }
      });

      let statusCode: Array<any> = res.map((item) => {
        return { name: item.name, value: item.code };
      });

      this.init(statusCode);
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() : void {
    setTimeout(() => {
      this.searchBox.onSearchBtnClick(null);
    }, 500);

    this.selectRowsCheckIntervalId = setInterval(() => {
      this.grid.selectedRowData = this.dataGrid.selectRows();
    }, 400)
  }

  private init(statusCode: Array<any>): void {
    this.selectLists = {
      statusCode: statusCode,
      searchType: [
        { name: '고객 이메일', value: 'email' },
        { name: '고객 이름'  , value: 'name'},
        { name: '휴대전화번호', value: 'phoneNumber'}
      ]
    };

    this.search = {
      params: {},
      info: this.searchBoxInfos(),
      searchBtnHandler: ($event) : void => {
        this.search.params = $event;

        let searchType  = this.search.params.searchType;
        let searchValue = this.search.params.searchValue;

        if (searchType && searchValue) {
          this.search.params[searchType] = searchValue;
        }

        ['searchType', 'searchValue'].forEach((name) => {
          delete this.search.params[name];
        });

        if (this.statusCode) {
          this.search.params.statusCode = this.statusCode;
        }

        if (0 < this.excludeMemberIds.length) {
          this.search.params.excludeMemberId = this.excludeMemberIds.join(',');
        }

        this.searchMemberList(this.search.params);
        this.grid.selectedRowData = [];
      },
      clearBtnHandler: () : void => {
        this.searchBox.onSearchBtnClick(null);
      }
    };

    this.grid = {
      api: this.listUri(),
      isInitLoad: false,
      rowClick: ($event) => {
      },
      defaultColDef: {
        cellStyle : {
          'text-align' : 'center'
        }
      },
      rowClassRules: {},
      columnDefs: [
        { headerName: ' ', field: 'RowSelect', checkboxSelection: true, headerCheckboxSelection: false, width: 30 },
        { headerName: '고객 이메일', field: 'email', width: 200, sortable: false, useSort: false },
        { headerName: '고객 이름', field: 'name', width: 100, sortable: false, useSort: false },
        { headerName: '휴대전화번호', field: 'phoneNumber', width: 100, sortable: true, useSort: false,
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
        { headerName: '가입일시', field: 'signupDate', width: 150, sortable: true, useSort: false },
        { headerName: '상태', field: 'statusCodeName', width: 100, sortable: true, useSort: false }
      ],
      selectedRowData: []
    };
  }

  /**
   * 회원 목록 조회
   *
   * @param params
   */
  searchMemberList(params: any): void {
    this.dataGrid.getList(params);
  }

  /**
   * 검색박스 동적구성 배열
   */
  searchBoxInfos(): Array<any> {
    let infos: Array<any> = [];

    if (!this.statusCode) {
      infos.push({ displayName: "상태", nameWidth: '150', inputType: SearchInputType.select, id: 'statusCode',
        options: this.selectLists.statusCode, selectedValue: this.statusCode, width: 150, class: ''});
    }

    infos.push({ displayName: "검색어", nameWidth: '150', inputType: SearchInputType.selText, id: 'searchType', searchCondComo: true,
      options: this.selectLists.searchType, selectedValue: '', width: 500, class: '', placeHolder: '', selTextValue: ' ', selectId: 'searchType', inputId: 'searchValue'});

    return infos;
  }

  /**
   * 목록조회 URI
   */
  listUri(): string {
    return NotificationService.URL.SEARCH_MEMBER_LIST;
  }

  /**
   * 회원 선택
   */
  choice(): void {
    let result: any = CustomerSearchComponent.OPEN_TYPE.SINGLE == this.openType ? this.grid.selectedRowData[0] : this.grid.selectedRowData;

    clearInterval(this.selectRowsCheckIntervalId);

    this.dialogRef.close(result);
  }

  /**
   * 현재팝업 닫기
   */
  close(): void {
    clearInterval(this.selectRowsCheckIntervalId);

    this.dialogRef.close();
  }
}
