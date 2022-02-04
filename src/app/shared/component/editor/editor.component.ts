import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as _ from 'lodash';
import {ConfirmService} from '../confirm/confirm.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  @Input() isViewer;
  @Input() options;

  dataValue;
  @Output() dataChange = new EventEmitter();

  @Input()
  get data() {
    return this.dataValue;
  }
  set data(val) {
    this.dataValue = val;
    this.dataChange.emit(this.dataValue);
  }

  summernoteConfig;

  constructor(private confirm: ConfirmService) { }

  ngOnInit() {
    this.summernoteConfig = {
      placeholder: '',
      tabsize: 2,
      height: "250px",
      spellCheck: false,
      focus: true,
      //uploadImagePath: imageUploadPath,
      toolbar: [
          ['misc', ['codeview', 'undo', 'redo', 'help']],
          ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
          ['fontsize', ['fontname', 'fontsize', 'color']],
          ['para', ['style', 'ul', 'ol', 'paragraph', 'height']],
          ['insert', ['table',  'hr', 'link']],
      ],
      lineHeights: ['1.5', '2.0', '2.5', '3.0'],
      fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times']
    };

    if(this.options){
      _.keys(this.options).forEach(key => {
        this.summernoteConfig[key] = this.options[key];
      });
    }

  }

  onMediaDelete(event) {
    // 삭제하지 않음.
    // this.commonService.deleteEditorImg(event.url).subscribe(data => {
    // }, err => {
    //   this.confirm.alertError();
    // });
  }



}
