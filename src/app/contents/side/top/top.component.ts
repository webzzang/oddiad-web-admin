import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {PasswordMngComponent} from "../../mypage/password-mng/password-mng.component";
import {ProfileMngComponent} from "../../mypage/profile-mng/profile-mng.component";
import {MyInfoService} from "../../../service/my-info/my-info.service";

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss']
})
export class TopComponent implements OnInit {

  profile: any = {};

  constructor(protected matDialog: MatDialog,
              protected myInfoService: MyInfoService) { }

  ngOnInit() {
    this.init();
  }

  /**
   * 페이지 초기화
   */
  init(): void {
    this.myInfoService.searchAccount().subscribe((res) => {
      this.profile = res;
    });
  }

  /**
   * 현재 사용자 비밀번호 변경 팝업 오픈
   */
  openPasswordMng(): void {
    this.matDialog.open(PasswordMngComponent, {
      maxWidth: '30vw',
      position: {
        top: '10%'
      },
      data: {
        openType: PasswordMngComponent.OPEN_TYPE.SELF
      }
    }).afterClosed().subscribe((modifyYn: string) => {
      if ('Y' == modifyYn) {
        this.logout();
      }
    });
  }

  /**
   * 현재 사용자 수정 팝업 오픈
   */
  openProfileMng(): void {
    this.matDialog.open(ProfileMngComponent, {
      maxWidth: '30vw',
      position: {
        top: '10%'
      }
    }).afterClosed().subscribe((result) => {
      if (PasswordMngComponent.RESULT_TYPE.CHANGE == result) {
        this.init();
      }
    });
  }

  /**
   * 로그아웃
   */
  logout(): void {
    sessionStorage.clear();
    location.href = '/';
  }
}
