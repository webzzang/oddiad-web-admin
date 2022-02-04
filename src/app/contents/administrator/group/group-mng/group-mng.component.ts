import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Observable} from "rxjs";
import {AdminGroupService} from "../../../../service/admin-group/admin-group.service";
import {ConfirmService} from "../../../../shared/component/confirm/confirm.service";
import {CommonComponent} from "../../../common-component";
import {NgxSpinnerService} from "ngx-spinner";

/**
 * 관리자 그룹 관리
 */
@Component({
  selector: 'app-group-mng',
  templateUrl: './group-mng.component.html',
  styleUrls: ['./group-mng.component.scss']
})
export class GroupMngComponent extends CommonComponent implements OnInit {

  @Output('moveListEvent') moveListEventEmitter: EventEmitter<string> = new EventEmitter();

  seq: number;
  group: any = {};
  notis: Array<any> = [];
  menus: any = {};
  selectLists: any = {
    usable: []
  };
  
  constructor(protected adminGroupService: AdminGroupService,
              protected confirmService: ConfirmService,
              protected spinnerService: NgxSpinnerService) {

    super();

    this.selectLists = {
      usable: [
        { name: '사용', value: true },
        { name: '미사용', value: false }
      ]
    };
  }

  ngOnInit(): void {
  }

  /**
   * 관리자 그룹 등록 or 수정
   */
  saveGroup() : void {
    let ob: Observable<any>;

    this.removeLogicalData(this.menus);
    this.spinnerService.show('full');

    if (!this.seq) {
      ob = this.adminGroupService.register(this.group);
    } else {
      this.notis.forEach((noti) => {
        noti.roleSeq = this.seq
      });

      ob = this.adminGroupService.modify(this.group);
    }

    ob.subscribe((res) => {
      this.moveGroupList('Y');

      this.spinnerService.hide('full');
    });
  }

  /**
   * 관리자 그룹 관리 메뉴로 이동
   */
  moveGroupList(refreshYn: string) : void {
    this.moveListEventEmitter.emit(refreshYn);
  }

  /**
   * 관리자 그룹 아이디 변경
   *  - 외부 컴포넌트 조작용
   *
   * @param seq
   */
  public init(seq: number) : void {
    this.seq = seq;

    if (this.seq) {
      this.adminGroupService.search(this.seq).subscribe((res) => {
        this.group = res;
        this.notis = res.managerNotificationList;
        this.menus.roleMenus = res.roleMenus;

        this.insertLogicalData(this.menus);
      });
    } else {
      this.adminGroupService.searchDefault().subscribe((res) => {
        this.group = res;
        this.notis = res.managerNotificationList;
        this.menus.roleMenus = res.roleMenus;
        this.menus.usable = true;

        this.insertLogicalData(this.menus);
        this.changeChildrenMenuAuthority(this.menus);
      });
    }
  }

  /**
   * 화면 구현용 데이타 삽입
   *
   * @param menu
   */
  insertLogicalData(menu: any): void {
    if (!menu.roleMenus && !menu.subMenus) {
      this.changeParentMenuAuthority(menu);
    }

    (menu.roleMenus || menu.subMenus || []).forEach((childrenMenu) => {
      childrenMenu.parentRef = menu;

      this.insertLogicalData(childrenMenu);
    });
  }

  /**
   * 화면 구현용 데이타 제거
   *
   * @param menu
   */
  removeLogicalData(menu: any): void {
    if (menu.parentRef) {
      delete menu.parentRef;
    }

    (menu.roleMenus || menu.subMenus || []).forEach((childrenMenu) => {
      this.removeLogicalData(childrenMenu);
    });
  }

  /**
   * 현재 메뉴를 기준으로 부모 메뉴의 선택 상태를 변경
   *
   * @param menu
   */
  changeParentMenuAuthority(menu: any): void {
    if (menu.parentRef) {
      setTimeout(() => {
        let hasRoleMenus: boolean = menu.parentRef.roleMenus;
        let hasSubMenus : boolean = menu.parentRef.subMenus;
        let childrenMenus = hasRoleMenus ? menu.parentRef.roleMenus : menu.parentRef.subMenus;

        if (hasRoleMenus || hasSubMenus) {
          menu.parentRef.usable = false;

          if (hasSubMenus) {
            if (menu.searchAuthority) {
              menu.usable = true;
            } else {
              menu.usable = false;
              menu.regAuthority = false;
              menu.modAuthority = false;
              menu.delAuthority = false;
            }
          }

          childrenMenus.some((childrenMenu) => {
              if (childrenMenu.usable) {
                childrenMenu.parentRef.usable = true;

                return true;
              }
          });
        }

        this.changeParentMenuAuthority(menu.parentRef);
      });
    }
  }

  /**
   * 현재메뉴를 기준으로 자식 메뉴의 선택 상태를 변경
   *
   * @param menu
   */
  changeChildrenMenuAuthority(menu: any): void {
    setTimeout(() => {
      let hasRoleMenus: boolean = menu.roleMenus;
      let hasSubMenus : boolean = menu.subMenus;
      let childrenMenus = hasRoleMenus ? menu.roleMenus : menu.subMenus;

      if (hasRoleMenus || hasSubMenus) {
        childrenMenus.forEach((childrenMenu) => {
          childrenMenu.usable = menu.usable;

          this.changeChildrenMenuAuthority(childrenMenu);
        });
      } else {
        menu.searchAuthority = menu.usable;
        menu.regAuthority = menu.usable;
        menu.modAuthority = menu.usable;
        menu.delAuthority = menu.usable;
      }
    });
  }

  /**
   * 현재메뉴를 기준으로 자식, 부모 메뉴의 선택 상태를 변경
   *
   * @param menu
   */
  changeMenuAuthority(menu: any): void {
    this.changeChildrenMenuAuthority(menu);
    this.changeParentMenuAuthority(menu);
  }
}
