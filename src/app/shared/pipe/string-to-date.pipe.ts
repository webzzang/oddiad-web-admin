import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: 'dateFormatPipe', pure: false})
export class StringToDate implements PipeTransform {
  transform(value? : string, args?: string[]): any {
    if (!value) return value;

    if (value.length < 6) return value;

    let strDate : string = '';
    let yyyy : string = value.substr(0, 4);
    let mm : string = value.substr(4, 2);
    let dd : string = (value.length > 6) ? value.substr(6, 2) : '01';

    switch (value.length) {
      case 6 :
        strDate = yyyy + '-' + mm;
        break;
      case 8 :
        strDate = yyyy + '-' + mm + '-' + dd;
        break;
      case 14 :
        let hh : string = value.substr(8, 2);
        let mi : string = value.substr(10, 2);
        let ss : string = value.substr(12, 2);
        strDate = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + mi + ':' + ss;
        break;
      default :
        strDate = yyyy + '-' + mm + '-' + dd;
        break;
    }
    return strDate;
  }
}
