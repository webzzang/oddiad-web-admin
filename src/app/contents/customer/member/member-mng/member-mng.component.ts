import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MemberService} from "../../../../service/customer/member.service";
import {CommonComponent} from "../../../common-component";
import {FileService} from "../../../../service/file.service";

/**
 * 고객 관리
 */
@Component({
  selector: 'app-member-mng',
  templateUrl: './member-mng.component.html',
  styleUrls: ['./member-mng.component.scss']
})
export class MemberMngComponent extends CommonComponent implements OnInit {

  @Output('moveListEvent')
  protected moveListEventEmitter: EventEmitter<string> = new EventEmitter();

  selectLists: any = {
    memberStatus: []
  };

  id: string;
  member : any = {};

  clauses: Array<any> = [];
  clauseGrid: any = {};

  moveButtonDisabled: boolean = false;

  constructor(protected memberService: MemberService,
              protected fileService  : FileService) {
    super();

    this.memberService.searchCodes().subscribe((res) => {
      this.selectLists.memberStatus = res.statusCode.map((item) => {
        return { name: item.name, value: item.code };
      });
    });
  }

  ngOnInit(): void {
  }

  saveMember(): void {
    let params: any = {
      id: this.member.id,
      stateCode: this.member.stateCode,
      memo: this.member.memo
    };

    this.memberService.modify(params).subscribe((res) => {
      this.moveMemberList('Y');
    });
  }

  /**
   * 고객 계정 관리 메뉴로 이동
   */
  moveMemberList(refreshYn: string) : void {
    this.member = {};
    this.moveListEventEmitter.emit(refreshYn);
  }

  /**
   * 법인사업자등록증 다운로드
   */
  downloadCompanyFile(): void {
    this.fileService.downloadFile(this.member.cbusinessLicenseFileSeq, [this.member.cceo, '사업자등록증(기업).jpg'].join('_'));
  }

  /**
   * 개인사업자등록증 다운로드
   */
  downloadPersonFile(): void {
    this.fileService.downloadFile(this.member.pbusinessLicenseFileSeq, [this.member.pceo, '사업자등록증(개인).jpg'].join('_'));
  }

  /**
   * 광고심사 메뉴로 이동
   */
  moveJudgeList(): void {
    this.moveMenu('ADV001', { searchType: 'email', searchValue: this.member.email });
  }

  /**
   * 광고내역 메뉴로 이동
   */
  moveAdvHistoryList(): void {
    this.moveMenu('BLL001', { searchType: 'email', searchValue: this.member.email });
  }

  /**
   * 결제내역 메뉴로 이동
   */
  movePaymentList(): void {
    this.moveMenu('BLL002', { searchType: 'buyerEmail', searchValue: this.member.email });
  }

  /**
   * 메뉴이동
   *
   * @param id
   * @param queryParams
   */
  moveMenu(id: string, queryParams: any): void {
    if (this.member.email) {
      sessionStorage.setItem(
          'moveRequestMenuInfo',
          JSON.stringify({ id: id, queryParams: queryParams }));

      this.moveButtonDisabled = true;
    }
  }

  /**
   * 고객 계정 아이디 변경
   *  - 외부 컴포넌트 조작용
   *
   * @param id
   */
  public init(id: string) : void {
    this.id = id;

    if (this.id) {
      this.memberService.search(this.id).subscribe((res) => {
        this.member  = res;
        this.clauses = res.memberTermsList;

        this.clauseGrid = {
          isInitLoad: true,
          defaultColDef: {
            cellStyle : {
              'text-align' : 'center'
            }
          },
          gridHeight: 40 + (this.clauses.length ? 6 : 0) + (this.clauses.length || 4) * 36,
          rowClassRules: {},
          columnDefs: [
            { headerName: '약관종류', field: 'frontTitle', width: 150, sortable: false, useSort: false },
            { headerName: '약관제목', field: 'adminTitle', width: 150, sortable: true, useSort: false },
            { headerName: '약관버전', field: 'version', width: 100, sortable: true, useSort: false },
            { headerName: '필수여부', field: 'requiredName', width: 100, sortable: true, useSort: false },
            { headerName: '동의상태', field: 'termsName', width: 100, sortable: true, useSort: false }
          ]
        };
      });
    }
  }
}
