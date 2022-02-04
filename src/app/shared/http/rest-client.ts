import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHeaders,
  HttpParams,
  HttpResponse
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import * as _ from 'lodash';
import {Utils} from '../utils/utils';


/**
 * RESTful API 요청/응답 처리를 위한 HttpClient Wrapper 서비스
 */
// RestClient를 직접적으로 사용하지 않고 모두 상속받아 사용하고 있기 때문에 빌드시 Warning이 발생하여 주석처리함
// 만약 직접 사용할 경우 아래 Injectable 주석을 제거후 사용
// @Injectable()
export class RestClient {

  /** 기본 요청 URL */
  protected url: string;
  /** HTTP 요청 시 사용할 HttpClient 인스턴스 */
  protected http: HttpClient;
  /** HTTP 옵션 */
  protected httpOptions: any;
  /** HTTP 헤더 */
  protected httpHeaders: HttpHeaders;
  /** 기본 HTTP 헤더 */
  protected defaultHeaders: any;
  /** 일회성 HTTP 헤더 */
  private disposableHeaders: any = {};

  /** BioStar 에러를 서비스를 호출한 곳에서 처리 여부 */
  protected passBSErrorToCaller = false;

  protected alt = true;
  /**
   * RestClient 인스턴스 생성
   *
   * @param url   기본 요청 URL
   * @param http  HttpClient 인스턴스
   */
  constructor(url: string, http: HttpClient) {
    this.http = http;
    this.url = environment.apiUrl + url;
    this.setDefaultHttpOptions();
  }

  /**
   * 기본 HTTP 옵션 설정
   */
  protected setDefaultHttpOptions() {
    this.defaultHeaders = {
      'Content-Type': 'application/json;charset=utf-8',
      'Accept': 'application/json;charset=utf-8'
    };
    this.httpHeaders = new HttpHeaders(this.defaultHeaders);
    this.httpOptions = {
      headers: this.httpHeaders,
      params: null,
      observe: 'response', // 'response' 필수 항목
      responseType: 'json'
    };
  }
  /**
   * HTTP 옵션 설정
   *
   * - 상속받은 service 인스턴스 내에서 한번 변경하면 영구적으로 변경됨
   * @param httpOptions HTTP 옵션
   */
  protected setHttpOptions(httpOptions: any) {
    this.httpOptions = httpOptions;
  }

  /**
   * HTTP 헤더 설정
   *
   * - 상속받은 service 인스턴스 내에서 한번 변경하면 영구적으로 변경됨
   * @param headers
   */
  protected setHeader(headers: any) {
    this.httpHeaders = new HttpHeaders(headers);
    this.httpOptions.headers = this.httpHeaders;
  }

  /**
   * HTTP 헤더 항목 설정
   *
   * - 상속받은 service 인스턴스 내에서 한번 변경하면 영구변경됨. setDefaultHttpOptions 로 초기화 가능.
   * @param key 헤더 키
   * @param val 헤더 값
   */
  protected setHeaderItem(key: string, val: string) {
    let headers = _.omit(this.defaultHeaders, key);
    headers[key] = val;
    this.setHeader(headers);
  }

  /**
   * 일회성 Header Item 변경
   *
   * @param key 헤더 키
   * @param val 헤더 값
   */
  protected setDisposableHeaderItem(key: string, val: string) {
    this.disposableHeaders[key] = val;
  }

  /**
   * 일회성 Header Item 초기화
   */
  protected clearDisposableHeaders() {
    this.disposableHeaders = {};
  }

  /**
   * GET 방식 HTTP 요청
   *
   * @param path    요청 경로
   * @param params  요청 파라미터
   * @return        요청에 대한 응답 데이터를 전달할 Observable 객체
   */
  public get(path?: string, params?: any): Observable<any> {
    return this.http.get<HttpResponse<any>>(this.makePath(path), this.getActiveHttpOptions(params)).pipe(map(this.extractData)).pipe(catchError(error => this.handleError(this, error)));
  }

