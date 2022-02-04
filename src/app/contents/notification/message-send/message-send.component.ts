import {Component, OnInit, ViewChild} from '@angular/core';
import {PageType} from "../../../domain/vo/page-type.enum";
import {MessageSendMngComponent} from "./message-send-mng/message-send-mng.component";

@Component({
  selector: 'app-message-send',
  templateUrl: './message-send.component.html',
  styleUrls: ['./message-send.component.scss']
})
export class MessageSendComponent implements OnInit {

  static readonly PATH: string = 'message/send';

  @ViewChild('messageSendMng') messageSendMng: MessageSendMngComponent;

  /**
   * 페이지 분류
   */
  pageType = PageType;

  /**
   * 활성화 페이지 분류
   */
  activePageType: PageType = PageType.FORM;

  constructor() { }

  ngOnInit(): void {
  }
}
