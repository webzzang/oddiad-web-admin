export class CommonComponent {
  private authority: any = {};

  constructor() {
    this.setAuthority();
  }

  /**
   * 기능 사용권한 셋팅
   * 
   * @private
   */
  private setAuthority(): void {
    let menu: any = JSON.parse(sessionStorage.getItem('selectMenu') || '{}');
    this.authority.menuId = menu.menuId;
    this.authority.search = menu.searchAuthority;
    this.authority.register = menu.regAuthority;
    this.authority.modify   = menu.modAuthority;
    this.authority.remove   = menu.delAuthority;
  }

  /**
   * 조회권한 소유여부
   * 
   * @param condition
   */
  public possibleSearch(condition: any = true): boolean {
    return this.parseBoolean(condition) && this.authority.search;
  }

  /**
   * 등록권한 소유여부
   * 
   * @param condition
   */
  public possibleRegister(condition: any = true): boolean {
    return this.parseBoolean(condition) && this.authority.register;
  }

  /**
   * 수정권한 소유여부
   * 
   * @param condition
   */
  public possibleModify(condition: any = true): boolean {
    return this.parseBoolean(condition) && this.authority.modify;
  }

  /**
   * 삭제권한 소유여부
   * 
   * @param condition
   */
  public possibleRemove(condition: any = true): boolean {
    return this.parseBoolean(condition) && this.authority.remove;
  }

  /**
   * 모든값을 boolean 으로 치환
   *  - undefined, null, '', 0, false 를 제외한 모든값은 true
   *
   * @param target
   */
  public parseBoolean(target: any): boolean {
    return !(undefined == target || null == target || '' == target || false == target);
  }
}
