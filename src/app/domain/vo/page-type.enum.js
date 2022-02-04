"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageType = void 0;
/**
 * 화면 유형 열거형 상수
 * - 목록, 신규, 수정, 상세, 신규/수정
 */
var PageType;
(function (PageType) {
    PageType[PageType["LIST"] = 0] = "LIST";
    PageType[PageType["ADD"] = 1] = "ADD";
    PageType[PageType["MODIFY"] = 2] = "MODIFY";
    PageType[PageType["DETAIL"] = 3] = "DETAIL";
    PageType[PageType["FORM"] = 4] = "FORM";
    PageType[PageType["FORM2"] = 5] = "FORM2";
})(PageType = exports.PageType || (exports.PageType = {}));
