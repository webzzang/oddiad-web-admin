import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneNumber'
})
export class PhoneNumberPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    if (value) {
      let pieces: Array<string> = [];
      let buffer: string = value?.replace(/-/g, '');

      if (buffer && 11 >= buffer.length) {
        let cuttingLens: Array<number> = [3, 4, 4];
        let cuttingLen: number;

        for (let i: number = 0; i < cuttingLens.length; i++) {
          cuttingLen = cuttingLens[i];

          pieces.push(buffer.substr(0, Math.min(cuttingLen, buffer.length)));
          buffer = buffer.substring(cuttingLen, buffer.length);

          if (0 == buffer.length) {
            break;
          }
        }
      }

      return pieces.join('-');
    } else {
      return '';
    }
  }
}
