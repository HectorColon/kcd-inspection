import { Pipe, PipeTransform } from '@angular/core';
import * as _moment from 'moment';

@Pipe({
    name: 'dateTimeConverter'
})
export class DateTimeConverterPipe implements PipeTransform {

    transform(value: string): any {
        let dateFormatted: string = '';
        let dateFormat = new Date(value.replace('T', ' '));
        let date = _moment(dateFormat).locale('es');
        dateFormatted = date.format('LL') + ' | ' + _moment(dateFormat).format('h:mm:ss a');
        
        return dateFormatted;
    }

}
