import { Component, OnInit } from '@angular/core';

/**
 * ννΈλ QNA
 */
@Component({
  selector: 'app-partner-qna',
  templateUrl: './partner-qna.component.html',
  styleUrls: ['./partner-qna.component.scss']
})
export class PartnerQnaComponent implements OnInit {

  static readonly PATH: string = 'customer/service/partner-qna';

  constructor() { }

  ngOnInit(): void {
  }

}
