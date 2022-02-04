import * as _ from 'lodash';
import * as moment from 'moment';
import {Privilege} from 'src/app/domain/vo/privilege.enum';

export class Utils {

  /**
   * 한글 바이트 수를 감안한 문자열 길이 계산
   * @param s 길이를 계산할 문자열
   * @param b 바이트
   * @param i 문자 인덱스
   * @param c 문자열 내 개별문자
   * @returns {*}
   */
  static getByteLength(s: any, b?: any, i?: any, c?: any): number {
    for (b = i = 0; c = s.charCodeAt(i++); b += c >> 11 ? 3 : c >> 7 ? 2 : 1);
    return b;
  }

  static isEmail(val) {
    var regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    return regExp.test(val); // 형식에 맞는 경우 true 리턴

  }

  static validPassword(val) {
    var i = 0
    if (/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/.test(val)) i++;
    if (/[a-z]/.test(val)) i++;
    if (/[A-Z]/.test(val)) i++;
    if (/[0-9]/.test(val)) i++;

    if (val.length >= 8 && i >= 3 || val.length >= 10 && i == 2) return true;
    else return false;
  }

  /**
   * 메인 탭 기준 검색 조건 저장
   *
   * @param {any[]} searchParams 검색 조건
   * @param {boolean} lockCache 검색 캐시 잠금 여부
   */
  static cacheSearchParams(searchParams: any[], lockCache: boolean, selectedMenuId?: string) {
    // 검색 이벤트가 일어나면 세션스토리지에 해당 메뉴의 검색 조건을 메뉴아이디를 키값으로 하여 저장
    const menuId = (selectedMenuId) ? selectedMenuId : sessionStorage.getItem('selectMenuId');
    let searchCache = sessionStorage.getItem('searchCache');
    if (searchCache) {
      let cache = JSON.parse(searchCache);
      if (cache[menuId]) {
        if (!cache[menuId].lockCache) {
          cache[menuId] = {
            lockCache: lockCache,
            searchParams: searchParams
          };
        }
      } else {
        cache[menuId] = {
          lockCache: lockCache,
          searchParams: searchParams
        };
      }
      sessionStorage.setItem('searchCache', JSON.stringify(cache));
    } else {
      let cache = {};
      cache[menuId] = {
        lockCache: lockCache,
        searchParams: searchParams
      };
      sessionStorage.setItem('searchCache', JSON.stringify(cache));
    }
  }

  /**
   * 서브 탭 기준으로 검색 조건 다시 저장
   *
   * @param {string} tabMenuId 서브탭 메뉴 Id
   */
  static cacheSearchParamForSubTab(tabMenuId: string) {
    const cache = sessionStorage.getItem('searchCache');
    if (cache) {
      const menuId = sessionStorage.getItem('selectMenuId');
      let params = JSON.parse(cache);
      params[tabMenuId] = params[menuId];
      delete params[menuId];
      sessionStorage.setItem('searchCache', JSON.stringify(params));
    }
  }

  /**
   * 저장된 검색 조건을 다시 로드
   *
   * @param {(searchParams: any) => any} callback 각 검색화면에서 저장된 검색조건을 전달받을 콜백함수
   * @param {string} tabMenuId 검색 화면의 탭 메뉴 아이디 (optional)
   */
  static loadSearchCache(callback: (searchParams: any) => any, tabMenuId?: string) {
    const cache = sessionStorage.getItem('searchCache');
    if (cache) {
      const menuId = sessionStorage.getItem('selectMenuId');
      const params = JSON.parse(cache);
      const key = (tabMenuId) ? tabMenuId : menuId;
      if (params[key]) {
        const searchParams = params[key].searchParams;
        callback(searchParams);
      }
    }
  }

