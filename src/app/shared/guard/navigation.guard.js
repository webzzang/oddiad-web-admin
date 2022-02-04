"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavigationGuard = void 0;
var core_1 = require("@angular/core");
var page_type_enum_1 = require("../../domain/vo/page-type.enum");
/**
 * 하위 컴포넌트 전환 시 백버튼 제어를 위한 Guard
 */
var NavigationGuard = /** @class */ (function () {
    function NavigationGuard(navigationService) {
        this.navigationService = navigationService;
    }
    NavigationGuard.prototype.canDeactivate = function (component) {
        // 백버튼 클릭 여부를 확인하여 클릭된 경우 뒤로 가지 못하도록 처리
        if (this.navigationService.isBackClicked) {
            this.navigationService.isBackClicked = false;
            // PageType과 ng-template를 활용해 화면을 전환하는 경우, 목록 화면이 아니면 백버튼 클릭을 Block
            // 그 외의 경우에는 통과 처리함
            if (component.hasOwnProperty('pageType') && component.pageType != page_type_enum_1.PageType.LIST) {
                this.navigationService.publishBackButtonEvent();
                // 추가 시도를 방지하기 위해 현재 상태를 저장함
                history.pushState(null, null, location.href);
                return false;
            }
        }
        return true;
    };
    NavigationGuard = __decorate([
        (0, core_1.Injectable)({
            providedIn: 'root'
        })
    ], NavigationGuard);
    return NavigationGuard;
}());
exports.NavigationGuard = NavigationGuard;
