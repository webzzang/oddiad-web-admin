import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {TermsService} from "../../../../service/terms/terms.service";
import {AgGridComponent} from "../../../../shared/component/ag-grid/ag-grid.component";
import {CommonComponent} from "../../../common-component";

/**
 * 개인정보 마케팅이용 수집 및 동의 약관 목록
 */
@Component({
  selector: 'app-marketing-list',
  templateUrl: './marketing-list.component.html',
  styleUrls: ['./marketing-list.component.scss']
})
export class MarketingListComponent extends CommonComponent implements OnInit {

  @ViewChild('dataGrid')  dataGrid : AgGridComponent;

  @Output('moveMngEvent') moveMngEventEmitter: EventEmitter<string> = new EventEmitter();

  grid : any = {};

  constructor(protected termsService: TermsService) {
    super();

    this.init();
  }

  ngOnInit(): void {
  }

  private init() : void {
    this.grid = {
      api: TermsService.URL.SEARCH_MARKETING_LIST,
      isInitLoad: false,
      defaultColDef: {
        cellStyle : {
          'text-align' : 'center'
        }
      },
      rowClassRules: {},
      columnDefs: [
        { headerName: '약관 분류', field: 'advTerms', width: 100,
          cellRenderer: (item) => {
            return item.value ? '광고신청' : '회원가입'
          }
        },
        { headerName: '버전', field: 'version', width: 100 },
        { headerName: '약관 이름', field: 'title', width: 250,
          cellRenderer: "buttonRenderer",
          cellRendererParams: {
            onClick: this.moveMarketingClauseMng.bind(this)
          }
        },
        { headerName: '등록자', field: 'regEmail', width: 200 },
        { headerName: '등록 일시', field: 'regDate', width: 150 },
        { headerName: '최종 수정자', field: 'modEmail', width: 200 },
        { headerName: '최종 수정 일시', field: 'modDate', width: 150 },
        { headerName: '상태', field: 'statusCodeName', width: 100 }
      ]
    };

    if (this.possibleRegister(true)) {
      this.grid.funcButtons = [
        {
          label: '약관 등록',
          clickEventHandler: this.moveMarketingClauseMng.bind(this)
        }
      ]
    }

    setTimeout(() => {
      this.searchMarketingClauseList();
    });
  }

  /**
   * 마케팅 약관 목록 조회
   *
   * @private
   */
  private searchMarketingClauseList() : void {
    this.dataGrid.getList();
  }

  /**
   * 마케팅 약관 관리 페이지로 이동
   *
   * @param event
   * @private
   */
  private moveMarketingClauseMng(event) : void {
    this.moveMngEventEmitter.emit(event?.rowData?.seq);
  }

  /**
   * 페이지 갱신
   *  - 외부 컴포넌트 조작용
   */
  public refresh() : void {
    this.searchMarketingClauseList();
  }
}
