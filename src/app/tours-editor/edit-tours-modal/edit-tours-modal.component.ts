import { ToursEditorConstants } from '@app/tours-editor/tours-editor-constants';
import {
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
import { AutoComplete } from 'primeng/autocomplete';

@Component({
    selector: 'edit-tours-modal',
    templateUrl: './edit-tours-modal.component.html',
    styleUrls: ['./edit-tours-modal.component.css'],
    animations: [appModuleAnimation()],
})
export class EditToursModalComponent extends AppComponentBase implements OnInit, OnDestroy {
    @Output() save: EventEmitter<TourItemDto> = new EventEmitter<TourItemDto>();
    @Output() createLead: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('TourModal', { static: true }) modal: ModalDirective;
    @ViewChild('discardChangesModal', { static: true }) discardModal: ModalDirective;
    @ViewChild('searchTourLeadWrapper', { static: true }) searchTourLeadWrapper: ElementRef;
    @ViewChild('tourFormWrapper', { static: true }) tourFormWrapper: ElementRef;
    @ViewChild('acInput') private ac: AutoComplete;

    lead: LeadDto;
    tour: TourItemDto;
    originalLead: LeadDto;
    originalTour: TourItemDto;

    inputText: string;
    lastSearchQuery: string = '';
    leadListingsResults: LeadDto[];
    dateFormat = 'MM/dd/yyyy hh:mm';
    inPersonTourType = ToursEditorConstants.IN_PERSON_STATUS;
    //start Time field to bind time values
    startingTime: Date | undefined;
    NOT_YET_IMPLEMENTED: string = ToursEditorConstants.NOT_YET_IMPLEMENTED;
    /*
        will display tour form when:
        1- user is an updating an existing tour
        2- user selects a Lead and is creating a new Tour or
        3- when user selects to create a new Lead (With Tour)
    */
    displayTourForm: boolean = false;

    /**
     * Current available program of interest options + any add'l options that were part of lead record
     * but no longer in current options
     */
    leadProgramOfInterestOptions: Array<FeatureInterestOption>;

    /**
     * To cancel the last search in the search form
     */
    lastSearchSubscription: Subscription;

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

    subscribeToCurrentTour(): Subscription {
        return this._toursEditorService.$currentTourSubject.subscribe((tour) => {
            this.tour = tour;
            if (tour.id === this.NOT_YET_IMPLEMENTED) {
                this.displayInfo(this.l(this.NOT_YET_IMPLEMENTED));
                return;
            }

            this.open();

            this.displayTourForm = this.tour.id !== undefined;
        });
    }

    ngOnInit(): void {
        this.enabledDates = this._dateUtils.getDatesUpTo(ToursEditorConstants.MAX_ENABLED_CALENDAR_DATES);

        this.loadTourSettingsFromEnums();

        this.addSubscription(this.subscribeToCurrentTour());

        this.loadToursSettings();
    }

    ngOnDestroy(): void {
        this.unsubscribeFromSubscriptionsAndHideSpinner();
        if (this.lastSearchSubscription) {
            this.lastSearchSubscription.unsubscribe();
        }
    }

    clearInput(): void {
        this.inputText = '';
    }

    loadTourSettingsFromEnums() {
        let status = Object.values(TourStatus);
        for (let index = 0; index < status.length; index++) {
            if (status[index] === TourStatus.Completed || status[index] === TourStatus.Scheduled) {
                this.tourStatus.push({ text: camelCaseToDisplayName(status[index]), value: status[index] });
            }
        }

        let types = Object.values(TourType);
        for (let index = 0; index < types.length; index++) {
            this.tourTypes.push({
                text: camelCaseToDisplayName(types[index]).replace(TourType.Online, `Live ${TourType.Online}`),
                value: types[index],
                imgPath:
                    types[index] === TourType.Online
                        ? '/assets/common/images/icons/gsi_online.png'
                        : '/assets/common/images/icons/gsi_school.png',
            });
        }

        let timeFrames = Object.values(FollowUpTimeFrame);
        for (let index = 0; index < timeFrames.length; index++) {
            this.followUpTimeFrames.push({
                text: camelCaseToDisplayName(timeFrames[index]).replace('Six', `6 `).replace('Twelve', `12 `),
                value: timeFrames[index],
            });
        }
    }

    searchLeads(event) {
        this.lastSearchQuery = event.query;

        if (this.lastSearchSubscription) {
            this.lastSearchSubscription.unsubscribe();
        }
        this.lastSearchSubscription = this._leadsEditorService
            .findLeads(event.query,
                       this.appSession.school.crmId,
                       undefined,
                       undefined,
                       undefined,
                       undefined,
                       undefined,
                       1,
                       ToursEditorConstants.MAX_LEADS_RETURNED)
            .subscribe((response) => {
                this.leadListingsResults = response;
            }, this.displayError);
    }

    onFocusAc(ac: AutoComplete) {
        this.ac = ac;
    }

    setInputText() {
        this.inputText = this.lastSearchQuery;
        this.updateAc();
    }

    updateAc() {
        const suggestions = [...this.leadListingsResults];
        this.leadListingsResults = [];

        setTimeout(() => {
            this.leadListingsResults = [...suggestions];
            this.ac.focusInput();
            this.ac.show();
        }, 0);
    }

    saveTour(): void {
        let createTourInput = this.getCreateTourData();

        this.spinnerService.show('content');
        //Save the tour
        this._toursService
            .createTour(createTourInput)
            .pipe(finalize(() => this.spinnerService.hide('content')))
            .subscribe(
                (response) => {
                    this.save.emit(this.tour);
                },
                (error) => {
                    abp.message.error(this.l('ErrorSavingData'), this.l('Error'));
                }
            );
        this.close();
    }

    getCreateTourData(): CreateTourInput {
        const tour = CreateTourInput.fromJS({
            ...this.getConvertedTour(),
            schoolId: this.appSession.school.crmId,
            guideId: this.guides.find((p) => this.tour.guide.name).id,
            lead: CreateLeadInput.fromJS({ ...this.lead }),
        });
        return tour;
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
        this.clearInput();
        this.modal.show();
    }

    close() {
        this.modal.hide();
    }

    openNewLeadModal() {
        this.modal.hide();
        this.createLead.emit(true);
    }

    // Return to lead search
    back() {
        this.displayTourForm = false;
        this.tour = null;
        this.lead = null;
        this.setInputText();
    }

    showDiscardChangesModal(): void {
        if (this.pendingChanges()) {
            this.discardModal.show();
        } else {
            this.close();
        }
    }

    selectLeadAndShowTourForm(lead: LeadDto) {
        this.displayTourForm = true;

        this.tour = TourItemDto.fromJS({
            ...this.getDefaultTourData(),
            lead: TourItemLeadDto.fromJS({ ...lead }),
        });

        this.lead = lead;
        this.setOriginalModalData();
        this.loadLeadProgramOfInterestOptions();
    }

    closeDiscardChangesModal() {
        this.discardModal.hide();
    }

    pendingChanges(): boolean {
        const tour = this.getConvertedTour();
        return (
            this.displayTourForm &&
            (JSON.stringify(tour) !== JSON.stringify(this.originalTour) ||
                JSON.stringify(this.lead) !== JSON.stringify(this.originalLead))
        );
    }

    discardChanges() {
        //Reset current Tour to its original values
        this.lead = LeadDto.fromJS({ ...this.originalLead });
        this.tour = TourItemDto.fromJS({ ...this.originalTour });

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
        const missing = this.lead.programsOfInterest?.filter((x) => {
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

    private loadToursSettings() {
        this.addSubscription(
            this._featuresApi.getSchoolLeadProgramInterestOptions(this.appSession.school.crmId).subscribe((options) => {
                this.programsOfInterestOptions = options;
            })
        );

        this.addSubscription(
            combineLatest([
                this._toursService.getSchoolGuides(this.appSession.school.crmId),
                this._featuresApi.getSchoolLeadProgramInterestOptions(this.appSession.school.crmId),
            ])
                .pipe(finalize(() => this.spinnerService.hide('content')))
                .subscribe(
                    ([guides, options]) => {
                        this.guides = guides;
                        this.programsOfInterestOptions = options;
                    },
                    (error) => {
                        abp.message.error(this.l('AnErrorOccurred'), this.l('Error'));
                    }
                )
        );
    }

    onTourGuideChanged(guideName: string) {
        this.tour.guide = TourGuideDto.fromJS({ name: guideName });
    }

    private setOriginalModalData() {
        this.originalLead = LeadDto.fromJS({ ...this.lead });
        this.originalTour = TourItemDto.fromJS({ ...this.tour });
        if (this.tour.scheduledDateTime) {
            this.startingTime = this._dateUtils.convertUTCToLocalDate(this.tour.scheduledDateTime?.toJSDate());
        }
    }

    getDefaultTourData(): TourItemDto {
        //Add 1 day and set the hour from the school business hour
        this.startingTime = new Date(`${new Date().toLocaleDateString()} ${this.appSession.schoolStartBusinessHour}`);
        this.startingTime.setHours(this.startingTime.getHours() + 1); //add 1 hour
        this.startingTime = this._dateUtils.convertLocalDateToUTC(this.startingTime);

        const guide = this.guides?.length ? TourGuideDto.fromJS({ name: this.guides[0].name }) : undefined;

        return TourItemDto.fromJS({
            type: this.inPersonTourType,
            status: ToursEditorConstants.SCHEDULED_TYPE,
            scheduledDateTime: DateTime.fromJSDate(this.startingTime).plus({ days: 1 }), //add 1 day
            guide: guide,
        });
    }

    getConvertedTour(): TourItemDto {
        let tour = TourItemDto.fromJS({ ...this.tour });
        if (!tour.scheduledDateTime) {
            return tour;
        }

        const startDate = new Date(tour.scheduledDateTime?.toJSDate()).toLocaleDateString();

        //tour.scheduledDateTime.set({hour: this.startingTime.getHours(), minute: this.startingTime.getMinutes()});

        tour.scheduledDateTime = DateTime.fromJSDate(
            this._dateUtils.convertLocalDateToUTC(
                new Date(`${startDate} ${this.startingTime.getHours()}:${this.startingTime.getMinutes()}`)
            )
        );

        return tour;
    }
}
