import {Component, OnInit, ViewChild} from '@angular/core';
import {PageType} from "../../../domain/vo/page-type.enum";
import {ProvideListComponent} from "./provide-list/provide-list.component";
import {ProvideMngComponent} from "./provide-mng/provide-mng.component";

/**
 * 제3자 정보제공 이용동의 약관
 */
@Component({
  selector: 'app-provide',
  templateUrl: './provide.component.html',
  styleUrls: ['./provide.component.scss']
})
export class ProvideComponent implements OnInit {

  static readonly PATH: string = 'clause/provide';

  @ViewChild('provideList') provideList: ProvideListComponent;
  @ViewChild('provideMng')  provideMng : ProvideMngComponent;

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

  /**
   * 정보제공 약관 편집측의 화면전환 이벤트 핸들러
   *
   * @param refreshYn
   */
  moveListEventHandler(refreshYn: string) : void {
    this.activePageType = PageType.LIST;

    if ('Y' == refreshYn) {
      this.provideList.refresh();
    }
  }

  /**
   * 정보제공 약관 목록측의 화면전환 이벤트 핸들러
   *
   * @param seq
   */
  moveMngEventHandler(seq: number) : void {
    this.activePageType = PageType.FORM;

    setTimeout(() => {
      this.provideMng.init(seq);
    });
  }
}
