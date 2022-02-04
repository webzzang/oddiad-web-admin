import {ConfirmService} from './../confirm/confirm.service';
import {AgGridService} from './ag-grid.service';
import {Utils} from './../../utils/utils';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as _ from 'lodash';
import {NgxSpinnerService} from 'ngx-spinner';
import {TranslateService} from '@ngx-translate/core';
import {AgGridHeaderComponent} from './ag-grid-header/ag-grid-header.component';
import {ButtonRendererComponent} from '../buttonRenderer/button-renderer.component'

@Component({
  selector: 'app-ag-grid',
  templateUrl: './ag-grid.component.html',
  styleUrls: ['./ag-grid.component.scss']
})
export class AgGridComponent implements OnInit {

  @Input() api = '';
  @Input() apiParams: any;
  @Input() isInitLoad = true; // 그리드 load complete 후 api 통신 여부

  // ag grid control
  agGrid;
  agGridColumn;

  @Input() columnDefs = []; // 컬럼 정보 ( 추가 사용가능 기능 valueFormatter )
  @Input() defaultColDef = {}; // 총괄적인 기본 컬럼 정보
  @Input() rowDataList = []; // 그리드 데이터
  @Input() rowClassRules; // 그리드 row 관련 css 설정

  @Input() pageOnSize = 10;
  @Input() currentPage = 1;
  pageSizeList = [];
  itemCount = 0;

  @Input() disablePageNo = false; // 하단 페이징 번호 사용여부
  @Input() multiRowSelection = false; // row selection의 기본값은 single, 멀티 선택은 multiple로 외부주입으로 사용함. 관리자 07.20
  @Input() useScrollX = false; // 가로 스크롤 사용여부
  @Input() gridHeight = "450"; // 그리드 높이
  @Input() rowHeight = "36"; // 그리드 row 높이
  @Input() headerHeight = "40"; // 그리드 header 높이
  @Input() isRowSelectable = () => { return true; }; // 그리드 row 의 선택 가능여부 설정

  @Input() autoSize = false; // 그리드 전체 넓이 데이터에 맞게 자동 조절(가로 스크롤 생길수 있음)
  @Input() enableFilterYn = false;

  @Input() funcButtons = [];

  @Output() cellClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() rowClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() rowDoubleClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() totalCountChange: EventEmitter<any> = new EventEmitter<any>();

  @Output() modalJoin: EventEmitter<any> = new EventEmitter<any>();

  orderby = {};

  gridId = Utils.uuid(); // 그리드 unique id
  rowSelection = 'single'; // 그리드 row 멀티 선택 기능, multiRowSelection 으로 rowSelection 을 변경하여 사용됨
  dataEmptyText = "Empty"; // 그리드 데이터 없을시 보여지는 default text

  frameworkComponents = {
    agColumnHeader: AgGridHeaderComponent,
    buttonRenderer: ButtonRendererComponent
  }; // 주석으로 필요시 사용 미사용 설정
  // frameworkComponents = null;

  viewGrid = false;

  constructor(private service: AgGridService,
    private spinner: NgxSpinnerService,
    private confirm: ConfirmService,
    private lang: TranslateService) {
    service.subject$.subscribe(data => {
      if (data.gridId == this.gridId) {
        if (data.type == 'sort') {
          this.changeOrderby(data.id, data.sort);
        }
      }
    });

    this.pageSizeList.push({value:10, label:'10개씩'});
    this.pageSizeList.push({value:20, label:'20개씩'});
    this.pageSizeList.push({value:30, label:'30개씩'});
    this.pageSizeList.push({value:50, label:'50개씩'});
    this.pageSizeList.push({value:100, label:'100개씩'});
  }

