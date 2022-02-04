import {Component, OnInit, ViewChild} from '@angular/core';
import {PageType} from "../../../domain/vo/page-type.enum";
import {TermsService} from "../../../service/terms/terms.service";
import {LivestreamMngComponent} from "./livestream-mng/livestream-mng.component";

/**
 * 라이브스트림
 */
@Component({
  selector: 'app-livestream',
  templateUrl: './livestream.component.html',
  styleUrls: ['./livestream.component.scss']
})
export class LivestreamComponent implements OnInit {

  static readonly PATH : string = 'advertisement/content/livestream';

  @ViewChild('livestreamMng')  livestreamMng : LivestreamMngComponent;

  /**
   * 페이지 분류
   */
  pageType = PageType;

  /**
   * 활성화 페이지 분류
   */
  activePageType: PageType = PageType.FORM;

  constructor(protected termsService: TermsService) { }

  ngOnInit(): void {
  }
}
