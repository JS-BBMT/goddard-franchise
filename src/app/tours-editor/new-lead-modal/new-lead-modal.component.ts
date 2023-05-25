import { ToursEditorConstants } from '@app/tours-editor/tours-editor-constants';
import {
    ChildLead,
    CreateLeadInput,
    CreateTourInput,
    FollowUpTimeFrame,
    LeadDto,
    TourGuideDto,
    TourStatus,
    TourType,
} from './../../../shared/service-proxies/service-proxies';
import { Renderer2, ElementRef } from '@angular/core';
import { TourItemDto, TourItemLeadDto } from '@shared/service-proxies/service-proxies';
import { Component, Injector, ViewChild, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { combineLatest, Subscription } from 'rxjs';
import { ToursEditorService } from '../services/tours-editor.service';
import { LeadsApiClientFacade } from '@shared/service-proxies/leads-api-client-facade.service';
import { FeaturesApiClientFacade } from '@shared/service-proxies/features-api-client-facade';
import { FeatureInterestOption } from '@app/shared/common/apis/generated/features';
import { ToursApiClientFacade } from '@shared/service-proxies/tours-api-client-facade.service';
import { camelCaseToDisplayName, SelectListItem } from '@shared/utils/utils';
import { DateTime } from 'luxon';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { DateTimeUtilsService } from '@shared/utils/date-time/date-time-utils.service';

@Component({
    selector: 'new-lead-modal',
    templateUrl: './new-lead-modal.component.html',
    styleUrls: ['./new-lead-modal.component.css'],
    animations: [appModuleAnimation()],
})
export class NewLeadModalComponent extends AppComponentBase implements OnInit, OnDestroy {
    @Output() save: EventEmitter<TourItemDto> = new EventEmitter<TourItemDto>();
    @Output() back: EventEmitter<Boolean> = new EventEmitter();
    @ViewChild('NewLeadModal', { static: true }) modal: ModalDirective;
    @ViewChild('discardChangesModal', { static: true }) discardModal: ModalDirective;

    lead: LeadDto;
    //Test New Lead Object
    newLead:any =  {
        firstName:  undefined,
        lastName: undefined,
        additionalRemarks: undefined,
        streetLine1: undefined,
        city: undefined,
        zipCode:undefined,
        mobilePhone: undefined,
        emailAddress: undefined,
        startDate: new Date(),
        contactPreference: undefined,
        schoolChildLeads: [
            {
                firstName:"",
                dateOfBirth:new Date()
            }
        ],
        schoolParentLeadId:undefined,
        createdOn: new Date(),
        daysOfInterest: undefined,
        programsOfInterest: undefined,
        tourQuestions: undefined
    }

    dateFormat = 'MM/dd/yyyy hh:mm';
    inPersonTourType = ToursEditorConstants.IN_PERSON_STATUS;
    //start Time field to bind time values
    startingTime: Date | undefined

    /**
     * Current available program of interest options + any add'l options that were part of lead record
     * but no longer in current options
     */
    leadProgramOfInterestOptions: Array<FeatureInterestOption>;

    /**
     * Current available program of interest options
     */
    programsOfInterestOptions: Array<FeatureInterestOption>;
    guides: TourGuideDto[];
    tourStatus: SelectListItem[] = [];
    tourTypes: SelectListItem[] = [];
    followUpTimeFrames: SelectListItem[] = [];
    enabledDates: Date[];

    constructor(
        injector: Injector,
        private _toursEditorService: ToursEditorService,
        private _leadsEditorService: LeadsApiClientFacade,
        private _featuresApi: FeaturesApiClientFacade,
        private _toursService: ToursApiClientFacade,
        private _dateTimeService: DateTimeService,
        private _dateUtils: DateTimeUtilsService
    ) {
        super(injector);
    }



    ngOnInit(): void {
        this.enabledDates = this._dateUtils.getDatesUpTo(ToursEditorConstants.MAX_ENABLED_CALENDAR_DATES);
        this.loadLeadSettings();

    }

    ngOnDestroy(): void {
        this.unsubscribeFromSubscriptionsAndHideSpinner();
    }



    saveLead(): void {
        this.spinnerService.show('content');
        this.close();
    }


    childrenNames(tour: TourItemDto): string {
        return this._toursEditorService.childrenNames(tour);
    }

    childrenAges(tour: TourItemDto): string {
        return this._toursEditorService.childrenAges(tour);
    }

    childAge(dateOfBirth?: DateTime): string | number {
        return this._dateTimeService.getAge(dateOfBirth);
    }

    open() {
        this.modal.show();
    }

    close() {
        this.modal.hide();
    }

    // Return to lead search
    backToLeadSearch() {
        this.close();
        this.back.emit(true)
    }

    showDiscardChangesModal(): void {
        if (this.pendingChanges()) {
            this.discardModal.show();
        } else {
            this.close();
        }
    }



    closeDiscardChangesModal() {
        this.discardModal.hide();
    }

    pendingChanges(): boolean {
        return (
            /*this.displayTourForm &&
            (JSON.stringify(tour) !== JSON.stringify(this.originalTour) ||
                JSON.stringify(this.lead) !== JSON.stringify(this.originalLead))*/
                false
        );
    }

    discardChanges() {

        this.closeDiscardChangesModal();
        this.close();
    }

    /**
     * Updates lead.programsOfInterest on PoI checkbox change
     * @param event
     */
    public onProgramOfInterestChanged(event: Event) {
        const input = event.target as HTMLInputElement;
        const value = input.value;
        if (this.programsOfInterestOptions?.some((x) => x.name.toLowerCase() === value.toLowerCase())) {
            if (input.checked) {
                this.safeAddSelectedProgramToLeadProgramsOfInterest(value);
            } else {
                this.lead.programsOfInterest = this.lead.programsOfInterest?.filter(
                    (x) => x.toLowerCase() !== value.toLowerCase()
                );
            }
        }
    }

    /**
     * validate and initialize lead's PoIs if it is undefined and
     * adds selected value to the PoIs of the current lead, if is not yet selected
     */
    private safeAddSelectedProgramToLeadProgramsOfInterest(value: string): void {
        if (!this.lead.programsOfInterest) {
            this.lead.programsOfInterest = [];
        }
        if (this.lead.programsOfInterest.some((x) => x.toLowerCase() === value.toLowerCase())) {
            return;
        }
        this.lead.programsOfInterest.push(value);
    }

    /**
     * Returns true if lead has program of interest selected
     * @param name
     * @returns
     */
    public isProgramOfInterestSelected(name: string) {
        const result = this.lead?.programsOfInterest?.some((x) => x.toLowerCase() == name.toLowerCase());
        return result;
    }

    /**
     * Loads program of interest options for current lead
     */
    private loadLeadProgramOfInterestOptions() {
        // Append any PoIs that were on lead record but may have been removed from
        // current available options

        // Find missing PoIs
        const missing = this.lead?.programsOfInterest?.filter((x) => {
            const result = !this.programsOfInterestOptions?.some((y) => y.name.toLowerCase() == x.toLowerCase());
            return result;
        });

        // Map PoIs to option type
        const missingOptions = missing?.map((name) => {
            return {
                name,
                displayName: name,
            };
        });

        // Append missing options to current options
        this.leadProgramOfInterestOptions = this.programsOfInterestOptions?.concat(
            missingOptions?.length ? missingOptions : []
        );
    }

    private loadLeadSettings() {
        this.addSubscription(
            this._featuresApi.getSchoolLeadProgramInterestOptions(this.appSession.school.crmId).subscribe((options) => {
                this.programsOfInterestOptions = options;
                this.loadLeadProgramOfInterestOptions();
            })
        );
    }


    public addChild():void {
        this.newLead.schoolChildLeads.push({
            firstName:"",
            dateOfBirth:new Date()
        });
    }


    public removeChild(i:number):void {
        this.newLead.schoolChildLeads.splice(i,1);
    }
}
