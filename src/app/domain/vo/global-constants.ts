import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import emailMask from 'text-mask-addons/dist/emailMask';
import * as _ from 'lodash';

/**
 * 전역 상수
 */
export class GlobalConstants {

  /**
   * 업로드 파일 설정
   */
  static readonly UPLOAD_FILE = {
    size: {
      // 단위 MB
      image: 20,
      video: 200,
      isValid: (file: File) => {
        let sizeMB: number = file.size / (1024 * 1024);
        let fileType: string = file.type.split('/')[0];

        switch (fileType) {
          case 'image':
            return GlobalConstants.UPLOAD_FILE.size.image >= sizeMB;
          case 'video':
            return GlobalConstants.UPLOAD_FILE.size.video >= sizeMB;
          default:
            return false;
        }
      },
      notValidMessage: (file: File) => {
        let fileType: string = file.type.split('/')[0];

        switch (fileType) {
          case 'image':
            return ['이미지는 ', GlobalConstants.UPLOAD_FILE.size.image, 'MB까지 업로드 가능합니다.'].join('');
          case 'video':
            return ['동영상은 ', GlobalConstants.UPLOAD_FILE.size.video, 'MB까지 업로드 가능합니다.'].join('');
          default:
            return '';
        }
      }
    },
    type: {
      isValid: (file: File) => {
        let fileType: string = file.type.split('/')[0];
        let fileExt : string = file.type.split('/')[1]

        switch (fileType) {
          case 'image':
            return -1 < GlobalConstants.UPLOAD_FILE.allow.image.indexOf(fileExt);
          case 'video':
            return true;
          default:
            return false;
        }
      },
      notValidMessage: (file: File) => {
        let fileType: string = file.type.split('/')[0];

        switch (fileType) {
          case 'image':
            return ['이미지는 ', GlobalConstants.UPLOAD_FILE.allow.image.join(','), '만 업로드 가능합니다.'].join('')
          case 'video':
            return '';
          default:
            return '허용하지 않는 파일 형식입니다.';
        }
      }
    },
    allow: {
      image: ['png', 'jpg', 'jpeg'],
      video: ['제한없음']
    },
    accept: {
      image: '.png, .jpg, .jpeg',
      video: 'video/*',
      all  : '.png, .jpg, .jpeg, video/*'
    },
    isValid: (file: File, type?: string) => {
      let result: boolean = true;

      if (type) {
        result = file.type.startsWith(type);
      }

      return result
          && GlobalConstants.UPLOAD_FILE.type.isValid(file)
          && GlobalConstants.UPLOAD_FILE.size.isValid(file);
    },
    notValidMessage: (file: File, type?: string) => {
      if (type && !file.type.startsWith(type)) {
        if ('image' == type) {
          return [GlobalConstants.UPLOAD_FILE.allow.image.join(', '), ' 형식의<br>이미지만 업로드 가능합니다.'].join('')
        } else if ('video' == type) {
          return '동영상만 업로드 가능합니다.';
        } else {
          return '잘못된 형식을 지정하였습니다.<br>지정된 형식을 확인하여 주십시오.';
        }
      } else if (!GlobalConstants.UPLOAD_FILE.type.isValid(file)) {
        return GlobalConstants.UPLOAD_FILE.type.notValidMessage(file);
      } else if (!GlobalConstants.UPLOAD_FILE.size.isValid(file)) {
        return GlobalConstants.UPLOAD_FILE.size.notValidMessage(file);
      }
    }
  };

  /** 마스킹 설정 */
  static MASK = {
    telephone: [/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
    businessNumber: [/[1-9]/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/],    
    registerNumber: [/[0-9]/, /\d/, /\d/, /\d/,/\d/,/\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/],
    range: (limit: number, includeThousandsSeparator:boolean = true) => createNumberMask({
      prefix: '',
      suffix: '',
      includeThousandsSeparator: includeThousandsSeparator,
      integerLimit: limit
    }),
    email: emailMask,
    number: createNumberMask({
      prefix: '',
      suffix: ''
    }),
    alphaNumber: (val: string) => {
      let arr = _.toArray(val);
      let resultArr = [];
      _.each(arr, item => {
        let r = item.replace(/[^0-9a-zA-Z]/, "");
        if(!_.isEmpty(r)){
          resultArr.push(/[0-9a-zA-Z]/);
        }
      });
      return resultArr;
    }
  };
}
