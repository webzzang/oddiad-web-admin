import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

/**
 * 페이지 이동 제어를 위한 Service
 */
@Injectable()
export class NavigationService {

  /** 브라우저 백버튼 클릭여부 */
  private _isBackClicked = false;
  /** 백버튼 클릭 이벤트 구독을 위한 Subject */
  private subject = new Subject<any>();
  /** Router History */
  private history = [];

  /** 백버튼 클릭 Observable */
  atBackButtonClicked = this.subject.asObservable();

  constructor(private router: Router) { }

  get isBackClicked(): boolean {
    return this._isBackClicked;
  }

  set isBackClicked(value: boolean) {
    this._isBackClicked = value;
  }

  /**
   * 브라우저 백버튼 클릭 시 이벤트 Broadcast
   */
  publishBackButtonEvent() {
    this.subject.next(null);
  }

  /**
   * router history 취합
   */
  loadRouting(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(({ urlAfterRedirects }: NavigationEnd) => {
        this.history = [...this.history, urlAfterRedirects];
      });
  }

  /**
   * Router History 조회
   */
  getHistory(): string[] {
    return this.history;
  }

  /**
   * 이전 URL 조회
   */
  getPreviousUrl(): string {
    return this.history[this.history.length - 2] || '/dashboard';
  }

}