  /**
   * POST 방식 HTTP 요청
   *
   * @param body  요청 Body
   * @param path  요청 경로
   * @return      요청에 대한 응답 데이터를 전달할 Observable 객체
   */
  public post(body: any, path?: string): Observable<any> {
    return this.http.post<HttpResponse<any>>(this.makePath(path), body, this.getActiveHttpOptions()).pipe(map(this.extractData)).pipe(catchError(error => this.handleError(this, error)));
  }

  /**
   * PUT 방식 HTTP 요청
   *
   * @param body  요청 Body
   * @param path  요청 경로
   * @return      요청에 대한 응답 데이터를 전달할 Observable 객체
   */
  public put(body: any, path?: string): Observable<any> {
    return this.http.put<HttpResponse<any>>(this.makePath(path), body, this.getActiveHttpOptions()).pipe(map(this.extractDataHttpStatus)).pipe(catchError(error => this.handleError(this, error)));
  }

  /** POST 방식 HTTP 요청. return http body data with status code */
  public postWithStatus(body: any, path?: string): Observable<any> {
    return this.http.post<HttpResponse<any>>(this.makePath(path), body, this.getActiveHttpOptions()).pipe(map(this.extractDataHttpStatus)).pipe(catchError(error => this.handleError(this, error)));
  }

  /** PUT 방식 HTTP 요청. return http body data with status code */
  public putWithStatus(body: any, path?: string): Observable<any> {
    return this.http.put<HttpResponse<any>>(this.makePath(path), body, this.getActiveHttpOptions()).pipe(map(this.extractDataHttpStatus)).pipe(catchError(error => this.handleError(this, error)));
  }

  /**
   * DELETE 방식 HTTP 요청
   *
   * @param path    요청 경로
   * @param params  요청 파라미터
   * @return        요청에 대한 응답 데이터를 전달할 Observable 객체
   */
  public delete(path?: string, params?: any): Observable<any> {
    return this.http.delete<HttpResponse<any>>(this.makePath(path), this.getActiveHttpOptions(params)).pipe(map(this.extractData)).pipe(catchError(error => this.handleError(this, error)));
  }

  /**
   * 파일 업로드 요청
   *
   * @param path      요청 경로
   * @param formData  폼 데이터
   * @return          요청에 대한 응답 데이터를 전달할 Observable 객체
   */
  public upload(path: string, formData: FormData): Observable<any> {
    let options = this.getActiveHttpOptions();
    options.headers = new HttpHeaders({
      'enctype': 'multipart/form-data',
      'x-access-token': sessionStorage.getItem('accesstoken')
      /*,'menu-id': sessionStorage.getItem('selectMenuId')*/
    });

    return this.http.post<HttpResponse<any>>(this.makePath(path), formData, options).pipe(map(this.extractData)).pipe(catchError(error => this.handleError(this, error)));
  }

  /**
   * 파일 다운로드 요청
   *
   * @param path    요청 경로
   * @param params  요청 파라미터
   * @return        요청에 대한 응답 데이터를 전달할 Observable 객체
   */
  public download(path: string, params?: any): Observable<any> {
    let opt = this.getActiveHttpOptions(params);
    opt.responseType = 'blob';
    return this.http.get<HttpResponse<any>>(this.makePath(path), opt).pipe(map(this.extractFileData)).pipe(catchError(error => this.handleError(this, error)));
  }

  /**
   * 파일 다운로드 요청
   *
   * @param path    요청 경로
   * @param params  요청 파라미터
   * @return        요청에 대한 응답 데이터를 전달할 Observable 객체
   */
  public fileUrlData(path: string, params?: any): Observable<any> {
    let opt = this.getActiveHttpOptions(params);
    opt.responseType = 'blob';
    return this.http.get<HttpResponse<any>>(this.makePath(path), opt).pipe(map(this.extractFileUrl)).pipe(catchError(error => this.handleError(this, error)));
  }

