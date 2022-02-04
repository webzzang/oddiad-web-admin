import {Component, OnInit, ViewChild} from '@angular/core';
import {OddizoneMngComponent} from "./oddizone-mng/oddizone-mng.component";
import {PageType} from "../../../domain/vo/page-type.enum";

/**
 * 오디존
 */
@Component({
  selector: 'app-oddizone',
  templateUrl: './oddizone.component.html',
  styleUrls: ['./oddizone.component.scss']
})
export class OddizoneComponent implements OnInit {

  static readonly PATH: string = 'purchase/oddizone/config';

  @ViewChild('oddizoneMng')  oddizoneMng : OddizoneMngComponent;

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
