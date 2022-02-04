import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {RestClient} from '../shared/http/rest-client';
import {Injectable} from '@angular/core';
import {Utils} from "../shared/utils/utils";
import {NgxSpinnerService} from "ngx-spinner";
import * as _ from 'lodash';
import * as JSZip from "jszip";
import {saveAs} from "file-saver";

/**
 * 파일 관리
 */
@Injectable({ providedIn: 'root' })
export class FileService extends RestClient {

  constructor(protected http: HttpClient, private spinnerService: NgxSpinnerService) {
    super('/file', http);
  }

  /**
   * 파일 업로드
   * 
   * @param formData
   */
  uploadFile(formData: FormData): Observable<any> {
    return this.upload(`single`, formData);
  }

  /**
   * 파일 다운로드
   *
   * @param seq
   */
  downloadFile(seq: number, fileName?: string): Observable<any> {
    this.spinnerService.show('full');

    let op: Observable<any> = this.download([seq].join(''));

    op.subscribe((res) => {
      if (res && fileName) {
        Utils.downloadFile(res, fileName);
      }

      this.spinnerService.hide('full');
    });

    return op;
  }

  /**
   * 파일목록 zip 압축 다운로드
   *
   * @param files
   * @param seqName
   */
  downloadFiles(zipFileName: string, files: Array<any>): void {
    if (0 < files.length) {
      this.spinnerService.show('full');

      let url: string;

      let promises: Array<any> = [];
      let zip: JSZip = new JSZip();

      _.forEach(files, (file) => {
        promises.push(this.download(file.seq).toPromise());
      });

      Promise.all(promises).then((results) => {
        _.forEach(results, (result: Blob, index: number) => {
          url = window.URL.createObjectURL(result);

          zip.file(files[index].name, result);
        });

        zip.generateAsync({type: 'blob'}).then((blob: Blob) => {
          saveAs(blob, [zipFileName, 'zip'].join('.'));

          this.spinnerService.hide('full');
        });
      });
    }
  }
}


