import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-content-preview',
  templateUrl: './content-preview.component.html',
  styleUrls: ['./content-preview.component.scss']
})
export class ContentPreviewComponent implements OnInit {

  data: any;

  constructor(@Inject(MAT_DIALOG_DATA) data: any,
              protected dialogRef: MatDialogRef<ContentPreviewComponent>) {

    this.data = data;
  }

  ngOnInit(): void {
  }

  /**
   * 현재팝업 닫기
   */
  close(): void {
    this.dialogRef.close();
  }
}