  /**
   * 엑셀 파일 다운로드 요청
   *
   * @param path    요청 경로
   * @param params  요청 파라미터
   * @return        요청에 대한 응답 데이터를 전달할 Observable 객체
   */
  public downloadExcel(path: string, params?: any): Observable<any> {
    let opt = this.getActiveHttpOptions(params);
    opt.responseType = 'blob';
    opt.observe = 'response';
    return this.http.get<HttpResponse<any>>(this.makePath(path), opt).pipe(map(this.extractExcelFileData)).pipe(catchError(error => this.handleError(this, error)));
  }

  /**
   * pdf 파일 다운로드 요청
   *
   * @param path    요청 경로
   * @param params  요청 파라미터
   * @return        요청에 대한 응답 데이터를 전달할 Observable 객체
   */
  public downloadPdfFile(path: string, params?: any): Observable<any> {
    let opt = this.getActiveHttpOptions(params);
    opt.responseType = 'blob';

    if (params.fileName) {
      sessionStorage.setItem("userDefinedFileName", params.fileName);
    }

    return this.http.get<HttpResponse<any>>(this.makePath(path), opt).pipe(map(this.extractPdfFileData)).pipe(catchError(error => this.handleError(this, error)));
  }

  /**
   * Response 데이터 추출
   *
   * @param value HTTP 응답 객체
   * @return HTTPResponse 에서 추출한 body 데이터 또는 빈 object
   */
  private extractData(value: HttpEvent<HttpResponse<any>>): any {
    const res = value as HttpResponse<any>;
    const decode = (body: any) => {
      if (_.isEmpty(body)) {
        return body;
      } else {
        const strBody = JSON.stringify(body);
        return JSON.parse(Utils.htmlEntity(strBody));
      }
    };
    const body = decode(res.body.data) || {};
    const code = decode(res.body.code);
    let message = decode(res.body.message);
    const header = res.headers;

    if('000' != code){
      switch (code) {
        case '009':
        case '011':
        case '012':
          body.status = code;
          sessionStorage.setItem("accesstoken", body.accessToken);
          break;
        case '014':
        case '015':
          body.status = code;
          break;
        default:
          if(!message){
            message = '관리자에게 문의 하세요.';
          }

          throw new Error(JSON.stringify({message: message, status: code, body: body}));
      }

      return body || {};
    }else{
      if (header.get('x-access-token')) {
        // 최초로그인 후 access token을 설정했고. 그후 통신이 성공할때마다 access token을 설정
        // 여러개의 http call 중에서 401, 405 에러가 나서 sessionStorage가 clear 되고
        // 그후에 늦게 응답온 http call에서 다시 access token 을 설정하지 않도록 accesstoken 이 있을때만 설정함.

        if (sessionStorage.getItem('accesstoken')) {
          sessionStorage.setItem("accesstoken", header.get('x-access-token'));
        }
      }

      return body || {};
    }
  }

  private extractFileData(value: HttpEvent<HttpResponse<any>>): any {
    const res    = value as HttpResponse<any>;
    const header = res.headers;
    const body   = res.body;
    const contentDisposition = header.get('Content-Disposition') || '';

    if (header.get('x-access-token')) {
      // 최초로그인 후 access token을 설정했고. 그후 통신이 성공할때마다 access token을 설정
      // 여러개의 http call 중에서 401, 405 에러가 나서 sessionStorage가 clear 되고
      // 그후에 늦게 응답온 http call에서 다시 access token 을 설정하지 않도록 accesstoken 이 있을때만 설정함.
      if (sessionStorage.getItem('accesstoken')) {
        sessionStorage.setItem("accesstoken", header.get('x-access-token'));
      }
    }

    if (contentDisposition) {
      const matches = /filename=([^;]+)/ig.exec(contentDisposition);

      const fileName = (matches[1] || 'untitled').trim();

      Utils.downloadFile(body, fileName);

      return null;
    } else {
      return body;
    }
  }

