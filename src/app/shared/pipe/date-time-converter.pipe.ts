import { Pipe, PipeTransform } from '@angular/core';
import * as _moment from 'moment';

@Pipe({
    name: 'dateTimeConverter'
})
export class DateTimeConverterPipe implements PipeTransform {

    transform(value: any): any {
        let dateFormatted: string = '';

        let date = _moment(value.toDate()).locale('es');
        dateFormatted = date.format('LL') + ' | ' + _moment(value.toDate()).format('h:mm:ss a');

        return dateFormatted;
    }

}