  /**
   * 저장된 검색 조건 삭제
   *
   * @param {string} tabMenuId 삭제할 검색조건의 탭 아이디 (optional)
   */
  static clearSearchCache(tabMenuId?: string) {
    if (tabMenuId) {
      const cache = sessionStorage.getItem('searchCache');
      if (cache) {
        let params = JSON.parse(cache);
        Object.keys(params).forEach(key => {
          if (key.startsWith(tabMenuId)) {
            delete params[key];
          }
        });
        sessionStorage.setItem('searchCache', JSON.stringify(params));
      }
    } else {
      sessionStorage.setItem('searchCache', '{}');
    }
  }

  /**
   * 검색 캐시 잠금 해제
   *
   * @param menuId 메뉴 아이디
   */
  static unlockCache(menuId: string) {
    let searchCache = sessionStorage.getItem('searchCache');
    if (searchCache) {
      let cache = JSON.parse(searchCache);
      if (cache[menuId] && cache[menuId].lockCache)
        cache[menuId].lockCache = false;
      sessionStorage.setItem('searchCache', JSON.stringify(cache));
    }
  }

  /**
   * null undefined '' 검사후 해당되는 항목은 모두 '' or default string으로 return
   */
  static nvl(str: string, defaultStr?: string): string {
    if (_.isEmpty(str) == true) {
      return _.isEmpty(defaultStr) == true ? '' : defaultStr;
    } else {
      return str;
    }
  }

  /**
   * browser check [ chrome, ie 구분 ]
   */
  static getBrowserName(): string {
    let result = '';
    const userAgent = window.navigator.userAgent.toLowerCase();
    const chrome = [/webkit/, /chrome/];
    const ie = [/msie/, /trident/, /edge/];
    if (chrome[0].test(userAgent) && chrome[1].test(userAgent) && !ie[2].test(userAgent)) {
      result = 'chrome';
    } else if (ie[0].test(userAgent) || ie[1].test(userAgent) || ie[2].test(userAgent)) {
      result = 'ie';
    }
    return result;
  }

  static numberPad(num: number, size: number): string {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }

  /**
   * session columnDef 를 return
   */
  static getSessionColumnDef(def?: string): any[] {

    let rtnColumnDef: any = [];

    let strColumnDefs = sessionStorage.getItem('strColumnDefs');
    if (strColumnDefs) {
      let arrColumnDef: any = JSON.parse(strColumnDefs);
      let usrId = decodeURIComponent(atob(sessionStorage.getItem('id')));
      let selectMenuId = sessionStorage.getItem('selectMenuId');

      if (Array.isArray(arrColumnDef) && arrColumnDef.length > 0) {
        let usrStrColumnDefs = arrColumnDef.filter(v => v['usrId'] == usrId);
        if (usrStrColumnDefs) {
          let usrStrColumnDef = _.find(usrStrColumnDefs, ["menuId", selectMenuId]);
          if (usrStrColumnDef) {
            if (def) {
              rtnColumnDef = JSON.parse(usrStrColumnDef['strColumnDef'])[def];
            } else {
              rtnColumnDef = JSON.parse(usrStrColumnDef['strColumnDef']);
            }
          }
        }
      }
    }

    return rtnColumnDef;
  }

  /**
   * columnDef 를 session 저장
   */
  static setSessionColumnDef(strColumnDef?: string): void {

    if (strColumnDef) {
      let strColumnDefs = sessionStorage.getItem('strColumnDefs');
      if (!strColumnDefs) {
        strColumnDefs = JSON.stringify([]);
      }

      let arrColumnDef: any = JSON.parse(strColumnDefs);
      let usrId = decodeURIComponent(atob(sessionStorage.getItem('id')));
      let selectMenuId = sessionStorage.getItem('selectMenuId');

      let isNew = true;
      if (Array.isArray(arrColumnDef) && arrColumnDef.length > 0) {
        let usrStrColumnDefs = arrColumnDef.filter(v => v['usrId'] == usrId);
        if (usrStrColumnDefs) {
          let usrStrColumnDef = _.find(usrStrColumnDefs, ["menuId", selectMenuId]);
          if (usrStrColumnDef) {
            usrStrColumnDef['strColumnDef'] = strColumnDef;
            isNew = false;
          }
        }
      }

      if (isNew) {
        arrColumnDef.push({
          "usrId": usrId,
          "menuId": selectMenuId,
          "strColumnDef": strColumnDef
        });
      }
      setTimeout(() => {
        sessionStorage.setItem('strColumnDefs', JSON.stringify(arrColumnDef));
      }, 100);
    }

  }

