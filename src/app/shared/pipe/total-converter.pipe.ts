import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'totalConverter'
})
export class TotalConverterPipe implements PipeTransform {

    transform(services: any[], ...args: any[]): any {
        let sum: number = 0;
        services.forEach(a => sum += a.amount);
        return sum;
    }

}
