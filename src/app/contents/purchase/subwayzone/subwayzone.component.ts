import {Component, OnInit, ViewChild} from '@angular/core';
import {SubwayzoneMngComponent} from "../subwayzone/subwayzone-mng/subwayzone-mng.component";

/**
 * 지하철
 */
@Component({
  selector: 'app-subwayzone',
  templateUrl: './subwayzone.component.html',
  styleUrls: ['./subwayzone.component.scss']
})
export class SubwayzoneComponent implements OnInit {

  static readonly PATH: string = 'purchase/subwayzone/config';

  @ViewChild('subwayzoneMng')  subwayzoneMng : SubwayzoneMngComponent;

  constructor() { }

  ngOnInit(): void {
  }

}
