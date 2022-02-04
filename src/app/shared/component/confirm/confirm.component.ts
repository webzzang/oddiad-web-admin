import {Component, OnInit, Inject, Optional, ViewEncapsulation} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm',
  template: `
      <div class="modal-content">
        <div class="modal-body text-center">
            <div class="model-confirm-msg" [innerHtml]="confirmMessage" [style.text-align]="messageAlign"></div>
            <hr class="mt0-i mb0-i" />
            <div class="pt15-i pb15-i">
              <ng-template [ngIf]="windowType == 'alert'">
                <button type="button" class="btn-confirm w70 h40" (click)="onClickOk()">확인</button>
              </ng-template>
              <ng-template [ngIf]="windowType == 'confirm'">
                  <button type="button" class="btn-confirm w70 h40" (click)="onClickYes($event)">확인</button>
                  <button type="button" class="btn-cancel w70 h40 ml10" (click)="onClickNo($event)">취소</button>
              </ng-template>
            </div>
        </div>
      </div>
  `,
  styleUrls:['./confirm.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfirmComponent implements OnInit {
  confirmTitle = 'title';
  confirmMessage = 'message';

  windowType = 'confirm';
  messageAlign = "center";

  option: any;

  constructor(@Inject(MatDialogRef) private dialogRef: MatDialogRef<ConfirmComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.windowType = data.type;
    this.confirmTitle = data._title;
    this.confirmMessage = data._message;
    this.option = data.option;
    if(this.option){
      if(this.option.align){
        this.messageAlign = this.option.align;
      }
    }
  }

  ngOnInit() {
  }

  onClickYes(event: any) {
    this.dialogRef.close('Y');
  }

  onClickNo(event: any) {
    this.dialogRef.close('N');
  }

  onClickOk() {
    this.dialogRef.close();
  }
}
