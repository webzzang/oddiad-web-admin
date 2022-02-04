import {Component, OnInit} from '@angular/core';
import {CommonComponent} from "../../../common-component";
import {CustomLocale} from "flatpickr/dist/types/locale";
import {Korean} from "flatpickr/dist/l10n/ko";
import {Utils} from "../../../../shared/utils/utils";
import {ContentService} from "../../../../service/content/content.service";
import {NgxSpinnerService} from "ngx-spinner";
import {MatDialog} from "@angular/material/dialog";
import {AdvPlaceSearchComponent} from "../../../share/adv-place-search/adv-place-search.component";

/**
 * 라이브스트림 편집
 */
@Component({
  selector: 'app-livestream-mng',
  templateUrl: './livestream-mng.component.html',
  styleUrls: ['./livestream-mng.component.scss']
})
export class LivestreamMngComponent extends CommonComponent implements OnInit {

  livestreamInfo: any = {};
  livestreamList: Array<any> = [];
  vodList: Array<any> = [];
  selectLists: any = {
    hours: [],
    mins : []
  };

  datepickerLocal: CustomLocale = Korean;

  constructor(private contentService: ContentService,
              private spinnerService: NgxSpinnerService,
              private matDialog: MatDialog) {
    super();

    this.searchLivestream();

    for (let i: number = 0; i < 24; i++) {
      this.selectLists.hours.push(Utils.numberPad(i, 2));
    }

    for (let i: number = 0; i < 60; i++) {
      this.selectLists.mins.push(Utils.numberPad(i, 2));
    }
  }

  ngOnInit(): void {
  }

  /**
   * 라이브스트림 추가
   */
  addLivestream(): void {
    this.livestreamList.push(this.setLivestreamDefaultInfo({}));
  }

  /**
   * 라이브스트림 삭제
   *
   * @param index
   */
  removeLivestream(index: number): void {
    this.livestreamList.splice(index, 1);
  }

  /**
   * 광고처 검색 팝업 오픈픈
  *
   * @param index
   */
  openSearchPartnerPopup(index: number): void {
    this.matDialog.open(AdvPlaceSearchComponent, {
      data : {
        openType: AdvPlaceSearchComponent.OPEN_TYPE.SINGLE,
        excludePartnerSeqs: this.vodList[index].partnerSeq ? [this.vodList[index].partnerSeq] : []
      }
    }).afterClosed().subscribe((partner) => {
      if (partner) {
        this.vodList[index].partnerSeq  = partner.partnerSeq;
        this.vodList[index].partnerName = partner.mallName;
      }
    });
  }

  /**
   * 라이브스트림 저장
   */
  saveLivestream(): void {
    this.livestreamList.forEach((livestream) => {
      livestream.startTime = [livestream.startHour, livestream.startMin, '00'].join('');
      livestream.endTime   = [livestream.endHour  , livestream.endMin  , '59'].join('');
    });

    let params: any = {
      liveStreamChannelId: this.livestreamInfo.liveStreamChannelId,
      liveStreamList     : this.livestreamList,
      vodList            : this.vodList
    };

    this.spinnerService.show('full');
    this.contentService.modifyLivestream(params).subscribe((res) => {
      this.searchLivestream();
    });
  }

  /**
   * 편집정보 취소 (재조회)
   */
  cancel(): void {
    this.searchLivestream();
  }

  /**
   * 라이브스트림 디폴트 정보 셋팅
   *
   * @param livestream
   */
  setLivestreamDefaultInfo(livestream: any): any {
    if (!livestream.startTime) {
      livestream.startTime = '000000';
    }

    livestream.startHour = livestream.startTime.substr(0, 2);
    livestream.startMin  = livestream.startTime.substr(2, 2);

    if (!livestream.endTime) {
      livestream.endTime = '235959';
    }

    livestream.endHour = livestream.endTime.substr(0, 2);
    livestream.endMin  = livestream.endTime.substr(2, 2);

    return livestream;
  }

  /**
   * 라이브스트림 조회
   */
  searchLivestream(): void {
    this.contentService.searchLivestream().subscribe((res) => {
      this.livestreamInfo = res.liveStreamResult;
      this.livestreamList = res.liveScheduleList;
      this.vodList        = res.vodList;

      this.livestreamList.forEach((livestream) => {
        this.setLivestreamDefaultInfo(livestream);
      });

      this.spinnerService.hide('full');
    });
  }
}
