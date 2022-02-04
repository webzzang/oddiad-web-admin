import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringFormatPipe'
})
export class StringFormatPipe implements PipeTransform {

  transform(value: string, options: any): string {
    if (value) {
      switch (options.type) {
        case 'flag':
          return options.options[value];
        case 'mask-default':
          return this.maskDefault(value);
        case 'mask-name':
          return this.maskName(value);
        case 'substr':
          return this.substr(value, options.length);
        case 'comma':
          return this.numberWithComma(value);
        case 'percentage':
          return String(Math.floor(Number(value)*100))+'%';
        case 'unit':
          return `${value}${options.unit}`;
        case 'phone':
            return this.phoneFormatter(value);
        case 'mobilePhone':
            return this.mobilePhoneFormatter(value);
        default:
          return value;
      }
    } else {
      return value;
    }

  }

  private maskName(value: string): string {
    if (value.length==1) {
      return '*';
    } else if (value.length==2) {
      return `${value.substr(0, 1)}*`;
    } else {
      return `${value.substr(0, 1)}*${value.substr(value.length-1, 1)}`
    }
  }

  private maskDefault(value: string): string {
    let result = '';

    if (value && value.length != 0) {
      const length = value.length;
      const maskRange = length / 3;
      const head = value.substr(0, maskRange);
      let loop = length - maskRange - head.length;
      const tail = value.substr(maskRange + loop, length - loop);

      do {
        result += '*';
      } while(loop-- > 1)

      result = head + result + tail;

    } else {
      result = value;
    }

    return result;
  }

  private substr(value?: any, length?: number) {
    if (value) {
      if (length) {
        if (value.length <= length) {
          return value;
        } else {
          return value.substring(0, length);
        }
      } else {
        if (value.length <= 10) {
          return value;
        } else {
          return value.substring(0, 10);
        }
      }
    }

    return value;
  }

  private numberWithComma(value?: any) {
    if (value) {
      return (''+value).replace(/\b(\d+)((\.\d+)*)\b/g, function(a, b, c) {
        return (b.charAt(0) > 0 && !(c || ".").lastIndexOf(".") ? b.replace(/(\d)(?=(\d{3})+$)/g, "$1,") : b) + c;
      });
    }
  }

  private bizNumberFormat(value: string) {
    if (value) {
      return `${value.substr(0, 3)}-${value.substr(3, 2)}-${value.substr(5, 5)}`;
    } else {
      return value;
    }
  }

  private phoneFormatter(num: string, needMask: boolean = false) {
    let formatNum = '';
    try {
      if (num.length === 11) {
        formatNum = num.replace(/(\d{3})(\S{4})(\d{4})/, (needMask) ? '$1-****-$3' : '$1-$2-$3');
      } else if (num.length === 8) {
        formatNum = num.replace(/(\d{4})(\d{4})/, '$1-$2');
      } else {
        if (num.indexOf('02') === 0) {
          formatNum = num.replace(/(\d{2})(\d{4})(\d{4})/, (needMask) ? '$1-****-$3' : '$1-$2-$3');
        } else {
          formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, (needMask) ? '$1-***-$3' : '$1-$2-$3');
        }
      }
    } catch (e) {
       formatNum = num;
       // console.error(e);
    }

    return formatNum;
 }

 private mobilePhoneFormatter(phone: string) {

  //phone = phone.replace(/[^\d]/g, "");
  if (phone.length == 11) {
      //reformat and return phone number
      return phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  }

}

}
