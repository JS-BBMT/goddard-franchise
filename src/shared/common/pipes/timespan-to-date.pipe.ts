import { Pipe, PipeTransform } from '@angular/core';
import { DateTimeUtilsService } from '@shared/utils/date-time/date-time-utils.service';

@Pipe({
    name: 'timeSpanToDate',
})
export class TimeSpanToDatePipe implements PipeTransform {
    constructor(private _dateUtils: DateTimeUtilsService) {}

    transform(value: any): Date | undefined {
        return this._dateUtils.convertTimeSpanToDate(value);
    }
}
