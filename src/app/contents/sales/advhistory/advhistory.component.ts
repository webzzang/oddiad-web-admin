import {Component, OnInit, ViewChild} from '@angular/core';
import {PageType} from "../../../domain/vo/page-type.enum";
import {AdvhistoryListComponent} from "./advhistory-list/advhistory-list.component";

/**
 * 광고내역
 */
@Component({
  selector: 'app-advhistory',
  templateUrl: './advhistory.component.html',
  styleUrls: ['./advhistory.component.scss']
})
export class AdvhistoryComponent implements OnInit {

  static readonly PATH: string = 'sales/advhistory';

  @ViewChild('advhistoryList') advhistoryList: AdvhistoryListComponent;

  /**
   * 페이지 분류
   */
  pageType = PageType;

  /**
   * 활성화 페이지 분류
   */
  activePageType: PageType = PageType.LIST;

  constructor() { }

  ngOnInit(): void {
  }
}
