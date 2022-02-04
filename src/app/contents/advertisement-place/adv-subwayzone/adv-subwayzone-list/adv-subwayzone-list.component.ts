import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {SearchboxComponent} from "../../../../shared/component/searchbox/searchbox.component";
import {AgGridComponent} from "../../../../shared/component/ag-grid/ag-grid.component";
import {AdvPlaceService} from "../../../../service/adv-place/adv-place.service";
import {SearchInputType} from "../../../../shared/component/searchbox";
import * as moment from "moment/moment";
import {CommonComponent} from "../../../common-component";

/**
 * 광고처 - 지하철 목록
 */
@Component({
  selector: 'app-adv-subwayzone-list',
  templateUrl: './adv-subwayzone-list.component.html',
  styleUrls: ['./adv-subwayzone-list.component.scss']
})
export class AdvSubwayzoneListComponent extends CommonComponent implements OnInit {

  @ViewChild('searchBox') searchBox: SearchboxComponent;
  @ViewChild('dataGrid')  dataGrid : AgGridComponent;

  @Output('moveMngEvent') moveMngEventEmitter: EventEmitter<string> = new EventEmitter();

  search : any = {};
  grid : any = {};
  selectLists: any = {
    operationCode : [],
    subwayLineCode: []
  };

  constructor(protected advPlaceService: AdvPlaceService) {
    super();

    this.advPlaceService.searchSubwayZoneCodes().subscribe((res) => {
      let operationCode: Array<any> = res.operationCode.map((item) => {
        return { name: item.name, value: parseInt(item.val) ? true : false };
      });

      let subwayLineCode: Array<any> = res.subwayLineCode.map((item) => {
        return { name: item.name, value: item.code };
      });

      this.init(operationCode, subwayLineCode);
    });
  }

  ngOnInit(): void {
  }

  private init(operationCode: Array<any>, subwayLineCode: Array<any>) : void {
    this.selectLists = {
      operationCode : operationCode,
      subwayLineCode: subwayLineCode,
      searchType: [
        { name: '지하철 이름', value: 'mallName' }
      ],
      periodType: [
        { name: '등록일', value: 'searchReg' }
      ]
    };

    this.search = {
      params: {},
      info: [
        { displayName: "운영 여부", nameWidth: '150', inputType: SearchInputType.select, id: 'operation',
          options: this.selectLists.operationCode, selectedValue: '', width: 150, class: '' },
        { displayName: "노선", nameWidth: '150', inputType: SearchInputType.select, id: 'subwayCode',
          options: this.selectLists.subwayLineCode, selectedValue: '', width: 150, class: '' },
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

        this.searchSubwayZoneList(this.search.params);
      },
      clearBtnHandler: () : void => {
        this.searchBox.onSearchBtnClick(null);
      }
    };

    this.grid = {
      api: AdvPlaceService.URL.SEARCH_SUBWAYZONE_LIST,
      isInitLoad: false,
      rowClassRules: {},
      columnDefs: [
        { headerName: '지하철 이름', field: 'mallName', width: 200,
          cellRenderer: "buttonRenderer",
          cellRendererParams: {
            onClick: this.moveSubwayzoneMng.bind(this)
          }
        },
        { headerName: '노선', field: 'subwayName', width: 200 },
        { headerName: '가격', field: 'slotPrice', width: 100 },
        { headerName: '등록일시', field: 'regDate', width: 150 },
        { headerName: '최종 수정일', field: 'modDate', width: 150 },
        { headerName: '운영 여부', field: 'operationName', width: 150 }
      ]
    };

    if (this.possibleRegister()) {
      this.grid.funcButtons = [
        {
          label: '지하철 등록',
          clickEventHandler: this.moveSubwayzoneMng.bind(this)
        }
      ]
    }

    setTimeout(() => {
      this.searchBox.onSearchBtnClick(null);
    });
  }

  /**
   * 지하철 목록 조회
   *
   * @private
   */
  private searchSubwayZoneList(params: any) : void {
    this.dataGrid.getList(params);
  }

  /**
   * 지하철 관리 페이지로 이동
   *
   * @param event
   * @private
   */
  private moveSubwayzoneMng(event) : void {
    this.moveMngEventEmitter.emit(event?.rowData?.seq);
  }

  /**
   * 페이지 갱신
   *  - 외부 컴포넌트 조작용
   */
  public refresh() : void {
    this.searchSubwayZoneList(this.search.params);
  }
}
