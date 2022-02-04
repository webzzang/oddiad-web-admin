import {Component, OnInit, ViewChild} from '@angular/core';
import {PageType} from "../../../domain/vo/page-type.enum";
import {PaymentListComponent} from "./payment-list/payment-list.component";

/**
 * 결제내역
 */
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  static readonly PATH: string = 'sales/payment';

  @ViewChild('paymentList') paymentList: PaymentListComponent;

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
