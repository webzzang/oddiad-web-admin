import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {SearchboxComponent} from "../../../../shared/component/searchbox/searchbox.component";
import {AgGridComponent} from "../../../../shared/component/ag-grid/ag-grid.component";
import {SearchInputType} from "../../../../shared/component/searchbox";
import {AdminGroupService} from "../../../../service/admin-group/admin-group.service";
import {CommonComponent} from "../../../common-component";

/**
 * 관리자 그룹 목록
 */
@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent extends CommonComponent implements OnInit {

  @ViewChild('searchBox') searchBox: SearchboxComponent;
  @ViewChild('dataGrid')  dataGrid : AgGridComponent;

  @Output('moveMngEvent') moveMngEventEmitter: EventEmitter<string> = new EventEmitter();

  search : any = {};
  grid : any = {};
  selectLists : any = {};

  constructor(protected adminGroupService : AdminGroupService) {
    super();

    this.init();
  }

  ngOnInit() : void {
  }

  private init() : void {
    this.grid = {
      api: AdminGroupService.URL.SEARCH_LIST,
      isInitLoad: false,
      rowClassRules: {},
      columnDefs: [
        { headerName: '그룹 이름', field: 'name', width: 300,
          cellRenderer: "buttonRenderer",
          cellRendererParams: {
            onClick: this.moveGroupMng.bind(this)
          }
        },
        { headerName: '사용 여부', field: 'name', width: 150 },
        { headerName: '등록 일시', field: 'regDate', width: 150 },
        { headerName: '최종 수정 일시', field: 'modDate', width: 150 }
      ]
    };

    if (this.possibleRegister(true)) {
      this.grid.funcButtons = [
        {
          label: '관리자 그룹 등록',
          clickEventHandler: this.moveGroupMng.bind(this)
        }
      ];
    }

    this.selectLists = {
      usable: [
        { name: '사용', value: true },
        { name: '미사용', value: false }
      ]
    };

    this.search = {
      params: {},
      info: [
        { displayName: "사용 여부", nameWidth: '150', inputType: SearchInputType.select, id: 'usable', width: 150, class: '',
          options: this.selectLists.usable, selectedValue: '' },
        { displayName: "그룹 이름", nameWidth: '150', inputType: SearchInputType.text, id: 'name', width: 150, class: '',
          placeHolder: '' },
      ],
      searchBtnHandler: ($event) : void => {
        this.search.params = $event;

        this.searchGroupList(this.search.params);
      },
      clearBtnHandler: () : void => {
        this.searchBox.onSearchBtnClick(null);
      }
    };

    setTimeout(() => {
      this.searchBox.onSearchBtnClick(null);
    });
  }

  /**
   * 관리자 그룹 목록 조회
   * ex flyer company
   * @param params 조회조건
   * @private
   */
  private searchGroupList(params) : void {
    this.dataGrid.getList(params);
  }

  /**
   * 관리자 그룹 관리 페이지로 이동
   *
   * @param event
   * @private
   */
  private moveGroupMng(event) : void {
    this.moveMngEventEmitter.emit(event?.rowData?.seq);
  }

  /**
   * 페이지 갱신
   *  - 외부 컴포넌트 조작용
   */
  public refresh() : void {
    this.searchGroupList(this.search.params);
  }
}
