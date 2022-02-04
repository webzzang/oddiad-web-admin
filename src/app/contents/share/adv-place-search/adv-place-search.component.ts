import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {SearchboxComponent} from "../../../shared/component/searchbox/searchbox.component";
import {AgGridComponent} from "../../../shared/component/ag-grid/ag-grid.component";
import {CodeService} from "../../../service/code/code.service";
import {SearchInputType} from "../../../shared/component/searchbox";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ContentService} from "../../../service/content/content.service";
import {Utils} from "../../../shared/utils/utils";
import * as _ from 'lodash';
import {NotificationService} from "../../../service/notification/notification.service";
import {PurchaseService} from "../../../service/purchase/purchase.service";
import {BundlePurchaseService} from "../../../service/purchase-bundle/bundle-purchase.service";

/**
 * 광고처 조회
 */
@Component({
  selector: 'app-adv-place-search',
  templateUrl: './adv-place-search.component.html',
  styleUrls: ['./adv-place-search.component.scss']
})
export class AdvPlaceSearchComponent implements OnInit, AfterViewInit {

  public static readonly OPEN_TYPE: any = { SINGLE: 0, MULTIPLE: 1 };

  @ViewChild('popupSearchBox') searchBox: SearchboxComponent;
  @ViewChild('popupDataGrid')  dataGrid : AgGridComponent;

  search : any = {};
  grid : any = {};
  selectLists: any = {
    channelTypeCode: []
  };

  openType   : number;
  channelType: string;
  channelTypeName: string;
  excludePartnerSeqs: Array<number>;

  selectRowsCheckIntervalId: any;

  constructor(@Inject(MAT_DIALOG_DATA) data: any,
              private codeService: CodeService,
              protected dialogRef: MatDialogRef<AdvPlaceSearchComponent>) {
    this.openType    = data.openType;
    this.channelType = data.channelType || '';
    this.excludePartnerSeqs = data.excludePartnerSeqs || [];

    this.codeService.searchCodeList('PTT').subscribe((res) => {
      res.splice(2, 1);

      let channelTypeCode: Array<any> = res.map((item) => {
        return { name: item.name, value: item.code };
      });

      if (this.channelType) {
        _.forEach(channelTypeCode, (item) => {
          if (this.channelType == item.value) {
            this.channelTypeName = item.name;

            return false;
          }
        });
      }

      this.init(channelTypeCode);
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

  private init(channelTypeCode: Array<any>): void {
    this.selectLists = {
      channelTypeCode: channelTypeCode,
      searchType: [
        { name: '광고처 이름', value: 'mallName' }
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

        if (this.channelType) {
          this.search.params.channelType = this.channelType;
        }

        if (0 < this.excludePartnerSeqs.length) {
          this.search.params.excludeSeq = this.excludePartnerSeqs.join(',');
        }

        this.searchPartnerList(this.search.params);
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
        { headerName: '광고처 이름', field: 'mallName', width: 100, sortable: false, useSort: false },
        { headerName: '채널 구분', field: 'channelTypeName', width: 200, sortable: false, useSort: false },
        { headerName: '가격', field: 'slotPrice', width: 100, sortable: true, useSort: false,
          cellRenderer: (item) => {
            return Utils.comma(item.value);
          }
        },
        { headerName: '등록일시', field: 'regDate', width: 100, sortable: true, useSort: false },
        { headerName: '운영여부', field: 'operationName', width: 150, sortable: true, useSort: false }
      ],
      selectedRowData: []
    };
  }

  /**
   * 광고처 목록 조회
   *
   * @param params
   */
  searchPartnerList(params: any): void {
    this.dataGrid.getList(params);
  }

  /**
   * 검색박스 동적구성 배열
   */
  searchBoxInfos(): Array<any> {
    let infos: Array<any> = [];

    if (!this.channelType) {
      infos.push({ displayName: "채널 구분", nameWidth: '150', inputType: SearchInputType.select, id: 'channelType',
        options: this.selectLists.channelTypeCode, selectedValue: this.channelType, width: 150, class: ''});
    }

    infos.push({ displayName: "검색어", nameWidth: '150', inputType: SearchInputType.selText, id: 'searchType', searchCondComo: true,
      options: this.selectLists.searchType, selectedValue: '', width: 500, class: '', placeHolder: '', selTextValue: ' ', selectId: 'searchType', inputId: 'searchValue'});

    return infos;
  }

  /**
   * 목록조회 URI
   */
  listUri(): string {
    let currMenu: any = JSON.parse(sessionStorage.getItem('selectMenu'));

    switch (currMenu.menuId) {
      case 'CNT001':
        return ContentService.URL.SEARCH_PARTNER_LIST;
      case 'NTF001':
        return NotificationService.URL.SEARCH_PARTNER_LIST;
      case 'PRD001':
        return BundlePurchaseService.URL.SEARCH_PARTNER_LIST;
      default:
        alert('해당메뉴의 API 가 존재하지 않습니다.');
        return null;
    }
  }

  /**
   * 광고처 선택
   */
  choice(): void {
    let result: any = AdvPlaceSearchComponent.OPEN_TYPE.SINGLE == this.openType ? this.grid.selectedRowData[0] : this.grid.selectedRowData;

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
