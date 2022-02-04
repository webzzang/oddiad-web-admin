import {Router} from '@angular/router';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {MyInfoService} from "../../../service/my-info/my-info.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-left',
  templateUrl: './left.component.html',
  styleUrls: ['./left.component.scss']
})
export class LeftComponent implements OnInit, OnDestroy {

  menuList = [];
  selectMenuId : string;
  selectGroupId: string;

  moveRequestMenuIntervalId: any;

  constructor(private router: Router,
              private myInfoService: MyInfoService) {

    let sessMenuListStr: string = sessionStorage.getItem('menuList');

    let ob : Observable<any>;

    if (sessMenuListStr) {
      ob = new Observable<any>((observer) => {
        observer.next(JSON.parse(sessMenuListStr));
        observer.complete();
      });
    } else {
      ob = myInfoService.searchMenuList();
    }

    ob.subscribe((menuList) => {
      sessionStorage.setItem('menuList', JSON.stringify(menuList));

      this.menuList = menuList;
      this.menuList.some(group => {
        if (-1 < router.url.indexOf(group.routerLink)) {
          this.activateMenu(group);
          return true;
        } else if (group.managerSubMenus) {
          group.managerSubMenus.some(menu => {
            if (-1 < menu.routerLink.indexOf(router.url)) {
              this.activateSubMenu(group, menu);
              return true;
            }
          });
        }
      });
    });
  }

  ngOnInit() {
    this.initObserveMenuMoveRequest();
  }

  ngOnDestroy() {
    this.destroyObserveMenuMoveRequest();
  }

  /**
   * 메뉴이동요청 감시 시작 (sessionStorage.moveRequestMenuInfo)
   */
  initObserveMenuMoveRequest(): void {
    this.moveRequestMenuIntervalId = setInterval(() => {
      let moveRequestMenuInfo: any = JSON.parse(sessionStorage.getItem('moveRequestMenuInfo') || '{}');

      if (moveRequestMenuInfo.id) {
        let sessMenuListStr: string = sessionStorage.getItem('menuList');
        let menuList       : Array<any> = JSON.parse(sessMenuListStr);

        menuList.some((group) => {
          group.managerSubMenus.some((subMenu) => {
            if (moveRequestMenuInfo.id == subMenu.menuId) {
              this.selectGroupMenu(group, subMenu, moveRequestMenuInfo.queryParams);

              return true;
            }
          });
        });

        sessionStorage.removeItem('moveRequestMenuInfo');
      }
    }, 400);
  }

  /**
   * 메뉴이동요청 감시 종료
   */
  destroyObserveMenuMoveRequest(): void {
    if (this.moveRequestMenuIntervalId) {
      clearInterval(this.moveRequestMenuIntervalId);
    }
  }

  /**
   * 현재와 다른 그룹메뉴 선택시 그룹메뉴와 그 하위 첫번째 메뉴 활성화
   *
   * @param groupMenu
   * @param subMenu
   * @param queryParams
   */
  selectGroupMenu(groupMenu: any, subMenu?: any, queryParams?: any) {
    // 대메뉴 선택시 첫번째 서브메뉴로
    if (groupMenu.managerSubMenus) {
      let selectGroupId = sessionStorage.getItem("selectGroup");
      if (groupMenu.groupId != selectGroupId) {
        // 현재 선택된 대메뉴와 다를때만 실행
        setTimeout(() => {
          this.activateSubMenu(groupMenu, subMenu || groupMenu.managerSubMenus[0], queryParams);
        }, 100);
      }
    }
  }

  /**
   * 하위메뉴가 존재하지 않는 그룹메뉴 활성화
   *
   * @param menu
   */
  activateMenu(menu: any) {
    this.selectGroupId = menu.groupId;
    this.selectMenuId  = menu.menuId;

    // 클릭한 메뉴를 세션에 저장
    sessionStorage.setItem('selectMenu', JSON.stringify(menu));
    sessionStorage.removeItem("selectMenuGroup");

    this.router.navigate([menu.routerLink], { replaceUrl: true });
  }

  /**
   * 하위메뉴 활성화
   *
   * @param menuGroup
   * @param menu
   * @param queryParams
   */
  activateSubMenu(menuGroup: any, menu: any, queryParams?: any) {
    this.selectGroupId = menuGroup.groupId;
    this.selectMenuId  = menu.menuId;

    // 클릭한 메뉴를 세션에 저장
    sessionStorage.setItem('selectMenuGroup', JSON.stringify(menuGroup));
    sessionStorage.setItem('selectMenu', JSON.stringify(menu));

    this.router.navigate([menu.routerLink], { queryParams: queryParams, replaceUrl: true });
  }
}


