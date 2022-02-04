import { Component, OnInit } from '@angular/core';
import { AgGridService } from '../ag-grid.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-ag-grid-header',
  templateUrl: './ag-grid-header.component.html',
  styleUrls: ['./ag-grid-header.component.scss']
})
export class AgGridHeaderComponent implements OnInit {

  header;
  headerAlign = "center";
  colId;

  useSort = true;
  excludeSort = false;
  sortOrder = 0;
  //sortOrderImg = ['arrow-middle','arrow-down','arrow-up'];
  sortOrderImg = ['sort_both', 'sort_desc', 'sort_asc'];

  constructor(private service: AgGridService) { }

  ngOnInit() {
  }

  agInit(params): void {
    this.header = params;
    this.colId = this.header.column.colId;

    if (this.header.align) {
      this.headerAlign = this.header.align;
    }

    if (this.header.useSort == false) {
      this.useSort = false;
    } else {
      this.useSort = true;
    }

    // 헤더 checkbox 설정이 있으면 sorting 기능 불가.
    if (this.header.column.userProvidedColDef.headerName == "NO" || this.header.column.userProvidedColDef.headerName == ' ') {
      this.excludeSort = true;
    }

    // 특정 컬럼 소팅 불가
    _.forEach(['seq', 'email', 'phoneNumber', 'contents'], (name) => {
      let colId: string = this.header.column.colId;

      if (-1 < colId.toLowerCase().indexOf(name.toLowerCase()) || 'id' == colId.toLowerCase()) {
        this.excludeSort = true;

        return false;
      }
    })
  }

  onSort() {
    this.sortOrder++;
    if (this.sortOrder > 2) {
      this.sortOrder = 0;
    }
    let orderBy = '';
    switch (this.sortOrder) {
      case 0: { orderBy = ''; break; }
      case 1: { orderBy = 'asc'; break; }
      case 2: { orderBy = 'desc'; break; }
    }

    this.service.call({ gridId: this.header.gridId, type: 'sort', id: this.colId, sort: orderBy });
  }

}
