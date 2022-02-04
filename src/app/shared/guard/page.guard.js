"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageGuard = void 0;
var core_1 = require("@angular/core");
var PageGuard = /** @class */ (function () {
    function PageGuard(router, route, spinner) {
        this.router = router;
        this.route = route;
        this.spinner = spinner;
    }
    PageGuard.prototype.canActivate = function (route, state) {
        // 페이지 이동하면 spinner 모두 hide
        // this.spinner.hide('full');
        this.spinner.hide('main');
        return true;
    };
    PageGuard = __decorate([
        (0, core_1.Injectable)({
            providedIn: 'root'
        })
    ], PageGuard);
    return PageGuard;
}());
exports.PageGuard = PageGuard;
