import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {SearchboxComponent} from "../../../../shared/component/searchbox/searchbox.component";
import {AgGridComponent} from "../../../../shared/component/ag-grid/ag-grid.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SearchInputType} from "../../../../shared/component/searchbox";
import {NotificationService} from "../../../../service/notification/notification.service";
import * as _ from "lodash";
import {CodeService} from "../../../../service/code/code.service";

@Component({
  selector: 'app-message-group-search',
  templateUrl: './message-group-search.component.html',
  styleUrls: ['./message-group-search.component.scss']
})
export class MessageGroupSearchComponent implements OnInit {

  public static readonly OPEN_TYPE: any = { SINGLE: 0, MULTIPLE: 1 };

  @ViewChild('popupSearchBox') searchBox: SearchboxComponent;
  @ViewChild('popupDataGrid')  dataGrid : AgGridComponent;

  search : any = {};
  grid : any = {};
  selectLists: any = {
  };

  openType  : number;
  targetCode: string;

  selectRowsCheckIntervalId: any;

  constructor(@Inject(MAT_DIALOG_DATA) data: any,
              private codeService: CodeService,
              protected dialogRef: MatDialogRef<MessageGroupSearchComponent>) {
    this.openType   = data.openType;
    this.targetCode = data.targetCode;

    this.codeService.searchCodeList('NTC').subscribe((res) => {
      let targetCode: Array<any> = res.map((item) => {
        return { name: item.name, value: item.code };
      });

      this.init(targetCode);
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

  private init(targetCode: Array<any>): void {
    this.selectLists = {
      targetCode: targetCode,
      searchType: [
        { name: '발송 그룹명', value: 'email' },
        { name: '발송 대상', value: 'phoneNumber'}
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

        this.searchGroupList(this.search.params);
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
        { headerName: '발송그룹분류', field: 'targetCodeName' , width: 100, sortable: false, useSort: false },
        { headerName: '발송 그룹명', field: 'groupName' , width: 100, sortable: false, useSort: false },
        { headerName: '발송 대상'  , field: 'targetName', width: 200, sortable: false, useSort: false }
      ],
      selectedRowData: []
    };
  }

  /**
   * 그룹 목록 조회
   *
   * @param params
   */
  searchGroupList(params: any): void {
    this.dataGrid.getList(params);
  }

  /**
   * 검색박스 동적구성 배열
   */
  searchBoxInfos(): Array<any> {
    let infos: Array<any> = [];

    if (!this.targetCode) {
      infos.push({ displayName: "발송대상", nameWidth: '150', inputType: SearchInputType.select, id: 'statusCode',
        options: this.selectLists.targetCode, selectedValue: this.targetCode, width: 150, class: ''});
    }

    infos.push({ displayName: "검색어", nameWidth: '150', inputType: SearchInputType.selText, id: 'searchType', searchCondComo: true,
      options: this.selectLists.searchType, selectedValue: '', width: 500, class: '', placeHolder: '', selTextValue: ' ', selectId: 'searchType', inputId: 'searchValue'});

    return infos;
  }

  /**
   * 목록조회 URI
   */
  listUri(): string {
    return NotificationService.URL.SEARCH_GROUP_LIST;
  }

  /**
   * 그룹 선택
   */
  choice(): void {
    let result: any = MessageGroupSearchComponent.OPEN_TYPE.SINGLE == this.openType ? this.grid.selectedRowData[0] : this.grid.selectedRowData;

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