  private extractFileUrl(value: HttpEvent<HttpResponse<any>>): any {
    const res = value as HttpResponse<any>;
    const body = res.body;
    const header = res.headers;

    const contentDisposition = header.get('Content-Disposition') || '';
    const matches = /filename=([^;]+)/ig.exec(contentDisposition);
    const fileName = (matches[1] || 'untitled').trim();

    if (header.get('x-access-token')) {
      // 최초로그인 후 access token을 설정했고. 그후 통신이 성공할때마다 access token을 설정
      // 여러개의 http call 중에서 401, 405 에러가 나서 sessionStorage가 clear 되고
      // 그후에 늦게 응답온 http call에서 다시 access token 을 설정하지 않도록 accesstoken 이 있을때만 설정함.
      if (sessionStorage.getItem('accesstoken')) {
        sessionStorage.setItem("accesstoken", header.get('x-access-token'));
      }
    }

    return Utils.getUrlFile(body, fileName);
  }

  private extractExcelFileData(value: HttpEvent<HttpResponse<any>>): any {
    const res = value as HttpResponse<any>;
    const body = res.body;
    const header = res.headers;

    const contentDisposition = res.headers.get('Content-Disposition') || '';
    const matches = /filename=([^;]+)/ig.exec(contentDisposition);
    const fileName = (matches[1] || 'untitled').trim();

    Utils.downloadExcelFile(body, fileName);

    if (header.get('x-access-token')) {
      // 최초로그인 후 access token을 설정했고. 그후 통신이 성공할때마다 access token을 설정
      // 여러개의 http call 중에서 401, 405 에러가 나서 sessionStorage가 clear 되고
      // 그후에 늦게 응답온 http call에서 다시 access token 을 설정하지 않도록 accesstoken 이 있을때만 설정함.
      if (sessionStorage.getItem('accesstoken')) {
        sessionStorage.setItem("accesstoken", header.get('x-access-token'));
      }
    }
    return 200;
  }

  public extractPdfFileData(value: HttpEvent<HttpResponse<any>>): any {
    const res = value as HttpResponse<any>;
    const body = res.body;
    const header = res.headers;

    Utils.downloadPdfFile(body);

    if (header.get('x-access-token')) {
      // 최초로그인 후 access token을 설정했고. 그후 통신이 성공할때마다 access token을 설정
      // 여러개의 http call 중에서 401, 405 에러가 나서 sessionStorage가 clear 되고
      // 그후에 늦게 응답온 http call에서 다시 access token 을 설정하지 않도록 accesstoken 이 있을때만 설정함.
      if (sessionStorage.getItem('accesstoken')) {
        sessionStorage.setItem("accesstoken", header.get('x-access-token'));
      }
    }
    return 200;
  }

  /**
   * Response 데이터 추출
   *
   * @param value HTTP 응답 객체
   * @return HTTPResponse 에서 추출한 body 데이터 또는 빈 object
   */
  private extractDataHttpStatus(value: HttpEvent<HttpResponse<any>>): any {
    const res = value as HttpResponse<any>;

    const body = res.body;
    const header = res.headers;
    const status = res.status;
    const code = res.body.code;

    if (header.get('x-access-token')) {
      // 최초로그인 후 access token을 설정했고. 그후 통신이 성공할때마다 access token을 설정
      // 여러개의 http call 중에서 401, 405 에러가 나서 sessionStorage가 clear 되고
      // 그후에 늦게 응답온 http call에서 다시 access token 을 설정하지 않도록 accesstoken 이 있을때만 설정함.

      if (sessionStorage.getItem('accesstoken')) {
        sessionStorage.setItem("accesstoken", header.get('x-access-token'));
      }
    }

    if ('001' == code) {
      body.status = code;

      return body || {};
    } else {
      return { body: body || {}, status: status || {} };
    }
  }