  ngOnInit() {
    this.dataEmptyText = '검색 결과가 존재하지 않습니다.';
    this.rowSelection = this.multiRowSelection ? 'multiple' : 'single';

    // columnDefs 와 defaultColDef 기본설정.
    // defaultColDef 에 설정해놔도 columnDefs 에 설정한 항목이 우선적용이고 defaultColDef 에 있는 항목에 columnDefs 을 merge 하지않고
    // 변경하는 방식이라 일일히 항목이 있는지 체크하여 값을 넣어줌.
    if (this.defaultColDef) {
      // 요구사항 있기전까지는 막아놓음.
      this.defaultColDef['resizable'] = true;
      this.defaultColDef['lockPosition'] = true;

      // 기본 cell align 은 center 로 설정.
      if (this.defaultColDef['cellStyle']) {
        if (!this.defaultColDef['cellStyle']['text-align']) {
          this.defaultColDef['cellStyle']['text-align'] = "center";
        }
      } else {
        this.defaultColDef['cellStyle'] = { 'text-align': 'center' }
        // this.defaultColDef['cellStyle'] = { 'display': 'flex', 'align-items': 'center', 'justify-content': 'center', 'padding-left': '12px', 'padding-right': '12px', 'overflow': 'hidden'}
      }

      if (this.defaultColDef['headerComponentParams']) {
        let hdCompParams = this.defaultColDef['headerComponentParams'];
        hdCompParams['gridId'] = this.gridId;
        if (hdCompParams['useSort'] == false) {
          hdCompParams['useSort'] = false;
        } else {
          hdCompParams['useSort'] = true;
        }
      } else {
        this.defaultColDef['headerComponentParams'] = { gridId: this.gridId, useSort: true };
      }
    } else {
      this.defaultColDef = {
        resizable: true,
        lockPosition: true,
        cellStyle: { 'text-align': 'center' },
        headerComponentParams: { gridId: this.gridId, useSort: true }
      }
    }

    if (this.columnDefs) {
      _.each(this.columnDefs, column => {
        if (column['cellStyle']) {
          let cellStyle = column['cellStyle'];
          if (!cellStyle['text-align']) {
            // cellStyle 은 있는데 의 text-align 이 없으면 center 로 기본 설정.
            cellStyle['text-align'] = "center";
          }
        }
        if (!column['headerComponentParams']) {
          column['headerComponentParams'] = {};
        }
        _.keys(this.defaultColDef['headerComponentParams']).forEach(key => {
          let hdCompParams = column['headerComponentParams'];
          if (!hdCompParams[key]) {
            hdCompParams[key] = this.defaultColDef['headerComponentParams'][key];
          }
        });
      });
    }

    // 그리드 관련 옵션 정리를 끝내고 그리드를 그린다.
    this.drawGrid();
  }

  drawGrid() {
    this.viewGrid = true;
  }

  setSizeColumnFit() {
    if (!this.useScrollX) {
      //화면 꽉 차게. -관리자.
      this.agGrid.sizeColumnsToFit();
    }
  }

  onGridReady(grid) {
    this.agGrid = grid.api;
    this.agGridColumn = grid.columnApi;

    if (this.isInitLoad) {
      this.getList();
    }

    if (this.autoSize) {
      this.autoSizeAll(2);
    } else {
      this.setSizeColumnFit();
    }
  }

  onGridSizeChanged(grid) {
    if (this.autoSize) {
      this.autoSizeAll(2);
    } else {
      this.setSizeColumnFit();
    }
  }

  //, option?
  public getList(params?) {
    // settimeout 으로 감싸서 지연시키지않으면
    //  onGridReady 에서 getList 호출대신 parent component 에서 afterviewinit 에서 직접 getList 호출시 spinner 가 오류 일으킴...
    setTimeout(() => {
      this.getApiList(params);
    }, 1);
  }

  //, option?
  private getApiList(params?) {
    if (this.api) {
      if (params) {
        this.currentPage = 1;
        this.apiParams = params;
      }

      if (!this.apiParams) {
        this.apiParams = {};
      }

      if (!this.disablePageNo) {
        this.apiParams['pageNo'] = this.currentPage;
        this.apiParams['pageSize'] = this.pageOnSize;
      }

      if (_.size(_.keys(this.orderby)) > 0) {
        let orders = [];
        _.keys(this.orderby).forEach(key => {
          orders.push(key + " " + this.orderby[key]);
        });
        // orderby key 입력순서 보장됨.
        this.apiParams['orderBy'] = _.join(orders, ', ');
      } else {
        delete this.apiParams['orderBy'];
      }

      this.spinner.show(this.gridId);
      // this.agGrid.showLoadingOverlay();

      this.service.getList(this.api, this.apiParams).subscribe(res => {
        this.spinner.hide(this.gridId);
        // this.agGrid.hideOverlay();

        if (res) {
          if (!this.disablePageNo) {
            this.rowDataList = res.data;//페이징 있는 화면
          } else {
            this.rowDataList = res;//페이징 없는 화면
          }

          this.dataFormatting();

          _.each(this.rowDataList, row => {
            // formattedDateString(data.value, '-');
          });

          if (!this.disablePageNo) {//페이징 있는 화면
            this.itemCount = res.total;
            this.totalCountChange.emit(this.itemCount);
          } else {//페이징 없는 화면
            this.itemCount = this.rowDataList.length;
            this.totalCountChange.emit(this.itemCount);
          }

          if (this.autoSize) {
            this.autoSizeAll(2);
          } else {
            this.setSizeColumnFit();
          }
          // option.

        }
      }, err => {
        this.spinner.hide(this.gridId);
        // this.agGrid.hideOverlay();
        console.log("# ag-grid err -> ", err);
        if (err.body) {
          if (err.body.message) {
            this.confirm.alert(err.body.message);
          }
        }
      });
    } else {
      console.log("# ag-grid api is empty");
    }
  }

