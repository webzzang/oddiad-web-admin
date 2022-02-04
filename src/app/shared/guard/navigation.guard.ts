import {Injectable} from '@angular/core';
import {CanDeactivate} from '@angular/router';
import {NavigationService} from '../service/navigation.service';
import {PageType} from '../../domain/vo/page-type.enum';

/**
 * 하위 컴포넌트 전환 시 백버튼 제어를 위한 Guard
 */
@Injectable({
  providedIn: 'root'
})
export class NavigationGuard implements CanDeactivate<any> {

  constructor(public navigationService: NavigationService) {}

  canDeactivate(component: any) {
    // 백버튼 클릭 여부를 확인하여 클릭된 경우 뒤로 가지 못하도록 처리
    if (this.navigationService.isBackClicked) {

      this.navigationService.isBackClicked = false;

      // PageType과 ng-template를 활용해 화면을 전환하는 경우, 목록 화면이 아니면 백버튼 클릭을 Block
      // 그 외의 경우에는 통과 처리함
      if (component.hasOwnProperty('pageType') && component.pageType != PageType.LIST) {
        this.navigationService.publishBackButtonEvent();
        // 추가 시도를 방지하기 위해 현재 상태를 저장함
        history.pushState(null, null, location.href);
        return false;
      }
    }

    return true;
  }

}
