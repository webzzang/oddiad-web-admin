import {Component, Inject, OnInit} from '@angular/core';
import {MyInfoService} from "../../../service/my-info/my-info.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ConfirmService} from "../../../shared/component/confirm/confirm.service";
import {Utils} from "../../../shared/utils/utils";

enum openType {'LOGIN', 'SELF'};
enum resultType {'CHANGE', 'EXTENSION', 'CANCEL'};

/**
 * 현재 사용자 비밀번호 변경
 */
@Component({
  selector: 'app-password-mng',
  templateUrl: './password-mng.component.html',
  styleUrls: ['./password-mng.component.scss']
})
export class PasswordMngComponent implements OnInit {
  public static readonly OPEN_TYPE = openType;
  public static readonly RESULT_TYPE = resultType;

  data: any = {};
  password: any = {};
  openType = openType;
  resultType = resultType;
  ignoreDays: number = 180;

  constructor(@Inject(MAT_DIALOG_DATA) data: any,
              protected myInfoService: MyInfoService,
              protected dialogRef: MatDialogRef<PasswordMngComponent>,
              protected confirmService: ConfirmService) {
    this.data = data;
  }

  ngOnInit(): void {
  }

  /**
   * 나의 비밀번호 변경
   */
  modifyPassword(): void {
    if (!Utils.validPassword(this.password.new)) {
      this.confirmService.alert('신규 비밀번호는 영문,숫자,특수문자 중<br>2개를 혼합하여 10자리 이상 혹은<br>3개를 포함하여 8자리 이상 입력하여 주십시오.');
    } else if (this.password.old == this.password.new) {
      this.confirmService.alert('현재 비밀번호는 사용할 수 없습니다.<br>다시 입력하여 주십시오.');
    } else {
      this.confirmService.confirm('비밀번호를 변경 하시겠습니까?').afterClosed().subscribe((confirmYn) => {
        this.myInfoService.modifyPassword(this.password.old, this.password.new).subscribe((res) => {
          if ('001' == res.status) {
            this.confirmService.alert('현재 비밀번호가 잘못되었습니다.<br>다시 입력하여 주십시오.');
          } else {
            this.confirmService.alert('비밀번호가 변경되었습니다.<br>다시 로그인하여 주십시오.').afterClosed().subscribe(() => {
              this.close(resultType.CHANGE);
            });
          }
        });
      });
    }
  }

  /**
   * 일정기간동안 비밀번호 변경 알림 무시
   */
  modifyPasswordPeriod(): void {
    this.confirmService.alert([this.ignoreDays, '일 동안 비밀번호가 연장됩니다.'].join('')).afterClosed().subscribe(() => {
      this.myInfoService.modifyPasswordPeriod().subscribe(() => {
        this.close(resultType.EXTENSION);
      });
    });
  }

  /**
   * 현재 팝업 닫기
   */
  close(result: resultType): void {
    this.dialogRef.close(result);
  }
}
