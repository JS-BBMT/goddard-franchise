import { DateTime } from 'luxon';
import { ToursEditorConstants } from '@app/tours-editor/tours-editor-constants';
import { Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Angulartics2 } from 'angulartics2';
import { finalize } from 'rxjs/operators';
import { ToursApiClientFacade } from '@shared/service-proxies/tours-api-client-facade.service';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { ToursEditorService } from '../services/tours-editor.service';
import { AppAnalyticsService } from '@shared/common/analytics/app-analytics.service';
import { TourItemDto } from '@shared/service-proxies/service-proxies';
import { FilterToursModalComponent } from '../filter-tours-modal/filter-tours-modal.component';
import { FindToursInput, IFindToursInput } from './find-tours-input';
import { NewLeadModalComponent } from '../new-lead-modal/new-lead-modal.component';

@Component({
    selector: 'app-manage-tours',
    templateUrl: './manage-tours.component.html',
    styleUrls: ['./manage-tours.component.css'],
})
export class ManageToursComponent extends AppComponentBase implements OnInit, OnDestroy {
    @ViewChild('filterToursModal', { static: true }) filterToursModal: FilterToursModalComponent;
    @ViewChild('newLeadModal', { static: true }) newLeadModal: NewLeadModalComponent;
    tours: TourItemDto[] = [];
    filtersAreDefault: boolean = false;
    NOT_YET_IMPLEMENTED: string = ToursEditorConstants.NOT_YET_IMPLEMENTED;

    constructor(
        injector: Injector,
        private _angulartics2: Angulartics2,
        private _toursService: ToursApiClientFacade,
        private _dateTimeService: DateTimeService,
        private _toursEditorService: ToursEditorService
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.addSubscription(
            this._toursEditorService.$currentToursSearchSubject.subscribe((filters) => {
                this.findTours(filters);
            })
        );
        this.loadScheduledTours();
    }

    ngOnDestroy(): void {
        this.unsubscribeFromSubscriptionsAndHideSpinner();
    }

    loadScheduledTours(): void {
        this.findTours(FindToursInput.default(this.appSession.school.crmId));
    }

    findTours(filters: IFindToursInput): void {
        this.spinnerService.show('content');
        this.addSubscription(
            this._toursService
                .getTours(
                    filters.schoolId,
                    filters.status,
                    filters.startDate,
                    filters.endDate,
                    filters.type,
                    filters.guideName,
                    filters.leadName,
                    filters.childAge,
                    filters.leadStartDate,
                    filters.leadEndDate,
                    filters.programsOfInterest
                )
                .pipe(finalize(() => this.spinnerService.hide('content')))
                .subscribe((response) => {
                    this.tours = response.items;
                    //Filter are the same as the default options
                    this.filtersAreDefault =
                        JSON.stringify(FindToursInput.default(this.appSession.school.crmId)) == JSON.stringify(filters);
                }, this.displayError)
        );
    }

    openModal(id: string | undefined): void {
        let tour = TourItemDto.fromJS({});
        if (id !== undefined) {
            tour = TourItemDto.fromJS({ id: this.NOT_YET_IMPLEMENTED });
        }
        this._toursEditorService.setCurrentTour(tour);
    }

    openFilterModal(): void {
        this.filterToursModal.setUpSettingsAndOpenModal();
    }

    openNewLeadModal(): void {
        this.newLeadModal.open();
    }

    childrenNames(tour: TourItemDto): string {
        return this._toursEditorService.childrenNames(tour);
    }

    childrenAges(tour: TourItemDto): string {
        return this._toursEditorService.childrenAges(tour);
    }

    getTourType(type: number) {
        return type === 0 ? 'In Person' : 'Online';
    }

    getTourStatus(status: number): string {
        switch (status) {
            case 0:
            default:
                return 'Scheduled';
            case 1:
                return 'Completed';
            case 2:
                return 'No Show';
            case 3:
                return 'Completed';
        }
    }

    getTourDateTime(scheduledDateTime: string): string {
        let date = DateTime.fromISO(scheduledDateTime);
        var month = date.month;
        var dayOfMonth = date.day;
        var hours = date.hour;
        var minutes = date.minute;
        var ampm = hours >= 12 ? 'p' : 'a';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? 0 + minutes : minutes;
        //Show two digits
        return (
            `${month}/${dayOfMonth}  ` +
            (hours < 10 ? '0' + hours : hours) +
            ':' +
            (minutes < 10 ? '0' + minutes : minutes) +
            ampm
        );
    }

    isNewTour(createdDateTime: string): boolean {
        return (
            this._dateTimeService.getDiffInHours(new Date(), new Date(createdDateTime)) <
            ToursEditorConstants.NEW_TOURS_HOURS_DIFFERENCE
        );
    }

    onSaveTour(isSuccess: boolean): void {
        // analytics
        this._angulartics2.eventTrack.next({
            action: 'Save Tour',
            properties: {
                category: AppAnalyticsService.CONSTANTS.SITE_EDITOR.PUBLISH_CHANGES,
                label: this.appSession.school?.advertisingName,
            },
        });

        abp.message.success(this.l('Success_Update_Msg'), this.l('Success_Update_Title')).then(() => {
            this.loadScheduledTours();
        });
    }
}
