import {Component, OnInit, ViewChild} from '@angular/core';
import {GroupListComponent} from "../../administrator/group/group-list/group-list.component";
import {GroupMngComponent} from "../../administrator/group/group-mng/group-mng.component";
import {PageType} from "../../../domain/vo/page-type.enum";

/**
 * 메세지 전송 이력
 */
@Component({
  selector: 'app-message-hist',
  templateUrl: './message-hist.component.html',
  styleUrls: ['./message-hist.component.scss']
})
export class MessageHistComponent implements OnInit {

  static readonly PATH: string = 'message/hist';

  @ViewChild('messageHistList') messageHistList: MessageHistComponent;

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
