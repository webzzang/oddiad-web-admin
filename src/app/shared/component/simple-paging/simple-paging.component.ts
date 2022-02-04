import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange} from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-simple-paging',
  templateUrl: './simple-paging.component.html',
  styleUrls: ['./simple-paging.component.scss']
})
export class SimplePagingComponent implements OnInit, OnChanges  {

  isView: boolean = true;

  @Input()
  currentPage:number = 1;

  maxPage: number = 0;
  limitPageCnt: number = 10;
  pages=[];

  @Input() totalCount: number;
  @Input() pageOnSize: number;
  @Output() currentPageEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    if (!this.pageOnSize) this.pageOnSize = 10;
  }

  ngOnChanges(changes: {[key: string]: SimpleChange}) {
    if (changes.totalCount) {
      if (changes.totalCount != null && changes.totalCount.currentValue > 0 ) {
        this.isView = true;
        this.getPager();
      } else {
        this.isView = false;
        this.getPager();
      }
    }
    if (changes.pageOnSize && changes.pageOnSize.currentValue) {
      this.currentPage = 1;
      this.getPager();
    }

    // 페이지 로딩 시에만 호출하도록..
    if (changes.currentPage && changes.currentPage.firstChange && changes.currentPage.currentValue) {
      this.currentPage = changes.currentPage.currentValue;
      this.getPager();
    }
  }

  ngOnInit() {

  }

  setFirstPage() {
    this.currentPage = 1;
    this.currentPageEvent.emit(this.currentPage);
    this.getPager();
  }

  setPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage = this.currentPage-1;
      this.currentPageEvent.emit(this.currentPage);
      this.getPager();
    }
  }

  setCurrentPage(idx: number) {
    this.currentPage = idx;
    this.currentPageEvent.emit(idx);
    this.getPager();
  }

  setNextPage() {
    if (this.currentPage < this.maxPage) {
      this.currentPage = this.currentPage+1;
      this.currentPageEvent.emit(this.currentPage);
      this.getPager();
    }
  }

  setLastPage() {
    this.currentPage = this.maxPage;
    this.currentPageEvent.emit(this.currentPage);
    this.getPager();
  }

  getPager() {
    // calculate total pages
    let totalPages = Math.ceil(this.totalCount / this.pageOnSize);
    this.maxPage = totalPages;

    let startPage: number, endPage: number;
    if (totalPages <= 10) {
      // less than 10 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 10 total pages so calculate start and end pages
      if (this.currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (this.currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = this.currentPage - 5;
        endPage = this.currentPage + 4;
      }
    }

    // create an array of pages to ng-repeat in the pager control
    this.pages = _.range(startPage, endPage + 1);
  }
}

