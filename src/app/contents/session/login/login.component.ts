import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmService} from '../../../shared/component/confirm/confirm.service';
import {SessionService} from '../session.service';
import {TranslateService} from '@ngx-translate/core';
import {Utils} from '../../../shared/utils/utils';
import {NgxSpinnerService} from "ngx-spinner";
import * as _ from 'lodash';
import {MyInfoService} from "../../../service/my-info/my-info.service";
import {PasswordMngComponent} from "../../mypage/password-mng/password-mng.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  id: string;
  password: string;
  loginIdSave: boolean = false;

  constructor(private translate: TranslateService,
              private confirmService: ConfirmService,
              private sessionService: SessionService,
              private myInfoService : MyInfoService,
              private spinner: NgxSpinnerService,
              private router: Router,
              protected matDialog: MatDialog) { }

  ngOnInit() {
    if (!sessionStorage.getItem('accesstoken')) {
      let storedId: string = Utils.getCookie('id');

      if (storedId && 'undefined' != storedId) {
        this.id = storedId;
        this.loginIdSave = true;
      }
    }
  }

  /**
   * 로그인
   */
  login() {
    this.spinner.show('all-spinner');

    if (_.isEmpty(this.id)) {
      this.confirmService.alert("ID를 입력해주세요");
      return;
    } else if (_.isEmpty(this.password)) {
      this.confirmService.alert("비밀번호를 입력해주세요");
      return;
    }

    if (this.loginIdSave) {
      Utils.setCookie('id', this.id, 7);
    } else {
      Utils.deleteCookie('id');
    }

    this.spinner.show("full")
    this.sessionService.login({ email: this.id, password: this.password })
      .subscribe((res) => {
        this.spinner.hide("full");

        if (-1 < ['009', '011', '012'].indexOf(res.status)) {
          let message: string;
          let useInitPass: boolean = false;

          this.spinner.hide("full");

          switch (res.status) {
            case '009':
              message = '초기 비밀번호를 사용 중입니다.<br>비밀번호를 변경하여 주십시오.';
              useInitPass = true;
              break;
            case '011':
              message = '만료된 비밀번호 입니다.<br>비밀번호를 변경하여 주십시오.';
              break;
            case '012':
              message = '만료된 비밀번호 입니다.<br>비밀번호를 변경하여 주십시오.';
              break;
            default:
              message = res.message;
          }

          this.confirmService.alert(message).afterClosed().subscribe(() => {
            this.openPasswordMng(!useInitPass);
          });
        } else {
          if (res) {
            this.loginAfter(res);
          }
        }
      }, (error) => {
        this.spinner.hide("full");

        this.confirmService.alert(error.message);
      });
  }

  /**
   * 정상적인 로그인 후처리
   *
   * @param res
   * @private
   */
  private loginAfter(res) {
    sessionStorage.setItem('id', this.id);
    sessionStorage.setItem('accesstoken', res.accessToken);

    this.myInfoService.searchMenuList().subscribe((res) => {
      if (res) {
        sessionStorage.setItem('menuList', JSON.stringify(res));

        if (0 < res.length) {
          this.router.navigate([res[0].managerSubMenus[0].routerLink], { replaceUrl: true} );
        } else {
          this.confirmService.alert('접근 가능한 메뉴가 존재하지 않습니다.<br>관리자에게 문의하여 주십시오.').afterClosed().subscribe(() => {
            this.logout();
          });
        }
      }
    });
  }

  /**
   * 로그인 사용자 비밀번호 변경 팝업 오픈
   */
  openPasswordMng(activeExtensionButton: boolean): void {
    this.matDialog.open(PasswordMngComponent, {
      maxWidth: '30vw',
      position: {
        top: '10%'
      },
      data: {
        openType: PasswordMngComponent.OPEN_TYPE.LOGIN,
        activeExtensionButton: activeExtensionButton
      }
    }).afterClosed().subscribe((result) => {
      if (PasswordMngComponent.RESULT_TYPE.CHANGE == result) {
        this.logout();
      } else if (PasswordMngComponent.RESULT_TYPE.EXTENSION == result) {
        this.login();
      }
    });
  }

  /**
   * 로그아웃
   */
  logout() : void {
    sessionStorage.clear();
    window.location.href = '/';
  }
}
