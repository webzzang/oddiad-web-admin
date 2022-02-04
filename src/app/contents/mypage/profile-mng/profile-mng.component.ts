import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {MyInfoService} from "../../../service/my-info/my-info.service";
import {ConfirmService} from "../../../shared/component/confirm/confirm.service";

/**
 * 현재사용자 정보 변경
 */
@Component({
  selector: 'app-profile-mng',
  templateUrl: './profile-mng.component.html',
  styleUrls: ['./profile-mng.component.scss']
})
export class ProfileMngComponent implements OnInit {

  account: any = {};

  constructor(protected myInfoService: MyInfoService,
              protected confirmService: ConfirmService,
              protected dialogRef: MatDialogRef<ProfileMngComponent>) {

    this.myInfoService.searchAccount().subscribe((res) => {
      this.account = res;
    });
  }

  ngOnInit(): void {
  }

  /**
   * 현재 사용자 정보 저장
   */
  saveAccount(): void {
    this.confirmService.confirm('개인정보를 저장하시겠습니까?').afterClosed().subscribe((confirmYn) => {
      if ('Y' == confirmYn) {
        let account: any = Object.assign({}, this.account);
        account.phoneNumber = account.phoneNumber.replace(/-/g, '');

        this.myInfoService.modifyAccount(account).subscribe(() => {
          this.close('Y');
        });
      }
    });
  }

  /**
   * 현재 팝업 닫기
   */
  close(successYn: string): void {
    this.dialogRef.close(successYn);
  }
}
