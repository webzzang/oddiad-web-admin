import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {PurchaseService} from "../../../../service/purchase/purchase.service";
import {CommonComponent} from "../../../common-component";
import {SearchboxComponent} from "../../../../shared/component/searchbox/searchbox.component";
import {AgGridComponent} from "../../../../shared/component/ag-grid/ag-grid.component";
import {SearchInputType} from "../../../../shared/component/searchbox";
import {BundlePurchaseService} from "../../../../service/purchase-bundle/bundle-purchase.service";

/**
 * 묶음상품 목록
 */
@Component({
  selector: 'app-bundlepurchase-list',
  templateUrl: './bundlepurchase-list.component.html',
  styleUrls: ['./bundlepurchase-list.component.scss']
})
export class BundlepurchaseListComponent extends CommonComponent implements OnInit {

  @ViewChild('searchBox') searchBox: SearchboxComponent;
  @ViewChild('dataGrid')  dataGrid : AgGridComponent;

  @Output('moveMngEvent') moveMngEventEmitter: EventEmitter<string> = new EventEmitter();

  search : any = {};
  grid : any = {};
  selectLists : any = {
    operationCode: []
  };

  constructor(private purchaseService: BundlePurchaseService) {
    super();

    purchaseService.searchBundleProductCodes().subscribe((res) => {
      let operationCode: Array<any> = res.operationCode.map((item) => {
        return { name: item.name, value: item.val == 1 };
      });

      this.init(operationCode);
    });
  }

  ngOnInit(): void {
  }

  private init(operationCode: Array<any>) : void {
    this.grid = {
      api: BundlePurchaseService.URL.SEARCH_PRODUCT_BUNDLE_LIST,
      isInitLoad: false,
      rowClassRules: {},
      columnDefs: [
        { headerName: '상품 이름', field: 'name', width: 150,
          cellRenderer: "buttonRenderer",
          cellRendererParams: {
            onClick: this.moveBundlePurchaseMng.bind(this)
          }
        },
        { headerName: '구성', field: 'mallNames', width: 400 },
        { headerName: '가격', field: 'price', width: 150 },
        { headerName: '운영 여부', field: 'operationName' },
        { headerName: '등록 일시', field: 'regDate', width: 150 },
        { headerName: '최종 수정 일시', field: 'modDate', width: 150 }
      ]
    };

    if (this.possibleRegister(true)) {
      this.grid.funcButtons = [
        {
          label: '묶음상품 등록',
          clickEventHandler: this.moveBundlePurchaseMng.bind(this)
        }
      ];
    }

    this.selectLists = {
      usableCode: operationCode,
      searchType: [
        { name: '상품 이름', value: 'name' },
        { name: '오디존 이름', value: 'mallName' }
      ]
    };

    this.search = {
      params: {
      },
      info: [
        { displayName: "운영 여부", nameWidth: '150', inputType: SearchInputType.select, id: 'operation',
          options: this.selectLists.usableCode, selectedValue: '', width: 150, class: '' },
        { displayName: "검색어", nameWidth: '150', inputType: SearchInputType.selText, id: 'searchType', searchCondComo: true,
          options: this.selectLists.searchType, selectedValue: '', width: 500, class: '', placeHolder: '', selTextValue: ' ', selectId: 'searchType', inputId: 'searchValue'},
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

        this.searchBundlePurchaseList(this.search.params);
      },
      clearBtnHandler: () : void => {
        this.searchBox.onSearchBtnClick(null);
      }
    };

    setTimeout(() => {
      this.searchBox.onSearchBtnClick(null);
    });
  }

  private searchBundlePurchaseList(params?: any): void {
    return this.dataGrid.getList(params);
  }

  /**
   * 묶음상품 관리 페이지로 이동
   *
   * @param event
   * @private
   */
  private moveBundlePurchaseMng(event) : void {
    this.moveMngEventEmitter.emit(event?.rowData?.seq);
  }

  /**
   * 페이지 갱신
   *  - 외부 컴포넌트 조작용
   */
  public refresh() : void {
    this.searchBundlePurchaseList();
  }
}