  /**
   * tableColumnDef 기준으로 saveColList 항목에 columnData가 일치하는 항목을 필터링한다.
   * headDef가 존재하면 headDef의 colspanIds설정이 필수.
   * tableColumnDef와 headDef에는 isCheckBtn 설정은 필수.
   * @param tableColumnDef
   * @param saveColList
   * @param headDef
   * @return data { result: boolean, tableColumnDef: [], headDef: [] }
   */
  static applyColumnSetting(tableColumnDef: any[], saveColList: any[], headDef?: any[]): any {
    const data = { result: true };

    if (saveColList && saveColList.length > 0) {
      const tmpTableColumnDef = _.cloneDeep(tableColumnDef);

      let newTableColumn = _.map(tmpTableColumnDef, item => {
        let itemCopy = _.cloneDeep(item);
        let item2 = _.find(saveColList, ['columnData', itemCopy.columnData]);
        if (_.isEmpty(item2)) {
          itemCopy["use"] = true;
        } else {
          _.assign(itemCopy, item2);
        }
        return itemCopy;
      });
      let newUseTableColumn = _.filter(newTableColumn, item => item.use);
      newUseTableColumn = _.map(newUseTableColumn, item => _.omit(item, ["use"]));// 실제 불필요 컬럼 use 제거

      if (headDef) {
        const tmpHeadDef = _.cloneDeep(headDef);
        const newHead = [];
        _.each(tmpHeadDef, item => {
          let headKeys = _.keys(item);
          _.each(headKeys, headKey => {
            let tmpHead = item[headKey];
            if (tmpHead && tmpHead.length > 0) {
              let headObj = {};
              let headArr = [];
              headObj[headKey] = headArr;
              newHead.push(headObj);
              _.each(tmpHead, tmp => {
                if (tmp.colspanIds) {
                  let cnt = 0;
                  _.each(newUseTableColumn, colItem => {
                    cnt += _.includes(tmp.colspanIds, colItem.columnData) ? 1 : 0;
                  });
                  if (cnt > 0) {
                    tmp.colspan = cnt;
                    headArr.push(tmp);
                  }
                }
              });
            }
          });
        });
        data["headDef"] = newHead;
      }

      data["tableColumnDef"] = newUseTableColumn;

    } else {
      // 설정된게 없으면 기본값으로 처리.
      if (headDef) {
        data["headDef"] = headDef;
      }
      data["tableColumnDef"] = tableColumnDef;
    }

    return data;
  }

  static formatNumber(number?: any): string {
    const rgx = /(\d+)(\d{3})/;
    let rtnStr: string = '';

    try {
      number = number + '';
      let num: any = [];
      num = number.split('.');

      let x1 = num[0];
      let x2 = num.length > 1 ? '.' + num[1] : '';

      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
      }

      rtnStr = x1 + x2;

    } catch (e) {
      return number;
    }

