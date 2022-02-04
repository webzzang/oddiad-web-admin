import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {AgGridComponent} from "../../../../shared/component/ag-grid/ag-grid.component";
import {SearchboxComponent} from "../../../../shared/component/searchbox/searchbox.component";
import {SearchInputType} from "../../../../shared/component/searchbox";
import * as moment from "moment/moment";
import {CommonComponent} from "../../../common-component";
import {QnaService} from "../../../../service/qna/qna.service";

/**
 * QNA 목록
 */
@Component({
  selector: 'app-qna-list',
  templateUrl: './qna-list.component.html',
  styleUrls: ['./qna-list.component.scss']
})
export class QnaListComponent extends CommonComponent implements OnInit {

  @ViewChild('dataGrid')  dataGrid : AgGridComponent;
  @ViewChild('searchBox') searchBox: SearchboxComponent;

  @Output('moveMngEvent') moveMngEventEmitter: EventEmitter<string> = new EventEmitter();

  search: any = {};
  grid: any = {};
  selectLists: any = {
    inquiryTypeCode: [],
    answerTypeCode : [],
    searchType: [],
    periodType: []
  }

  constructor(protected qnaService: QnaService) {
    super();

    this.qnaService.searchCodes().subscribe((res) => {
      let inquiryTypeCode: Array<any> = res.inquiryTypeCode.map((item) => {
        return {name: item.name, value: item.code};
      });

      let answerTypeCode: Array<any> = res.answerTypeCode.map((item) => {
        return {name: item.name, value: item.val};
      });

      this.init(inquiryTypeCode, answerTypeCode);
    });
  }

  ngOnInit(): void {
  }

  private init(inquiryTypeCode: Array<any>, answerTypeCode: Array<any>) : void {
    this.selectLists = {
      inquiryTypeCode: inquiryTypeCode,
      answerTypeCode: answerTypeCode,
      searchType: [
        { name: '고객 ID', value: 'memberId' },
        { name: '제목', value: 'title' },
        { name: '답변자 ID', value: 'answerRegId' },
      ],
      periodType: [
        { name: '문의 접수일', value: 'searchReg' },
        { name: '답변 완료일', value: 'searchAnswerReg' }
      ]
    }

    this.search = {
      params: {},
      info: [
        { displayName: "문의 유형", nameWidth: '150', inputType: SearchInputType.select, id: 'inquiryTypeCode',
          options: this.selectLists.inquiryTypeCode, selectedValue: '', width: 150, class: '' },
        { displayName: "상태", nameWidth: '150', inputType: SearchInputType.select, id: 'answerType',
          options: this.selectLists.answerTypeCode, selectedValue: '', width: 150, class: '' },
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

        this.searchQnaList(this.search.params);
      },
      clearBtnHandler: () : void => {
        this.searchBox.onSearchBtnClick(null);
      }
    };

    this.grid = {
      api: QnaService.URL.SEARCH_LIST,
      isInitLoad: false,
      rowClassRules: {},
      columnDefs: [
        { headerName: '고객 이메일', field: 'email', width: 150 },
        { headerName: '문의유형', field: 'inquiryTypeCodeName', width: 150 },
        { headerName: '제목', field: 'title', width: 150,
          cellRenderer: "buttonRenderer",
          cellRendererParams: {
            onClick: this.moveQnaMng.bind(this)
          }
        },
        { headerName: '상태', field: 'answerType', width: 150 },
        { headerName: '문의 접수일', field: 'regDate', width: 150 },
        { headerName: '답변 완료일', field: 'answerRegDate', width: 150 },
        { headerName: '답변자', field: 'answerRegEmail', width: 150 }
      ]
    };

    setTimeout(() => {
      this.searchBox.onSearchBtnClick(null);
    });
  }

  /**
   * QNA 목록 조회
   *
   * @param params
   * @private
   */
  private searchQnaList(params: any) : void {
    this.dataGrid.getList(params);
  }

  /**
   * QNA 관리 페이지로 이동
   *
   * @param event
   * @private
   */
  private moveQnaMng(event) : void {
    this.moveMngEventEmitter.emit(event?.rowData?.seq);
  }

  /**
   * 페이지 갱신
   *  - 외부 컴포넌트 조작용
   */
  public refresh() : void {
    this.searchQnaList(this.search.params);
  }
}