  /**
   * HTTP 에러 핸들러
   *
   * @param error 에러 응답 객체
   * @return      에러 메시지를 포함한 Observable 객체
   */
  private handleError(owner: RestClient, error: HttpErrorResponse): Observable<never> {
    console.error("error1 -> ", error);
    if (error.error) {
      let errorCode = error.error.code;

      if (errorCode == "101") {
        // 토큰 만료
        if (sessionStorage.getItem('accesstoken')) {
          sessionStorage.clear();
          alert("세션이 만료되어 로그인 화면으로 이동합니다.");
          location.href = '/';
        }
      }
    }

    if (error.error instanceof ErrorEvent) {
      // 클라이언트 사이드 또는 네트워크 에러 발생 시
      console.error("error ErrorEvent -> ", error.error.message);
    } else {
      // 서버 에러 발생 시
      console.error(
        `Http Status : ${error.status}, ` +
        `Http Body: ${error.error}`);
      if (error.status == 401) {
        // 세션 만료인 경우 로그인 페이지로 이동
        if (sessionStorage.getItem('accesstoken')) {
          sessionStorage.clear();
          alert("세션이 만료되어 로그인 화면으로 이동합니다.");
          location.href = '/';
        }

      } else if (error.status == 405) {
        if (sessionStorage.getItem('accesstoken')) {
          sessionStorage.clear();
          alert("권한이 변경되어 로그인 화면으로 이동합니다.");
          location.href = '/';
        }
      }
    }

    if (error.status == 403 && error.error.code == "008") {
      //alert("접근권한이 없음");
      // 권한 없는 메뉴 링크를 클릭한 경우
      if (this.alt) {
        alert("접근권한이 없음");
        this.alt = false;
      }
      location.href = '/'

    } else {
      let msg = JSON.parse(error.message);
      return throwError({ status: msg.status, body: msg.body, message: msg.message });
    }
  }

  /**
   * 현재 설정된 HTTP 옵션 정보 조회
   *
   * @return  현재 설정된 HttpOption의 copy 본
   */
  private getActiveHttpOptions(params?: any): any {
    let copyHttpOptions = _.cloneDeep(this.httpOptions);
    let copyHttpHeaders = _.cloneDeep(this.defaultHeaders);

    if (sessionStorage.getItem('accesstoken')) {
      copyHttpHeaders['x-access-token'] = sessionStorage.getItem('accesstoken');
    }
    if (sessionStorage.getItem('selectMenuId')) {
      // copyHttpHeaders['menu-id'] = sessionStorage.getItem('selectMenuId');
    }
    _.merge(copyHttpHeaders, this.disposableHeaders);
    this.clearDisposableHeaders();
    copyHttpOptions.headers = new HttpHeaders(copyHttpHeaders);
    // //console.log(copyHttpOptions);
    if (params) {
      const keys = _.keys(params);
      let _params = new HttpParams();
      keys.forEach(key => {
        _params = _params.append(key, params[key]);
      });
      copyHttpOptions.params = _params;
    }

    return copyHttpOptions;
  }

  private getActiveHttpOptionsForGet(params?: any): any {
    let copyHttpOptions = _.cloneDeep(this.httpOptions);
    // spcieware filter 를 위해 Content-Type 제거
    let copyHttpHeaders = { 'Accept': 'application/json;charset=utf-8' };

    if (sessionStorage.getItem('accesstoken')) {
      copyHttpHeaders['x-access-token'] = sessionStorage.getItem('accesstoken');
    }
    if (sessionStorage.getItem('selectMenuId')) {
      // copyHttpHeaders['menu-id'] = sessionStorage.getItem('selectMenuId');
    }
    _.merge(copyHttpHeaders, this.disposableHeaders);
    this.clearDisposableHeaders();
    copyHttpOptions.headers = new HttpHeaders(copyHttpHeaders);
    // //console.log(copyHttpOptions);
    if (params) {
      const keys = _.keys(params);
      let _params = new HttpParams();
      keys.forEach(key => {
        _params = _params.append(key, params[key]);
      });
      copyHttpOptions.params = _params;
    }

    return copyHttpOptions;
  }

  /**
   * HTTP 요청 경로 생성
   *
   * @param appendPath 기본 Context Path에 추가할 경로
   *
   * @return  full 요청 경로
   */
  private makePath(appendPath?: string): string {
    let url = "";
    let defaultAppendPath = _.defaultTo(appendPath, "");
    if (!_.startsWith(defaultAppendPath, "http")) {
      url = this.url;
      if (!_.endsWith(this.url, "/")) {
        url += "/";
      }
      if (_.startsWith(defaultAppendPath, "/")) {
        defaultAppendPath = defaultAppendPath.substring(1);
      }
    }
    return (url + defaultAppendPath);
  }

}