    return rtnStr;

  }

  static formattedDateString(dateString: string, dateSplitter = '-'): string {
    if (dateString) {
      if (dateString.length == 14) {
        return `${dateString.substr(0, 4)}${dateSplitter}${dateString.substr(4, 2)}${dateSplitter}${dateString.substr(6, 2)} ${dateString.substr(8, 2)}:${dateString.substr(10, 2)}:${dateString.substr(12, 2)}`;
      } else if (dateString.length == 12) {
        return `${dateString.substr(0, 4)}${dateSplitter}${dateString.substr(4, 2)}${dateSplitter}${dateString.substr(6, 2)} ${dateString.substr(8, 2)}:${dateString.substr(10, 2)}`;
      } else if (dateString.length == 8) {
        return `${dateString.substr(0, 4)}${dateSplitter}${dateString.substr(4, 2)}${dateSplitter}${dateString.substr(6, 2)}`;
      } else if (dateString.length == 6) {
        return `${dateString.substr(0, 4)}${dateSplitter}${dateString.substr(4, 2)}`;
      } else if (dateString.length == 4) {
        return `${dateString.substr(0, 4)}`;
      } else {
        return dateString;
      }
    } else {
      return dateString;
    }
  }

  /**
   * UUID 생성
   */
  static uuid(): string {
    let uuid = "", i, random;
    for (i = 0; i < 32; i++) {
      random = Math.random() * 16 | 0;

      if (i == 8 || i == 12 || i == 16 || i == 20) {
        uuid += "-"
      }
      uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
    }
    return uuid;
  }

  /**
   * 파일 사이즈 단위 변환
   *
   * @param bytes 바이트 단위 파일 사이즈
   * @param si SI 접두어 (true: 전동적인 접두어, false: 이진 접두어)
   */
  static humanFileSize(bytes, si) {
    let thresh = si ? 1000 : 1024;
    if (Math.abs(bytes) < thresh) {
      return bytes + ' B';
    }
    let units = si
      ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    do {
      bytes /= thresh;
      ++u;
    } while (Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1) + ' ' + units[u];
  }

  static calculateMonthCountBetweenDates(leaseBeginDt: string, leaseEndDt: string): number {
    const beginDt = moment(leaseBeginDt, 'YYYY.MM.DD');
    const endDt = moment(leaseEndDt, 'YYYY.MM.DD');
    return endDt.diff(beginDt, 'months') + 1;
  }

  static masking(value: any,
    maskType: 'socialNumber' | 'driverLicense' | 'passport' | 'bankingAccount'
      | 'cardNumber' | 'mobileNumber' | 'telNumber' | 'email'): string {
    if (value) {
      switch (maskType) {
        case 'socialNumber':
          let sn_regex = /(\d{6})([\s|-]?)(\d{7})/gi;
          return value.replace(sn_regex, '$1$2*******');
        case 'driverLicense':
          let dl_regex = /(\d{2}|\D{2})([\s|-]?)(\d{2})([\s|-]?)(\d{6})([\s|-]?)(\d{2})/gi;
          return value.replace(dl_regex, '$1$2$3$4******$6$7');
        case 'passport':
          let pp_regex = /(\D{1})(\d{8})/gi;
          return value.replace(pp_regex, '$1********');
        case 'bankingAccount':
          let ba_regex = /(\d{3})([\s|-]?)(\d{6})([\s|-]?)(\d{2})([\s|-]?)(\d{3})/gi;
          return value.replace(ba_regex, '$1$2******$4$5$6$7');
        case 'cardNumber':
          let cn_regex = /(\d{4})([\s|-]?)(\d{4})([\s|-]?)(\d{4})([\s|-]?)(\d{4})/gi;
          return value.replace(cn_regex, '$1$2****$4****$6$7');
        case 'mobileNumber':
          let mn_regex = /(\d{3})([\s|-]?)(\d{2})(\d{2})([\s|-]?)(\d{2})(\d{2})/gi;
          return value.replace(mn_regex, '$1$2$3**$5$6**');
        case 'telNumber':
          let result;
          let tn_regex = /(\d{2,4})([\s|-]?)(\d{1,2})(\d{2})([\s|-]?)(\d{2})(\d{2})/gi;
          if (tn_regex.test(value)) {
            result = value.replace(tn_regex, '$1$2$3**$5$6**');
          } else {
            tn_regex = /(\d{1,2})(\d{2})([\s|-]?)(\d{2})(\d{2})/gi; // 2자리 패턴
            if (tn_regex.test(value)) {
              result = value.replace(tn_regex, '$1**$3$4**');
            }
          }
          return result;
        case 'email':
          if (value && value.indexOf('@') > -1) {
            let result = '';
            const len = value.split('@')[0].length - 3;
            result = value.replace(new RegExp('.(?=.{0,' + len + '}@)', 'g'), '*');
            return result;
          }
      }
    }
  }

  /**
   * TextMaskModul로 인해 masking 처리 된 내용을 원래 형태로 변환
   *
   * @param value     마스킹 된 데이터
   * @param maskType  마스킹 타입
   */
  static unmask(value: any, maskType: 'number' | 'telephone' | 'businessNumber' | 'range'): number | string {
    const maskedValue = String(value);
    switch (maskType) {
      case 'number':
      case 'range':
        return Number(maskedValue.replace(/,/gi, ''));
      case 'telephone':
      case 'businessNumber':
        return maskedValue.replace(/[-,_]/gi, '');
    }
  }

  /**
   * TextMaskModul로 인해 masking 처리 된 내용을 원래 형태로 변환
   *
   * @param value     마스킹 된 데이터
   * @param maskType  마스킹 타입
   */
  static maskNumber(value: any): number | string {
    const maskedValue = String(value);
    return maskedValue.toLocaleString();
  }

  static comma(num) {
    const regexp = /\B(?=(\d{3})+(?!\d))/g;
    return num.toString().replace(regexp, ',');
  }

  /**
   * Escape 문자 HTML Entity로 변환
   * @param value
   */
  static htmlEntity(value: string) {
    if (_.isEmpty(value)) {
      return value;
    } else {
      return value.replace(/&amp;/gi, '&').replace(/&#35;/gi, '#')
        .replace(/&lt;/gi, '<').replace(/&gt;/gi, '>')
        .replace(/&quot;/gi, "'").replace(/&#39;/gi, '\\')
        .replace(/&#37;/gi, '%').replace(/&#40;/gi, '(')
        .replace(/&#41;/gi, ')').replace(/&#43;/gi, '+')
        .replace(/&#47;/gi, '/').replace(/&#46;/gi, '.')
        .replace(/&#59;/g, ';');
    }
  }

  /**
   * 원격지 파일 사이즈
   * @param url
   */
  static sizeOfRemoteFile(url: string): Promise<number> {
    return new Promise(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onprogress = (event) => {
          if (event.lengthComputable) {
            resolve(event.total);
          } else {
            reject(new Error('No content-length available'));
          }
          xhr.abort();
        };
        xhr.send();
      }
    );
  }

  static getUri() {
    return window.location.protocol + "//" + window.location.host;
  }

  /**
 * 전력 단위 변경
 * 10,000 kWh = 10 MWH
 * 10,000 MWh = 10 GWH 로 변환하여 출력
 */
  static getElectricUnit(number) {
    let result = {};
    if (number >= 10000000) {
      result['value'] = this.formatNumber(String(number).slice(0, -6));
      result['unit'] = 'GWh';
    } else if (number >= 10000) {
      result['value'] = this.formatNumber(String(number).slice(0, -3));
      result['unit'] = 'MWh';
    } else {
      result['value'] = this.formatNumber(String(number));
      result['unit'] = 'kWh';
    }
    return result;
  }

  /** 쿠키 조회 */
  static getCookie(cookieName) {
    const cookie = document.cookie.split(';').filter(item => item.trim().startsWith(cookieName + '='));
    return (cookie && cookie.length > 0) ? unescape(cookie[0].split('=')[1]) : undefined;
  }

  /** 쿠키 저장 */
  static setCookie(name: string, value: string, exdays: number) {
    const exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    const cookieValue = escape(value) + ((exdays === null) ? '' : '; expires=' + exdate.toUTCString());
    document.cookie = name + '=' + cookieValue;
  }

  /** 쿠키 삭제*/
  static deleteCookie(name: string) {
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() - 1);
    document.cookie = name + '= ' + '; expires=' + expireDate.toUTCString();
  }

  /** Base64 인코딩 */
  static encode(input) {
    let _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    let output = "";
    let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    let i = 0;

    let string = input;
    string = string.replace(/\r\n/g, "\n");
    input = "";
    for (let n = 0; n < string.length; n++) {
      let c = string.charCodeAt(n);
      if (c < 128) {
        input += String.fromCharCode(c);
      } else if ((c > 127) && (c < 2048)) {
        input += String.fromCharCode((c >> 6) | 192);
        input += String.fromCharCode((c & 63) | 128);
      } else {
        input += String.fromCharCode((c >> 12) | 224);
        input += String.fromCharCode(((c >> 6) & 63) | 128);
        input += String.fromCharCode((c & 63) | 128);
      }
    }

    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }

      output = output +
        _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
        _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
    }
    return output;
  }

  /** Base64 디코딩*/
  static decode(input) {
    let _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    let output = "";
    let chr1, chr2, chr3;
    let enc1, enc2, enc3, enc4;
    let i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (i < input.length) {
      enc1 = _keyStr.indexOf(input.charAt(i++));
      enc2 = _keyStr.indexOf(input.charAt(i++));
      enc3 = _keyStr.indexOf(input.charAt(i++));
      enc4 = _keyStr.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      output = output + String.fromCharCode(chr1);

      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }
    }

    let utftext = output;
    output = "";
    let i2 = 0;
    let c = 0, c1 = 0, c2 = 0;
    while (i2 < utftext.length) {
      c = utftext.charCodeAt(i2);
      if (c < 128) {
        output += String.fromCharCode(c);
        i2++;
      } else if ((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i2 + 1);
        output += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i2 += 2;
      } else {
        c2 = utftext.charCodeAt(i2 + 1);
        let c3 = utftext.charCodeAt(i2 + 2);
        output += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i2 += 3;
      }
    }
    return output;
  }

  static inputTelNumberMakeMask(event) {
    if (event.target.value.length > 11) {
      event.target.value =
        event.target.value.replace(/[^0-9]/g, "").substring(0, 11).replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})/, "$1-$2-$3").replace("--", "-");
    } else {
      event.target.value =
        event.target.value.replace(/[^0-9]/g, "").replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})/, "$1-$2-$3").replace("--", "-");
    }
  }

  static inputMobileTelNumber(event) {
    let tel = event.target.value.replace(/[^0-9]/g, "");

    if (tel.length != 11) {
      return false;
    } else {
      return true;
    }
  }

  static autoMobileTelNumber(value) {
    let tel = value.replace(/[^0-9]/g, "");

    if (tel.length != 11) {
      return false;
    } else {
      return true;
    }
  }

  static hasPrivilege(privilege: Privilege): boolean {
    let menuInfo = JSON.parse(sessionStorage.getItem('menus'));
    let menuId = sessionStorage.getItem('selectMenuId');
    if (menuInfo) {
      let isAble = false;
      menuInfo.forEach(item => {
        let menuItem = _.find(item.subMenuList, { menuCode: menuId });
        if (menuItem) {
          isAble = (menuItem[privilege] == true);
          return;
        }
      });
      return isAble;
    } else {
      return false;
    }
  }

  static hasAuthMenuLink(groupId, menuId) {
    let isAuth = false;
    let availableMenus = JSON.parse(sessionStorage.getItem("menus"));
    if (availableMenus) {
      _.each(availableMenus, menuGroup => {
        let tempSubMenus = JSON.parse(JSON.stringify(menuGroup.subMenus));
        let subMenuLink;

        _.each(tempSubMenus, subMenu => {
          subMenuLink = JSON.parse(JSON.stringify(subMenu));
          if (subMenuLink.groupId == groupId) {
            let menuLink = JSON.parse(JSON.stringify(subMenuLink.subMenus));
            _.each(menuLink, menu => {
              if (menu.menuId == menuId) isAuth = true;
            });
          }
        });
      });
    }
    return isAuth;
  }

  static isOwnerOfInfo(id): boolean {
    let sessionId = sessionStorage.getItem('id');
    let roleName = sessionStorage.getItem('roleName');
    if (roleName == '최고관리자') {
      return true;
    }
    if (sessionId == id) {
      return true;
    }
    return false;
  }

  /** 전화번호 dash 처리. 참조: https://cublip.tistory.com/326 [HeBhy, since 1983.] */
  static telnoWithDash(telNo): string {
    let result = '';
    if (telNo.length > 11) {
      result = telNo.replace(/[^0-9]/g, "").substring(0, 11).replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})/, "$1-$2-$3").replace("--", "-");
    } else {
      result = telNo.replace(/[^0-9]/g, "").replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})/, "$1-$2-$3").replace("--", "-");
    }
    return result;
  }

  static downloadExcelFile(data: any, fileName: string) {
    const blob = new Blob([data], { type: 'application/vnd.ms-excel' });
    const url = window.URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    anchor.download = fileName;
    anchor.href = url;
    anchor.click();
  }

  static downloadPdfFile(data: any) {

    let fileName;
    if (sessionStorage.getItem("userDefinedFileName")) {
      fileName = sessionStorage.getItem("userDefinedFileName");
    } else {
      fileName = '계약서.pdf';
    }

    const blob = new Blob([data], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    anchor.download = fileName;
    anchor.href = url;
    anchor.click();

    sessionStorage.setItem("userDefinedFileName", "");
  }

  static downloadFile(data: any, fileName: string) {
    const blob = new Blob([data], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    anchor.download = fileName;
    anchor.href = url;
    anchor.click();
  }

  static getUrlFile(data: any, fileName: string) {
    const blob = new Blob([data], { type: 'application/octet-stream' });
    return window.URL.createObjectURL(blob);
  }

  static getCurrentDate() {
    const currentDate: Date = new Date();
    return '' + currentDate.getFullYear()
      + zero((currentDate.getMonth() + 1))
      + zero(currentDate.getDate());
  }

  static mobilePhoneFormatter(phone: string): string {
    phone = phone.replace(/[^\d]/g, "");
    if (phone.length == 11) {
      //reformat and return phone number
      return phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    }
  }

  static mobilePhoneWithStarFormatter(phone: string): string {
    if (phone.length == 11) {
      return phone.replace(/(.{3})(.{4})(.{4})/g, "$1-$2-$3");
    }
  }

  static convertSecondsString(timeStr: string, convert: 'M' | 'H'): string {
    let result, remine, remineS = 0;
    if (timeStr) {
      switch (convert) {
        case 'M':
          result = parseInt((_.toNumber(timeStr) / 60) + '');
          remine = _.toNumber(timeStr) % 60;

          return result + ':' + remine + ' (' + timeStr + 's)';
        case 'H':
          result = parseInt((_.toNumber(timeStr) / 60 * 60) + '');
          remine = _.toNumber(timeStr) % (60 * 60);
          remineS = remine % (60);
          return result + ':' + remine + ':' + remineS + ' (' + timeStr + 's)';
      }
    }
    return '-';
  }

  //특수문자제거
  static omitSpecialChar(event) {
    let pattern = /[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9]/gi;
    (event.target as HTMLInputElement).value = event.target.value.replace(pattern, "");
  }

  static setExcelSearch(search, orderBy) {
    let searchParam = {};
    if (search) {
      searchParam = search
    }
    if (orderBy) {
      searchParam['orderBy'] = orderBy;
    }
    return searchParam;
  }

  /**
   * cellRenderer 등에서 사용하기 위한 것으로 
   * 배열로 코드를 받아서 node의 값과 일치하는 value를 반환한다. 
   */
  static getCodeValue(codes, nodeData) {
    if (!codes) return " - ";
    for (var i = 0; i < codes.length; i++) {
      if (nodeData.value == codes[i].code) {
        return codes[i].name;
      }
    }
    return " - ";
  }

  static isKorJumin(ssn1, ssn2) {
    var ssn2f = ssn2.substr(0, 1);
    var rn = ssn1 + ssn2;
    if (ssn2f == '5' || ssn2f == '6' || ssn2f == '7' || ssn2f == '8') {
      return this.isRegNoFgnno(rn);
    } else {
      return this.isJumin(rn);
    }
  }

  static isJumin(rn) {
    rn = rn.split("-").join('');
    if (rn.length !== 13) return false;
    var checkSum = 0;
    for (var i = 0; i < 12; i++)
      checkSum += ((rn.substr(i, 1) >> 0) * ((i % 8) + 2));
    var korMatch = (11 - (checkSum % 11)) % 10 == rn.substr(12, 1);
    return korMatch
  }

  static isRegNoFgnno(fgnno) {
    fgnno = fgnno.split("-").join('');
    var sum = 0;
    var odd = 0;
    let buf = new Array(13);
    for (let i = 0; i < 13; i++) {
      buf[i] = parseInt(fgnno.charAt(i));
    }
    odd = buf[7] * 10 + buf[8];
    if (odd % 2 != 0) {
      return false;
    }
    if ((buf[11] != 6) && (buf[11] != 7) && (buf[11] != 8) && (buf[11] != 9)) {
      return false;
    }
    let multipliers = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5];
    for (let i = 0, sum = 0; i < 12; i++) {
      sum += (buf[i] *= multipliers[i]);
    }
    sum = 11 - (sum % 11);
    if (sum >= 10) { sum -= 10; }
    sum += 2;
    if (sum >= 10) { sum -= 10; }
    if (sum != buf[12]) {
      return false
    }

    return true;
  }

  static checkCorporateRegistrationNumber(value) {
    var valueMap = value.replace(/-/gi, '').split('').map(function (item) {
      return parseInt(item, 10);
    });

    if (valueMap.length === 10) {
      var multiply = new Array(1, 3, 7, 1, 3, 7, 1, 3, 5);
      var checkSum = 0;

      for (var i = 0; i < multiply.length; ++i) {
        checkSum += multiply[i] * valueMap[i];
      }

      checkSum += parseInt(((multiply[8] * valueMap[8]) / 10) + "", 10);
      console.log(checkSum);
      console.log(((10 - (checkSum % 10)) % 10));
      return Math.floor(valueMap[9]) === ((10 - (checkSum % 10)) % 10);
    }
    return false;
  }

  //요일 가져오기
  static getDay(setDate) {
    let week = new Array('일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일');
    let theDay = moment(setDate).day();
    let theDayLabel = week[theDay];

    let tourWeekLabel = "(" + theDayLabel + ")";
    return tourWeekLabel;
  }

  static thisWeekStartDate(baseDate) {
    var dayOfWeek = baseDate.getDay();
    var theDate = baseDate.getDate();
    var theMonth = baseDate.getMonth();
    var theYear = baseDate.getYear();
    theYear += (theYear < 2000) ? 1900 : 0;
    return new Date(theYear, theMonth, theDate - dayOfWeek);
  }

  static thisWeekEndDate(baseDate) {
    var dayOfWeek = baseDate.getDay();
    var theDate = baseDate.getDate();
    var theMonth = baseDate.getMonth();
    var theYear = baseDate.getYear();
    theYear += (theYear < 2000) ? 1900 : 0;
    return new Date(theYear, theMonth, theDate + (6 - dayOfWeek));
  }

  static timeFormatter(time: string): string {
    return time.replace(/(..?)/g, '$1:').slice(0, -1)
  }
  static checkUrlForm(strUrl) {
    var expUrl = /^http[s]?\:\/\//i;
    return expUrl.test(strUrl);
  }

  static convertRouteLink(path: string, data: any) : string {
    _.forEach(data, (value, name) => {
      path = path.replace(':' + name, value);
    });

    return path
  }


}
export const zero = (value: number | string) => value.toString().length === 1 ? `0${value}` : value;
