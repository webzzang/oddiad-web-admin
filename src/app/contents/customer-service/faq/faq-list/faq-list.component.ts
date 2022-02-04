import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {AgGridComponent} from "../../../../shared/component/ag-grid/ag-grid.component";
import {CommonComponent} from "../../../common-component";
import {FaqService} from "../../../../service/faq/faq.service";
import {SearchboxComponent} from "../../../../shared/component/searchbox/searchbox.component";
import {SearchInputType} from "../../../../shared/component/searchbox";

/**
 * FAQ 목록
 */
@Component({
  selector: 'app-faq-list',
  templateUrl: './faq-list.component.html',
  styleUrls: ['./faq-list.component.scss']
})
export class FaqListComponent extends CommonComponent implements OnInit {

  @ViewChild('dataGrid')  dataGrid : AgGridComponent;
  @ViewChild('searchBox') searchBox: SearchboxComponent;
  
  @Output('moveMngEvent') moveMngEventEmitter: EventEmitter<string> = new EventEmitter();

  search: any = {};
  grid: any = {};

  constructor(protected faqService: FaqService) {
    super();
    
    this.faqService.searchCodes().subscribe((res) => {
      let categoryCode: Array<any> = res.categoryCode.map((item) => {
        return {name: item.name, value: item.code};
      });

      let expoCode: Array<any> = res.expoCode.map((item) => {
        return {name: item.name, value: item.val};
      });

      this.init(categoryCode, expoCode);
    });
    
    
  }

  ngOnInit(): void {
  }

  private init(categoryCode: Array<any>, expoCode: Array<any>) : void {
    this.search = {
      params: {},
      info: [
        { displayName: "분류", nameWidth: '150', inputType: SearchInputType.select, id: 'categoryCode',
          options: categoryCode, selectedValue: '', width: 150, class: '' },
        { displayName: "전시 상태", nameWidth: '150', inputType: SearchInputType.select, id: 'expo',
          options: expoCode, selectedValue: '', width: 150, class: '' },
        { displayName: "제목", nameWidth: '150', inputType: SearchInputType.text, id: 'title', searchCondComo: true,
          width: 150, class: '', placeHolder: ''}
      ],
      searchBtnHandler: ($event) : void => {
        this.search.params = $event;

        this.searchFaqList(this.search.params);
      },
      clearBtnHandler: () : void => {
        this.searchBox.onSearchBtnClick(null);
      }
    };
    
    this.grid = {
      api: FaqService.URL.SEARCH_LIST,
      isInitLoad: false,
      rowClassRules: {},
      columnDefs: [
        { headerName: '분류', field: 'categoryCodeName', width: 150 },
        { headerName: '전시', field: 'expoCodeName', width: 150 },
        { headerName: '제목', field: 'title', width: 200,
          cellRenderer: "buttonRenderer",
          cellRendererParams: {
            onClick: this.moveFaqMng.bind(this)
          }
        },
        { headerName: '등록자', field: 'regEmail', width: 150 },
        { headerName: '등록 일시', field: 'regDate', width: 150 }
      ]
    };

    if (this.possibleRegister(true)) {
      this.grid.funcButtons = [
        {
          label: 'FAQ 등록',
          clickEventHandler: this.moveFaqMng.bind(this)
        }
      ]
    }

    setTimeout(() => {
      this.searchBox.onSearchBtnClick(null);
    });
  }

  /**
   * FAQ 목록 조회
   *
   * @param params
   * @private
   */
  private searchFaqList(params: any) : void {
    this.dataGrid.getList(params);
  }

  /**
   * FAQ 관리 페이지로 이동
   *
   * @param event
   * @private
   */
  private moveFaqMng(event) : void {
    this.moveMngEventEmitter.emit(event?.rowData?.seq);
  }

  /**
   * 페이지 갱신
   *  - 외부 컴포넌트 조작용
   */
  public refresh() : void {
    this.searchFaqList(this.search.params);
  }
}
