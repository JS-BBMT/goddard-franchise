import { Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Angulartics2 } from 'angulartics2';
import { Career } from '@app/shared/common/apis/generated/careers';
import { CareersApiClientFacade } from '@shared/service-proxies/careers-api-client-facade';
import { finalize } from 'rxjs/operators';
import { SiteEditorService } from '@app/site-editor/services';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Career as FbpCareer } from '../../../shared/service-proxies/service-proxies';
import { DateTime } from 'luxon';
import { AppAnalyticsService } from '@shared/common/analytics/app-analytics.service';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { Table } from 'primeng/table';
import { AppConsts } from '@shared/AppConsts';

@Component({
    selector: 'app-edit-careers',
    templateUrl: './edit-careers.component.html',
    styleUrls: ['./edit-careers.component.css'],
})
export class EditCareersComponent extends AppComponentBase implements OnInit, OnDestroy {
    careers: Career[] = [];
    readonly maxDescriptionLength = 100; //Limit for showing description
    @ViewChild('dataTable') dataTable: Table;
    tooltips = AppConsts.TOOLTIPS;

    constructor(
        injector: Injector,
        private _careersClientFacade: CareersApiClientFacade,
        private _siteEditorService: SiteEditorService,
        private _angulartics2: Angulartics2,
        private _appSessionService: AppSessionService
    ) {
        super(injector);
    }

    ngOnInit(): void {
        if (!this.validateSchoolIsAssigned()) {
            return;
        }

        this.getCareers();
    }

    ngOnDestroy(): void {
        this.unsubscribeFromSubscriptionsAndHideSpinner();
    }

    getCareers() {
        this.spinnerService.show('content');

        this.addSubscription(
            this._careersClientFacade
                .getSchoolCareers(this.appSession.school.crmId)
                .pipe(finalize(() => this.spinnerService.hide('content')))
                .subscribe(
                    (response) => {
                        this.careers = response;
                        this.dataTable.sortField = 'position';
                        this.dataTable.sortOrder = 1;
                        this.dataTable.sortSingle();
                    },
                    (error) => {
                        console.log(error);
                        abp.message.error(this.l('Error_Update_Msg'), this.l('Error_Update_Title'));
                    }
                )
        );
    }

    onDeleteCareer(id: number): void {
        const career = this.careers.find((x) => x.id === id);
        abp.message.confirm('', this.l('CareerDeleteWarningMessage'), (result: boolean) => {
            if (result) {
                this.deleteCareer(id);
            }
        });
    }

    deleteCareer(id: number): void {
        this.spinnerService.show('content');
        this._careersClientFacade
            .deleteCareer(id)
            .pipe(finalize(() => this.spinnerService.hide('content')))
            .subscribe(
                (response) => {
                    // analytics
                    this._angulartics2.eventTrack.next({
                        action: 'Careers Delete',
                        properties: {
                            category: AppAnalyticsService.CONSTANTS.SITE_EDITOR.PUBLISH_CHANGES,
                            label: this._appSessionService.school?.advertisingName,
                        },
                    });

                    abp.message.success(this.l('Success_Update_Msg'), this.l('Success_Update_Title')).then(() => {
                        this.careers = this.careers.filter((x) => x.id !== id);
                    });
                },
                (error) => {
                    console.log(error);
                    abp.message.error(this.l('ErrorSavingData'), this.l('Error'));
                }
            );
    }

    openModal(id: number | undefined) {
        let fbpCareer = FbpCareer.fromJS({ isActive: true, publishDate: DateTime.local() });
        if (id !== undefined) {
            fbpCareer = FbpCareer.fromJS({ ...this.careers.find((x) => x.id === id) });
        }
        this._siteEditorService.setCurrentCareer(fbpCareer);
    }

    onSaveCareer(isSuccess: boolean): void {
        // analytics
        this._angulartics2.eventTrack.next({
            action: 'Careers Publish',
            properties: {
                category: AppAnalyticsService.CONSTANTS.SITE_EDITOR.PUBLISH_CHANGES,
                label: this._appSessionService.school?.advertisingName,
            },
        });

        abp.message.success(this.l('Success_Update_Msg'), this.l('Success_Update_Title')).then(() => {
            this.getCareers();
        });
    }
}