  public selectRows() {
    return this.agGrid.getSelectedRows();
  }

  onRowClick(item: any) {
    this.rowClick.emit({
      data: item.data,
      index: item.rowIndex
    });
  }

  onRowDoubleClick(item: any) {
    this.rowDoubleClick.emit({
      data: item.data,
      index: item.rowIndex
    });
  }

  /** 외부 search box 검색 호출용 */
  searchPage(data: any, currentPage: number) {
    this.currentPage = currentPage;
    this.getList(data);
  }

  /** page button click */
  setPageSize(pageSize: number) {
    this.pageOnSize = pageSize;
    this.getList();
  }

  /** page button click */
  setPageNo(currentPage: number) {
    this.changePageInfo(currentPage);
  }

  /** 페이지 정보를 변경한다. */
  private changePageInfo(currentPage: number) {
    this.currentPage = currentPage;
    this.getList();
  }

  /** order by 정보를 변경한다. */
  private changeOrderby(id, orderby) {
    if (!orderby) {
      delete this.orderby[id];
    } else {
      this.orderby[id] = orderby;
    }
    this.getList();
  }

  private dataFormatting() {
    let formatDateRow = _.filter(this.columnDefs, { format: 'date' });
    if (_.size(formatDateRow) > 0) {
      _.each(formatDateRow, formatRow => {
        let key = formatRow.field;
        _.each(this.rowDataList, row => {
          if (row[key]) {
            row[key] = Utils.formattedDateString(row[key], '-')
          }
        });
      });
    }

    let formatCommaRow = _.filter(this.columnDefs, { format: 'comma' });
    if (_.size(formatCommaRow) > 0) {
      _.each(formatCommaRow, formatRow => {
        let key = formatRow.field;
        _.each(this.rowDataList, row => {
          if (row[key]) {
            row[key] = Utils.comma(row[key]);
          }
        });
      });
    }

    let formatPhoneRow = _.filter(this.columnDefs, { format: 'phone' });
    if (_.size(formatPhoneRow) > 0) {
      _.each(formatPhoneRow, formatRow => {
        let key = formatRow.field;
        _.each(this.rowDataList, row => {
          if (row[key]) {
            row[key] = Utils.mobilePhoneFormatter(row[key]);
          }
        });
      });
    }

    let formatPhoneStarRow = _.filter(this.columnDefs, { format: 'phoneWithStar' });
    if (_.size(formatPhoneStarRow) > 0) {
      _.each(formatPhoneStarRow, formatRow => {
        let key = formatRow.field;
        _.each(this.rowDataList, row => {
          if (row[key]) {
            row[key] = Utils.mobilePhoneWithStarFormatter(row[key]);
          }
        });
      });
    }

    let formatTimeRow = _.filter(this.columnDefs, { format: 'time' });
    if (_.size(formatTimeRow) > 0) {
      _.each(formatTimeRow, formatRow => {
        let key = formatRow.field;
        _.each(this.rowDataList, row => {
          if (row[key]) {
            row[key] = Utils.timeFormatter(row[key]);
          }
        });
      });
    }

  }

  // 컬럼 사이즈를 value 크기에 맞게 잡히게 설정. ( sizeColumnsToFit 이 적용 해제됨. )
  autoSizeAll(skipHeader) {
    var allColumnIds = [];
    this.agGridColumn.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.colId);
    });
    this.agGridColumn.autoSizeColumns(allColumnIds, skipHeader);
  }

  getOrderByLatest() {
    if (_.size(_.keys(this.orderby)) > 0) {
      let orders = [];
      _.keys(this.orderby).forEach(key => {
        orders.push(key + " " + this.orderby[key]);
      });
      return _.join(orders, ', ');
    }
    return null;
  }

  pageSizeChange() : void {
    this.getList(this.apiParams);
  }
}
