import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AdminAccountService} from "../../../../service/admin-account/admin-account.service";
import {Observable} from "rxjs";
import {ConfirmService} from "../../../../shared/component/confirm/confirm.service";
import {CommonComponent} from "../../../common-component";

/**
 * 관리자 계정 편집
 */
@Component({
  selector: 'app-account-mng',
  templateUrl: './account-mng.component.html',
  styleUrls: ['./account-mng.component.scss']
})
export class AccountMngComponent extends CommonComponent implements OnInit {

  @Output('moveListEvent') moveListEventEmitter: EventEmitter<string> = new EventEmitter();

  selectLists: any = {
    adminStatus: [],
    adminGroup : []
  };

  id: string;
  account : any = {};

  constructor(private confirmService: ConfirmService,
              private adminAccountService: AdminAccountService) {

    super();

    this.adminAccountService.searchCodes().subscribe(res => {
      if (0 == res.roleList.length) {
        this.confirmService.alert('관리자 그룹이 존재하지 않습니다.\n관리자 그룹을 등록하여 주십시오.')
      } else {
        this.selectLists.adminStatus = res.statusCode.map(item => {
          return {name: item.name, value: item.code};
        });

        this.selectLists.adminGroup = res.roleList.map(item => {
          return {name: item.name, value: item.seq};
        });
      }
    });
  }

  ngOnInit() : void {
  }

  /**
   * 관리자 정보 등록 or 수정
   */
  saveAccount() : void {
    let ob: Observable<any>;
    let params = Object.assign({}, this.account);
    params.phoneNumber = params.phoneNumber.replace(/-/g, '');

    if (!this.id) {
      ob = this.adminAccountService.register(params);
    } else {
      ob = this.adminAccountService.modify(params);
    }

    ob.subscribe((res) => {
      this.moveAccountList('Y');
    }, (res) => {
      if (res) {
        switch (res.status) {
          case '007':
            this.confirmService.alert('이미 존재하는 아이디입니다.<br>다시 입력하여 주십시오.');

            break;
          default:
            this.confirmService.alert(res.message);
        }
      }
    });
  }

  /**
   * 관리자 계정 관리 메뉴로 이동
   */
  moveAccountList(refreshYn: string) : void {
    this.moveListEventEmitter.emit(refreshYn);
  }

  /**
   * 관리자 계정 아이디 변경
   *  - 외부 컴포넌트 조작용
   *
   * @param id
   */
  public init(id: string) : void {
    this.id = id;

    if (this.id) {
      this.adminAccountService.search(this.id).subscribe((res) => {
        this.account = res;
      });
    } else {
      this.account = {
        id: '',
        memo: '',
        name: '',
        phoneNumber: '',
        stateCode: '',
        roleSeq: 0,
        regDate: null,
        loginDate: null
      };

      if (this.selectLists.adminGroup.length) {
        this.account.roleSeq = this.selectLists.adminGroup[0].value;
      }

      if (this.selectLists.adminStatus.length) {
        this.account.stateCode = this.selectLists.adminStatus[0].value;
      }
    }
  }

  /**
   * 관리자 계정 비밀번호 초기화
   */
  resetPassword() : void {
    this.adminAccountService.resetPassword(this.id).subscribe((res) => {
      this.confirmService.alert('초기화 되었습니다.');
    }, (res) => {
      this.confirmService.alert(res.message);
    });
  }
}

