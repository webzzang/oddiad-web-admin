"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavigationService = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var router_1 = require("@angular/router");
var operators_1 = require("rxjs/operators");
/**
 * 페이지 이동 제어를 위한 Service
 */
var NavigationService = /** @class */ (function () {
    function NavigationService(router) {
        this.router = router;
        /** 브라우저 백버튼 클릭여부 */
        this._isBackClicked = false;
        /** 백버튼 클릭 이벤트 구독을 위한 Subject */
        this.subject = new rxjs_1.Subject();
        /** Router History */
        this.history = [];
        /** 백버튼 클릭 Observable */
        this.atBackButtonClicked = this.subject.asObservable();
    }
    Object.defineProperty(NavigationService.prototype, "isBackClicked", {
        get: function () {
            return this._isBackClicked;
        },
        set: function (value) {
            this._isBackClicked = value;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * 브라우저 백버튼 클릭 시 이벤트 Broadcast
     */
    NavigationService.prototype.publishBackButtonEvent = function () {
        this.subject.next(null);
    };
    /**
     * router history 취합
     */
    NavigationService.prototype.loadRouting = function () {
        var _this = this;
        this.router.events
            .pipe((0, operators_1.filter)(function (event) { return event instanceof router_1.NavigationEnd; }))
            .subscribe(function (_a) {
            var urlAfterRedirects = _a.urlAfterRedirects;
            _this.history = __spreadArray(__spreadArray([], _this.history, true), [urlAfterRedirects], false);
        });
    };
    /**
     * Router History 조회
     */
    NavigationService.prototype.getHistory = function () {
        return this.history;
    };
    /**
     * 이전 URL 조회
     */
    NavigationService.prototype.getPreviousUrl = function () {
        return this.history[this.history.length - 2] || '/dashboard';
    };
    NavigationService = __decorate([
        (0, core_1.Injectable)()
    ], NavigationService);
    return NavigationService;
}());
exports.NavigationService = NavigationService;
