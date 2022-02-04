import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: 'listFilter', pure: true})
export class ListFilter implements PipeTransform {
  transform(items: any[], filterObj?: any) : any {
    if (!items || !filterObj) {
      return items;
    }

    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return items.filter(item => item[filterObj.key] == filterObj.value );
  }
}
