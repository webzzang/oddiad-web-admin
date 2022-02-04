import {Component, OnInit, ViewChild} from '@angular/core';
import {AgGridComponent} from "../../../../shared/component/ag-grid/ag-grid.component";
import {SearchboxComponent} from "../../../../shared/component/searchbox/searchbox.component";
import {CommonComponent} from "../../../common-component";
import {PartnerQnaService} from "../../../../service/partner-qna/partner-qna.service";
import {SearchInputType} from "../../../../shared/component/searchbox";
import * as moment from "moment/moment";
import {ConfirmService} from "../../../../shared/component/confirm/confirm.service";

/**
 * 파트너 QNA 목록
 */
@Component({
  selector: 'app-partner-qna-list',
  templateUrl: './partner-qna-list.component.html',
  styleUrls: ['./partner-qna-list.component.scss']
})
export class PartnerQnaListComponent extends CommonComponent implements OnInit {
  @ViewChild('dataGrid')  dataGrid : AgGridComponent;
  @ViewChild('searchBox') searchBox: SearchboxComponent;

  selectLists: any = {
    businessCode: [],
    searchType: [],
    periodType: []
  };

  search: any = {};
  grid: any = {};

  constructor(private partnerQnaService: PartnerQnaService,
              private confirmService: ConfirmService) {
    super();

    this.partnerQnaService.searchCodes().subscribe((res) => {
      let businessCode: Array<any> = res.businessCode.map((item) => {
        return {name: item.name, value: item.code};
      });

      this.init(businessCode);
    });
  }

  ngOnInit(): void {
  }

  private init(businessCode: Array<any>) : void {
    this.selectLists = {
      businessCode: businessCode,
      searchType: [
        { name: '이름', value: 'name' },
        { name: '전화번호', value: 'phoneNumber' },
        { name: '지역', value: 'location' }
      ],
      periodType: [
        { name: '등록일', value: 'searchReg' }
      ]
    }

    this.search = {
      params: {},
      info: [
        { displayName: "업종", nameWidth: '150', inputType: SearchInputType.select, id: 'searchType',
          options: this.selectLists.businessCode, selectedValue: '', width: 200, class: ''},
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

        this.searchPartnerQnaList(this.search.params);
      },
      clearBtnHandler: () : void => {
        this.searchBox.onSearchBtnClick(null);
      }
    };

    this.grid = {
      api: PartnerQnaService.URL.SEARCH_LIST,
      isInitLoad: false,
      rowClassRules: {},
      columnDefs: [
        { headerName: '이름', field: 'name', width: 150 },
        { headerName: '전화번호', field: 'phoneNumber', width: 150 },
        { headerName: '지역', field: 'location', width: 150 },
        { headerName: '업종', field: 'businessName', width: 200 },
        { headerName: '문의 사항', field: 'contents', width: 500,
          cellRenderer: "buttonRenderer",
          cellRendererParams: {
            onClick: this.openContentsDetailPopup.bind(this)
          }
        },
        { headerName: '등록 일시', field: 'regDate', width: 150 }
      ]
    };

    setTimeout(() => {
      this.searchBox.onSearchBtnClick(null);
    });
  }

  /**
   * 이벤트 데이타
   *
   * @param item
   * @private
   */
  private openContentsDetailPopup(item): void {
    let contents: string = item.rowData?.contents?.replace(/(\r\n|\n|\r)/gm, '<br>');

    this.confirmService.alert(contents, {width: 1200});
  }

  /**
   * 파트너 QNA 목록 조회
   *
   * @param params
   * @private
   */
  private searchPartnerQnaList(params: any) : void {
    this.dataGrid.getList(params);
  }
}
