import { Pipe, PipeTransform } from '@angular/core';
import * as _moment from 'moment';

@Pipe({
    name: 'dateTimeConverter'
})
export class DateTimeConverterPipe implements PipeTransform {

    transform(value: any): any {
        let dateFormatted: string = '';
    
        if (_moment.isDate(value)) {
            let date = _moment(value).locale('es');
            dateFormatted = date.format('LL') + ' | ' + _moment(value).format('h:mm:ss a');
        } else {
            let date = _moment(value.toDate()).locale('es');
            dateFormatted = date.format('LL') + ' | ' + _moment(value.toDate()).format('h:mm:ss a');
        }

        return dateFormatted;
    }

}
