import { Component, Injector, ViewChild, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { FeaturesApiClientFacade } from '@shared/service-proxies/features-api-client-facade';
import { TourGuideDto, TourStatus, TourType } from '@shared/service-proxies/service-proxies';
import { ToursApiClientFacade } from '@shared/service-proxies/tours-api-client-facade.service';
import { camelCaseToDisplayName, SelectListItem } from '@shared/utils/utils';
import { DateTime } from 'luxon';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { combineLatest } from 'rxjs';
import { FindToursInput, IFindToursInput } from '../manage-tours/find-tours-input';
import { ToursEditorService } from '../services/tours-editor.service';
import { catchError, delay, finalize } from 'rxjs/operators';
import { FeatureInterestOption } from '@app/shared/common/apis/generated/features';
@Component({
    selector: 'filter-tours-modal',
    templateUrl: './filter-tours-modal.component.html',
    styleUrls: ['./filter-tours-modal.component.css'],
    animations: [appModuleAnimation()],
})
export class FilterToursModalComponent extends AppComponentBase implements OnInit, OnDestroy {
    @ViewChild('FilterToursModal', { static: true }) modal: ModalDirective;

    filtering: boolean = false;
    guides: TourGuideDto[];
    _filterToursInput: IFindToursInput | undefined;
    _statusList: SelectListItem[] = [];
    _typesList: SelectListItem[] = [];

    _tourRangeDates: SelectListItem[] = [
        { text: 'Next 7 Days', value: '7' },
        { text: 'Next 14 Days', value: '14' },
        { text: 'Next 30 Days', value: '30' },
    ];
    _leadPreferredRangeDates: SelectListItem[] = [
        { text: 'Next 30 Days', value: '30' },
        { text: 'Next 60 Days', value: '60' },
        { text: 'Next 90 Days', value: '90' },
    ];
    tourRangeDatesDuration: number = +this._tourRangeDates[0].value;
    leadPreferredRangeDuration: number = +this._leadPreferredRangeDates[0].value;
    readonly range = 'range';
    readonly dates = 'dates';

    //to allow reset bsDaterangepicker(s)
    tourRangeDates: Date[] = [];
    preferredRangeDates: Date[] = [];
    programsOfInterest: FeatureInterestOption[];

    constructor(
        injector: Injector,
        private renderer: Renderer2,
        private _toursService: ToursApiClientFacade,
        private _dateTimeService: DateTimeService,
        private _toursEditorService: ToursEditorService,
        private _featuresApi: FeaturesApiClientFacade
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.loadTourSettingsFromEnums();
    }

    ngOnDestroy(): void {}

    loadTourSettingsFromEnums() {
        let status = Object.values(TourStatus);
        for (let index = 0; index < status.length; index++) {
            if (status[index] !== 'Cancelled') {
                this._statusList.push({ text: camelCaseToDisplayName(status[index]), value: status[index] });
            }
        }

        let types = Object.values(TourType);
        for (let index = 0; index < types.length; index++) {
            this._typesList.push({ text: camelCaseToDisplayName(types[index]), value: types[index] });
        }
    }

    toggleOptions(element: HTMLDivElement, elementToHide?: HTMLDivElement): void {
        const isDisabled = element?.classList?.contains('disabled-form-block');
        if (isDisabled) {
            this.renderer.removeClass(element, 'disabled-form-block');
            if (elementToHide) {
                this.renderer.addClass(elementToHide, 'disabled-form-block');
            }
        } else {
            this.renderer.addClass(element, 'disabled-form-block');
        }
    }

    open(): void {
        this.modal.show();
    }

    close(): void {
        this.reset();
        this.modal.hide();
    }

    reset(): void {
        this._filterToursInput = FindToursInput.default(this.appSession.school.crmId);
        this.tourRangeDatesDuration = +this._tourRangeDates[0].value;
        this.leadPreferredRangeDuration = +this._leadPreferredRangeDates[0].value;
        this.tourRangeDates = [];
        this.preferredRangeDates = [];
    }

    findTours(): void {
        const filter = this.getFilterModel();
        this.close();
        this._toursEditorService.setCurrentToursSearch(filter);
    }

    getFilterModel(): IFindToursInput {
        let filter = FindToursInput.fromJS({ ...this._filterToursInput });
        if (!filter.tourRangeDatesSelected) {
            //Clear any selected values that user may selected and the unchecked the Tour Date Range option
            filter.startDate = undefined;
            filter.endDate = undefined;
        } else if (filter.filterByTourStartDateOption === this.range) {
            filter.startDate = DateTime.utc();
            filter.endDate = filter.startDate.plus({ days: this.tourRangeDatesDuration });
        }

        if (!filter.preferredRangeDatesSelected) {
            //Clear any selected values that user may selected and the unchecked the Preferred Start Date option
            filter.leadStartDate = undefined;
            filter.leadEndDate = undefined;
        } else if (filter.filterByPreferredStartDateOption === this.range) {
            filter.leadStartDate = DateTime.utc();
            filter.leadEndDate = filter.leadStartDate.plus({ days: this.leadPreferredRangeDuration });
        }

        //Set ChildAge if user enter a numeric Age search
        if (filter.leadName && !isNaN(+filter.leadName)) {
            filter.childAge = +filter.leadName;
            filter.leadName = undefined;
        }

        return filter;
    }

    /**
     * set start/end dates on filter model when user changes dates(tour or lead preferred ranges)
     * relying on luxon DateTime class to set DateTime fields instance from the given js Dates.
     * @param $event array of start and end dates from the range date picker
     * @param target target field to assign start-end dates (tour or lead)
     */
    onSelectDatesRange($event: Date[] | undefined, target: string = 'tour'): void {
        if (!$event || !$event.length) {
            return;
        }
        let startDate = $event[0];
        let endDate = $event[1];

        if (target === 'tour') {
            this._filterToursInput.startDate = DateTime.fromJSDate(startDate).toUTC();
            this._filterToursInput.endDate = DateTime.fromJSDate(endDate).toUTC();
        } else {
            this._filterToursInput.leadStartDate = DateTime.fromJSDate(startDate).toUTC();
            this._filterToursInput.leadEndDate = DateTime.fromJSDate(endDate).toUTC();
        }
    }

    onChangeProgramOfInterest(event: Event): void {
        const input = event.target as HTMLInputElement;
        const value = input.value;
        if (input.checked) {
            this.safeAddSelectedProgramToLeadProgramsOfInterest(value);
        } else {
            this._filterToursInput.programsOfInterest = this._filterToursInput.programsOfInterest?.filter(
                (x) => x.toLowerCase() !== value.toLowerCase()
            );
        }
    }

    private safeAddSelectedProgramToLeadProgramsOfInterest(value: string): void {
        if (!this._filterToursInput.programsOfInterest) {
            this._filterToursInput.programsOfInterest = [];
        }
        if (this._filterToursInput.programsOfInterest.some((x) => x.toLowerCase() === value.toLowerCase())) {
            return;
        }
        this._filterToursInput.programsOfInterest.push(value);
    }

    /**
     * Returns true if program of interest is selected
     * @param program
     * @returns
     */
    public isProgramOfInterestSelected(program: string) {
        const result = this._filterToursInput?.programsOfInterest?.some(
            (x) => x.toLowerCase() == program.toLowerCase()
        );
        return result;
    }

    setUpSettingsAndOpenModal(): void {
        this.addSubscription(
            combineLatest([
                this._toursService.getSchoolGuides(this.appSession.school.crmId),
                this._featuresApi.getSchoolLeadProgramInterestOptions(this.appSession.school.crmId),
            ])
                .pipe(finalize(() => this.spinnerService.hide('content')))
                .subscribe(
                    ([guides, options]) => {
                        this.filtering = true;
                        this.programsOfInterest = options;
                        this.guides = guides;
                        this.reset();
                        this.open();
                    },
                    (error) => {
                        abp.message.error(this.l('AnErrorOccurred'), this.l('Error'));
                    }
                )
        );
    }
}
