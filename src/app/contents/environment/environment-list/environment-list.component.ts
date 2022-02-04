import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {AgGridComponent} from "../../../shared/component/ag-grid/ag-grid.component";
import {SearchboxComponent} from "../../../shared/component/searchbox/searchbox.component";
import {SearchInputType} from "../../../shared/component/searchbox";
import {CommonComponent} from "../../common-component";
import {EnvironmentService} from "../../../service/environment/environment.service";

/**
 * 기기 목록
 */
@Component({
  selector: 'app-environment-list',
  templateUrl: './environment-list.component.html',
  styleUrls: ['./environment-list.component.scss']
})
export class EnvironmentListComponent extends CommonComponent implements OnInit {
  @ViewChild('dataGrid')  dataGrid : AgGridComponent;
  @ViewChild('searchBox') searchBox: SearchboxComponent;

  @Output('moveMngEvent') moveMngEventEmitter: EventEmitter<string> = new EventEmitter();

  search: any = {};
  grid: any = {};
  selectLists: any = {
  }

  constructor(private environmentService: EnvironmentService) {
    super();

    this.environmentService.searchCodes().subscribe((res) => {
      let deviceTypeCode: Array<any> = res.deviceTypeCode.map((item) => {
        return { name: item.name, value: item.code };
      });

      let deviceLevelCode: Array<any> = res.deviceLevelCode.map((item) => {
        return { name: item.name, value: item.code };
      });

      this.init(deviceTypeCode, deviceLevelCode);
    });
  }

  ngOnInit(): void {
  }

  private init(deviceTypeCode: Array<any>, deviceLevelCode: Array<any>) : void {
    this.selectLists = {
      deviceTypeCode : deviceTypeCode,
      deviceLevelCode: deviceLevelCode,
      searchType: [
        { name: '오디존 이름', value: 'mallName' },
        { name: '기기 이름', value: 'deviceName' }
      ]
    }

    this.search = {
      params: {},
      info: [
        { displayName: "기기 구분", nameWidth: '150', inputType: SearchInputType.select, id: 'deviceType',
          options: this.selectLists.deviceTypeCode, selectedValue: '', width: 150, class: '' },
        { displayName: "장애 구분", nameWidth: '150', inputType: SearchInputType.select, id: 'deviceLevel',
          options: this.selectLists.deviceLevelCode, selectedValue: '', width: 150, class: '' },
        { displayName: "검색어", nameWidth: '150', inputType: SearchInputType.selText, id: 'searchType', searchCondComo: true,
          options: this.selectLists.searchType, selectedValue: '', width: 500, class: '', placeHolder: '', selTextValue: ' ', selectId: 'searchType', inputId: 'searchValue'}
      ],
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

        this.searchEnvironmentList(this.search.params);
      },
      clearBtnHandler: () : void => {
        this.searchBox.onSearchBtnClick(null);
      }
    };

    this.grid = {
      api: EnvironmentService.URL.SEARCH_DEVICE_LIST,
      isInitLoad: false,
      rowClassRules: {},
      columnDefs: [
        { headerName: '오디존', field: 'mallName', width: 150, sortable: true, useSort: false },
        { headerName: '기기이름', field: 'deviceName', width: 200, sortable: false, useSort: false,
          cellRenderer: "buttonRenderer",
          cellRendererParams: {
            onClick: this.moveEnvironmentMng.bind(this)
          }
        },
        { headerName: '기기구분', field: 'deviceTypeName', width: 150, sortable: true, useSort: false },
        { headerName: '최종 동작', field: 'deviceStateName', width: 150, sortable: true, useSort: false },
        { headerName: '기기상태', field: 'deviceLevelName', width: 150, sortable: true, useSort: false },
        { headerName: '업데이트일시', field: 'modDate', width: 150, sortable: true, useSort: false }
      ]
    };

    setTimeout(() => {
      this.searchBox.onSearchBtnClick(null);
    });
  }

  /**
   * 기기 목록 조회
   *
   * @param params
   * @private
   */
  private searchEnvironmentList(params: any) : void {
    this.dataGrid.getList(params);
  }

  /**
   * 기기 관리 페이지로 이동
   *
   * @param event
   * @private
   */
  private moveEnvironmentMng(event) : void {
    this.moveMngEventEmitter.emit(event?.rowData?.deviceId);
  }

  /**
   * 페이지 갱신
   *  - 외부 컴포넌트 조작용
   */
  public refresh() : void {
    this.searchEnvironmentList(this.search.params);
  }
}
