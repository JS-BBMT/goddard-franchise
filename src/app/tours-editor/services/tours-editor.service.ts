import { DateTimeService } from './../../shared/common/timing/date-time.service';
import { TourItemDto } from '@shared/service-proxies/service-proxies';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { FindToursInput } from '../manage-tours/find-tours-input';

@Injectable({
    providedIn: 'root',
})
export class ToursEditorService {
    constructor(private _dateTimeService: DateTimeService) {}

    public $currentTourSubject = new Subject<TourItemDto>();
    $currentTourObservable = this.$currentTourSubject.asObservable();

    public $currentToursSearchSubject = new Subject<FindToursInput>();
    $currentToursSearchObservable = this.$currentToursSearchSubject.asObservable();

    setCurrentTour(tour: TourItemDto) {
        this.$currentTourSubject.next(tour);
    }

    setCurrentToursSearch(filters: FindToursInput) {
        this.$currentToursSearchSubject.next(filters);
    }

    childrenNames(tour: TourItemDto): string {
        return tour.lead?.schoolChildLeads?.map((c) => c.firstName).join('<br/>');
    }

    childrenAges(tour: TourItemDto): string {
        return tour.lead?.schoolChildLeads?.map((c) => this._dateTimeService.getAge(c.dateOfBirth)).join('<br/>');
    }
}
