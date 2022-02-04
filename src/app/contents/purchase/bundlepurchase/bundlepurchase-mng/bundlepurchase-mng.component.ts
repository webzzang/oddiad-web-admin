import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CommonComponent} from "../../../common-component";
import {PurchaseService} from "../../../../service/purchase/purchase.service";
import {FileService} from "../../../../service/file.service";
import {Observable} from "rxjs";
import {ConfirmService} from "../../../../shared/component/confirm/confirm.service";
import {GlobalConstants} from "../../../../domain/vo/global-constants";
import {isNaN} from "lodash";
import {CdkDragDrop} from "@angular/cdk/drag-drop";
import {NgxSpinnerService} from "ngx-spinner";
import {MatDialog} from "@angular/material/dialog";
import {AdvPlaceSearchComponent} from "../../../share/adv-place-search/adv-place-search.component";
import * as _ from "lodash";
import {BundlePurchaseService} from "../../../../service/purchase-bundle/bundle-purchase.service";

/**
 * 묶음상품 편집
 */
@Component({
  selector: 'app-bundlepurchase-mng',
  templateUrl: './bundlepurchase-mng.component.html',
  styleUrls: ['./bundlepurchase-mng.component.scss']
})
export class BundlepurchaseMngComponent extends CommonComponent implements OnInit {

  @Output('moveListEvent') moveListEventEmitter: EventEmitter<string> = new EventEmitter();

  constants = GlobalConstants;

  selectLists: any = {
    badgeCode: [],
    expoCode : [],
    operationCode: []
  };

  seq: number;
  product: any = {};
  partners: Array<any> = [];
  files: Array<any> = [];

  constructor(private purchaseService: BundlePurchaseService,
              private fileService    : FileService,
              private confirmService : ConfirmService,
              private spinnerService : NgxSpinnerService,
              private matDialog: MatDialog) {
    super();

    this.purchaseService.searchBundleProductCodes().subscribe((res) => {
      this.selectLists.badgeCode = [
        { name: '선택', value: '' }
      ].concat(res.badgeCode.map((item) => {
        return { name: item.name, value: item.code };
      }));

      this.selectLists.expoCode = res.usableCode.map((item) => {
        return { name: item.name, value: item.val == 1 };
      })

      this.selectLists.operationCode = res.operationCode.map((item) => {
        return { name: item.name, value: item.val == 1 };
      })
    });
  }

  ngOnInit(): void {
  }

  /**
   * 묶음상품 등록
   */
  saveProduct(): void {
    let params: any = {
      seq: this.seq,
      advCaseExpo: this.product.advCaseExpo,
      badgeCode: this.product.badgeCode,
      description: this.product.description,
      memo: this.product.memo,
      name: this.product.name,
      operation: this.product.operation,
      partnerSeq: this.partners.map((partner) => {
        return partner.partnerSeq;
      }),
      price: this.product.price,
      productFileList: this.files.map((file) => {
        file.productSeq = file.seq;

        if (file.regDate) {
          file.regDate = file.regDate.split(' ').join('T');
        }

        return file;
      })
    };

    let ob: Observable<any>;

    if (!this.seq) {
      ob = this.purchaseService.registerBundleProduct(params);
    } else {
      ob = this.purchaseService.modifyBundleProduct(params);
    }

    ob.subscribe((res) => {
      this.moveBundleProductList('Y');
    });
  }

  /**
   * 묶음상품 목록 페이지로 이동
   */
  moveBundleProductList(refreshYn: string) : void {
    this.moveListEventEmitter.emit(refreshYn);
  }

  /**
   * 파일 업로드
   *
   * @param files
   */
  uploadFile(files: Array<File>, index: number): void {
    let file: File = files[0];
    let type: string = 'image';

    if (this.constants.UPLOAD_FILE.isValid(file, type)) {
      let formData = new FormData();
      formData.append('file', file);

      this.spinnerService.show('full');
      this.fileService.uploadFile(formData).subscribe((res) => {
        this.files.splice(index, 0, this.correctFilePath({
          seq: this.seq,
          fileSeq: res.seq,
          name: res.originName,
          path: res.url,
          type: 'AFT001'
        }));

        this.spinnerService.hide('full');
      });
    } else {
      this.confirmService.alert(this.constants.UPLOAD_FILE.notValidMessage(file, type));
    }
  }

  /**
   * 파일 다운로드
   */
  downloadFile(seq: number, name: string): void {
    this.fileService.downloadFile(seq, name);
  }

  /**
   * 파일 삭제
   */
  removeFile(index: number): void {
    this.files.splice(index, 1);
  }

  /**
   * 파일타입에 맞게끔 path 변경
   *
   * @param file
   */
  correctFilePath(file: any): any {
    if ('AFT002' == file.type) {
      file.path = '/assets/images/img-videothum.png';
    }

    return file;
  }

  /**
   * 파일 순번 이동
   *
   * @param event
   */
  dragFile(event: CdkDragDrop<string[]>): void {
    let prevIndex: number = event.previousIndex;
    let currIndex: number = event.currentIndex;

    let dragItem: any = this.files[prevIndex];

    this.files.splice(prevIndex, 1);
    this.files.splice(currIndex, 0, dragItem);
  }

  /**
   * 가격 셋팅
   *
   * @param value
   */
  setPrice(value: string): void {
    let buffer = (value || '').replace(/,/g, '');

    if (isNaN(buffer)) {
      buffer = '0';
    }

    this.product.price = parseInt(buffer);
  }

  /**
   * 광고처 조회팝업
   */
  openSearchPartnerPopup(): void {
    this.matDialog.open(AdvPlaceSearchComponent, {
      data : {
        openType: AdvPlaceSearchComponent.OPEN_TYPE.MULTIPLE,
        channelType: 'PTT001',
        excludePartnerSeqs: this.partners.map((partner) => {
          return partner.partnerSeq
        })
      }
    }).afterClosed().subscribe((partners: Array<any>) => {
      if (partners && 0 < partners.length) {
        _.forEach(partners, (partner) => {
          this.partners.push({ seq: this.seq, partnerSeq: partner.partnerSeq, mallName: partner.mallName });
        });
      }
    });
  }

  removePartner(index: number): void {
    this.partners.splice(index, 1);
  }

  /**
   * 묶음상품 시퀀스 변경
   *  - 외부 컴포넌트 조작용
   *
   * @param seq
   */
  public init(seq: number) : void {
    this.seq = seq;

    if (this.seq) {
      this.purchaseService.searchBundleProduct(seq).subscribe((res) => {
        this.product = res.productBundleResult;
        this.files   = res.productBundleFileList;
        this.partners= res.productBundlePartnerList;

        this.product.priceLabel = !isNaN(this.product.price) ? this.product.price : 0;
        this.product.badgeCode  = this.product.badgeCode || '';
      });
    } else {
      this.product = {
      };
    }
  }
}
