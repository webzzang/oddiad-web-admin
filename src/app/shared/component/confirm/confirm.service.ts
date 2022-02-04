/* Neo Confirm, Neo Alert
 * SKBP 2017.11.
 * 관리자.
 * Angular Material 사용
*/
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ConfirmComponent } from './confirm.component';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ConfirmService {

  constructor(public dialog: MatDialog, public lang: TranslateService) {}

  confirm(message: string, option?: NeoConfirmOption): MatDialogRef<{}> {
    let dialogWidth = 408;
    if(option){
      if(option.width){
        dialogWidth = option.width;
      }
    }

    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: dialogWidth + 'px',
      data : {type: 'confirm', _message: message, option: option},
      disableClose: true
    });

    return dialogRef;
  }

  alert(message: string, option?: NeoConfirmOption): MatDialogRef<{}> {

    let dialogWidth = 408;
    if(option){
      if(option.width){
        dialogWidth = option.width;
      }
    }

    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: dialogWidth + 'px',
      data : {type: 'alert', _message: message, option: option},
      disableClose: true
    });
    return dialogRef;
  }

  confirmLang(code: string): MatDialogRef<{}> {
    return this.confirm(this.lang.instant(code));
  }

  alertLang(code: string): MatDialogRef<{}> {
    return this.alert(this.lang.instant(code));
  }

  alertError() {
    return this.alert("오류가 발생하였습니다<br />잠시 후 다시 시도해 주시기 바랍니다");
  }

  alertInputRequire(target) {
    return this.alert(target + " 항목을 입력해주세요");
  }
  alertChooseRequire(target) {
    return this.alert(target + " 항목을 선택해주세요");
  }
}

interface NeoConfirmOption {
  align?: string;
  width?: number;
}
