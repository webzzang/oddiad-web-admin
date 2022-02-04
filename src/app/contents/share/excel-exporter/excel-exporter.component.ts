import {Component, Input, OnInit} from '@angular/core';
import {ConfirmService} from "../../../shared/component/confirm/confirm.service";
import {Cell, Column, Row, Workbook, Worksheet} from "exceljs";
import {saveAs} from "file-saver";
import * as moment from "moment";
import {NgxSpinnerService} from "ngx-spinner";

/**
 * 스크립트를 이용한 엑셀 익스포터
 */
@Component({
  selector: 'app-excel-exporter',
  templateUrl: './excel-exporter.component.html',
  styleUrls: ['./excel-exporter.component.scss']
})
export class ExcelExporterComponent implements OnInit {

  @Input('fileName') fileName: string;
  @Input('sheetName') sheetName: string;
  @Input('headerNames') headerNames: Array<string>;
  @Input('columnNames') columnNames: Array<string>;
  @Input('columnWidths') columnWidths: Array<number>;
  @Input('list') list: Array<any>;
  @Input('buttonStyleClass') buttonStyleClass: string;
  @Input('hide') hide: boolean = false;

  constructor(private confirmService: ConfirmService,
              private spinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
  }

  /**
   * 엑셀 다운로드
   */
  public download(): void {
    if (this.isValidAttributes()) {
      this.spinnerService.show('full');

      let workbook: Workbook = new Workbook();
      let sheet   : Worksheet = workbook.addWorksheet(this.sheetName);
      let values  : Array<any>;

      sheet.addRow(this.headerNames);

      this.list.forEach((item) => {
        values = [];

        this.columnNames.forEach((columnName) => {
          values.push(item[columnName]);
        });

        sheet.addRow(values);
      });

      this.applyCellStyle(sheet);

      workbook.xlsx.writeBuffer().then((data) => {
        let blob: Blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});

        saveAs(blob, [this.fileName, moment().format('YYYYMMDDHHmmss')].join('_') );
      });

      this.spinnerService.hide('full');
    }
  }

  /**
   * 엑셀 다운로드 필수 데이타 체크
   */
  isValidAttributes(): boolean {
    let message: string = null;

    if (!this.fileName) {
      message = '파일명이 존재하지 않습니다.';
    } else if (!this.sheetName) {
      message = '시트명이 존재하지 않습니다.';
    } else if (!this.headerNames || 0 == this.headerNames.length) {
      message = '헤더가 존재하지 않습니다.';
    } else if (!this.columnNames || 0 == this.columnNames.length) {
      message = '컬럼명이 존재하지 않습니다.';
    } else if (!this.columnWidths || 0 == this.columnWidths.length) {
      message = '컬럼넓이가 존재하지 않습니다.';
    } else if (this.headerNames.length != this.columnNames.length) {
      message = '헤더와 컬럼명의 숫자가 일치하지 않습니다.';
    } else if (this.headerNames.length != this.columnWidths.length) {
      message = '헤더와 컬럼넓이의 숫자가 일치하지 않습니다.';
    } else if (!this.list || 0 == this.list.length) {
      message = '다운로드 데이타가 존재하지 않습니다.';
    }

    if (message) {
      this.confirmService.alert(message);
    }

    return null == message;
  }

  /**
   * 스타일 적용
   *
   * @param sheet
   */
  applyCellStyle(sheet: Worksheet): void {
    let headerRow: Row = sheet.getRow(1);
    let cell: Cell;

    this.headerNames.forEach((headerName, index) => {
      cell = headerRow.getCell(index + 1);
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'C7C7C7' }
      };

      cell.alignment = {
        horizontal: 'center'
      }
    });

    sheet.columns.forEach((column: Partial<Column>, index) => {
      column.width = this.columnWidths[index];
      column.border = {
        top: { style: 'thin'},
        left: { style: 'thin'},
        bottom: { style: 'thin'},
        right: { style: 'thin'}
      }
    });
  }
}
