import {SearchInputType} from './searchinput.enum';
import {Observable} from 'rxjs';

export interface SearchOption {
  displayName: string;
  useDisplayNamePostfix?: boolean;
  inputType: SearchInputType;
  nameWidth: number;
  id: any;
  group?: string;
  options?: Array<any>;
  optionsOrderBy?: string; // value, name, disable ( available in SearchInputType.select or SearchInputType.selText )
  format?: string;
  isDateRange?: boolean;
  isDateRangeRadio?: boolean;
  selectedValue?: any;
  required?: boolean;
  parentId?: string;
  btnNm?: string;
  btnClick?: () => Observable<any>;
  btnClickResultOpts?: { display: string; value: string; };
  width?: number;
  lineBreak?: boolean;
  disabled?: boolean;
  placeHolder?: any;
  selTextValue?: any;
  selTextDisable?: boolean;
  selTextAllDisable?: boolean;
  addClass?: string;
  searchCondComo?: boolean;
  isDateRangeWithOption?: boolean;
  dateRangeRadioOptions?: Array<any>;
  selectId?: string;
  inputId?: string
}

