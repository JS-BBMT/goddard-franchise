import { Injectable } from '@angular/core';

@Injectable()
export class DateTimeUtilsService {
    convertTimeSpanToDate(timeSpan: any): Date | undefined {
        if (timeSpan instanceof Date) {
            return timeSpan;
        }

        if (timeSpan) {
            const currentDate = new Date().toDateString();
            if (timeSpan.value) {
                return new Date(
                    `${currentDate} ${this.change24To12Hour(timeSpan.value.hours)}:${timeSpan.value.minutes}`
                );
            }
            return new Date(`${currentDate} ${this.change24To12Hour(timeSpan.hours)}:${timeSpan.minutes}`);
        }

        return timeSpan;
    }

    change24To12Hour(hours: number): number {
        return hours % 12;
    }

    getNextHour(): Date {
        let now = new Date();
        if (now.getMinutes() >= 1) {
            now.setHours(now.getHours() + 1);
        }
        now.setMinutes(0);
        return now;
    }

    /**
     * workaround functions to address issue converting from/to js local date-time
     * https://github.com/valor-software/ngx-bootstrap/issues/5635

        if offset equals -60 then the time zone offset is UTC+01
     * The number of minutes returned by getTimezoneOffset() is positive if the local time zone is behind UTC,
     * and negative if the local time zone is ahead of UTC. For example, for UTC+10, -600 will be returned.
     *
     * Note we're not shifting the time, just adding back the timezone so that the UI components are working with
     * local dates.
     *
     * This effectively causes whatever the user enters to be the time of the event and local time of the schools
     * timezone is always assumed.
     */
    convertUTCToLocalDate(date: Date): Date {
        let localDate = new Date(0);
        if (localDate.getTimezoneOffset() < 0) {
            date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        } else if (localDate.getTimezoneOffset() > 0) {
            date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
        }
        return date;
    }

    /**
     * Then here we are removing the timezone so that we are saving whatever the user entered as a UTC date
     *
     */
    convertLocalDateToUTC(date: Date): Date {
        let localDate = new Date(0);
        if (localDate.getTimezoneOffset() < 0) {
            date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
        } else if (localDate.getTimezoneOffset() > 0) {
            date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        }
        return date;
    }

    getTime(date: Date, utc: boolean = true, appendAMPM: boolean = true, is24HoursFormat: boolean = true): string {
        var hours = utc ? date.getUTCHours() : date.getHours();
        var minutes = utc ? date.getUTCMinutes() : date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        if (!is24HoursFormat) {
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
        }

        minutes = minutes < 10 ? 0 + minutes : minutes;
        //Show two digits
        return (
            (hours < 10 ? '0' + hours : hours) +
            ':' +
            (minutes < 10 ? '0' + minutes : minutes) +
            (appendAMPM ? ampm : '')
        );
    }

    /**
     * returns an array of dates that starts at the current date and goes up to 'howManyDays'
     * worth of days.
     * Used to allow calendar widget to only enable the selected range dates.
     * @param howManyDays number of dates that should be added to the result array
     * @returns
     */
    getDatesUpTo(howManyDays: number): Date[] {
        let dates: Date[] = [];
        let minDate = new Date();
        let maxDate = new Date();
        maxDate.setDate(minDate.getDate() + howManyDays);
        while (minDate <= maxDate) {
            dates.push(new Date(minDate));
            minDate.setDate(minDate.getDate() + 1);
        }
        return dates;
    }
}
