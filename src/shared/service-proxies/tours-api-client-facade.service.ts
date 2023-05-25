import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import {
    CreateTourInput,
    PagedResultDtoOfTourItemDto,
    TourGuideDto,
    ToursEditorServiceServiceProxy,
    TourStatus,
    TourType,
} from './service-proxies';

@Injectable({ providedIn: 'root' })
export class ToursApiClientFacade {
    constructor(private _toursEditorServiceProxy: ToursEditorServiceServiceProxy) {}

    public getTours(
        schoolId: string,
        status: TourStatus | undefined,
        startDate?: DateTime | undefined,
        endDate?: DateTime | undefined,
        type?: TourType | undefined,
        guideName?: string | undefined,
        leadName?: string | undefined,
        childAge?: number | undefined,
        leadStartDate?: DateTime | undefined,
        leadEndDate?: DateTime | undefined,
        programsOfInterest?: string[] | undefined
    ): Observable<PagedResultDtoOfTourItemDto> {
        return this._toursEditorServiceProxy.findTours(
            schoolId,
            status,
            startDate,
            endDate,
            type,
            guideName,
            leadName,
            childAge,
            leadStartDate,
            leadEndDate,
            programsOfInterest
        );
    }

    public getSchoolGuides(crmId: string | undefined): Observable<TourGuideDto[]> {
        return this._toursEditorServiceProxy.getSchoolGuides(crmId);
    }

    createTour(body: CreateTourInput | undefined): Observable<void> {
        return this._toursEditorServiceProxy.createTour(body);
    }
}
