import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CustomLocale} from "flatpickr/dist/types/locale";
import {Korean} from "flatpickr/dist/l10n/ko";
import {ContentService} from "../../../../service/content/content.service";
import {FileService} from "../../../../service/file.service";
import {ConfirmService} from "../../../../shared/component/confirm/confirm.service";
import {Observable} from "rxjs";
import {CommonComponent} from "../../../common-component";
import {GlobalConstants} from "../../../../domain/vo/global-constants";

/**
 * 사이트 팝업 편집
 */
@Component({
  selector: 'app-sitepopup-mng',
  templateUrl: './sitepopup-mng.component.html',
  styleUrls: ['./sitepopup-mng.component.scss']
})
export class SitepopupMngComponent extends CommonComponent implements OnInit {

  @Output('moveListEvent') moveListEventEmitter: EventEmitter<string> = new EventEmitter();

  constants = GlobalConstants;

  selectLists: any = {
    bannerUsableCode: []
  };

  seq: number;
  banner: any = {};

  imageSize: any = {
    width : 840,
    height: 1000
  }

  datepickerLocal: CustomLocale = Korean;

  constructor(private contentService: ContentService, private fileService: FileService, private confirmService: ConfirmService) {
    super();

    this.contentService.searchPopupCodes().subscribe((res) => {
      this.selectLists.bannerUsableCode = res.bannerUsableCode.map((item) => {
        return { name: item.name, value: 1 == item.val };
      });
    });
  }

  ngOnInit(): void {
  }

  /**
   * 팝업정보 등록
   */
  saveBanner(): void {
    let ob: Observable<any>;

    if (!this.seq) {
      ob = this.contentService.registerPopup(this.banner);
    } else {
      ob = this.contentService.modifyPopup(this.banner);
    }

    ob.subscribe((res) => {
      if (res.body && '000' != res.body.code) {
        this.confirmService.alert(res.body.message);
      } else {
        this.movePopupList('Y');
      }
    });
  }

  /**
   * 팝업 목록 페이지로 이동
   */
  movePopupList(refreshYn: string) : void {
    this.moveListEventEmitter.emit(refreshYn);
  }

  /**
   * 파일 업로드
   *
   * @param files
   */
  uploadFile(files: Array<File>): void {
    let file: File = files[0];
    let type: string = 'image';

    if (!this.constants.UPLOAD_FILE.isValid(file, type)) {
      this.confirmService.alert(this.constants.UPLOAD_FILE.notValidMessage(file, type));
    } else {
      let image = new Image();
      image.src = URL.createObjectURL(file);

      image.onload = (e: Event) => {
        let img = e['path'][0];

        if (this.imageSize.width == img.width && this.imageSize.height == img.height) {
          let formData: FormData = new FormData();
          formData.append('file', file);

          this.fileService.uploadFile(formData).subscribe((res) => {
            this.banner.fileSeq  = res.seq;
            this.banner.fileName = res.originName;
            this.banner.filePath = res.url;
          });
        } else {
          this.confirmService.alert([this.imageSize.width, '*', this.imageSize.height, ' 이미지를 선택하여 주십시오.'].join(''));
        }
      }
    }
  }

  /**
   * 파일 다운로드
   */
  downloadFile(): void {
    this.fileService.downloadFile(this.banner.fileSeq, this.banner.fileName);
  }

  /**
   * 파일 삭제
   */
  removeFile(): void {
    delete this.banner.fileSeq;
    delete this.banner.filePath;
  }

  /**
   * 팝업 시퀀스 변경
   *  - 외부 컴포넌트 조작용
   *
   * @param seq
   */
  public init(seq: number) : void {
    this.seq = seq;

    if (this.seq) {
      this.contentService.searchPopup(seq).subscribe((res) => {
        this.banner = res;
      });
    } else {
      this.banner = {
        usable: true
      };
    }
  }
}
