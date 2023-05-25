import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Angulartics2RouterlessModule } from 'angulartics2/routerlessmodule';
import { EditCompletedToursComponent } from './edit-completed-tours.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { SessionServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppUiCustomizationService } from '@shared/common/ui/app-ui-customization.service';
import { AppLocalizationService } from '@app/shared/common/localization/app-localization.service';
import { ToursEditorService } from '../services/tours-editor.service';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { AppUrlService } from '@shared/common/nav/app-url.service';
import { LocalizePipe } from '@shared/common/pipes';
import { AppNavigationService } from '@app/shared/layout/nav/app-navigation.service';

describe('EditCompletedToursComponent', () => {
    let component: EditCompletedToursComponent;
    let fixture: ComponentFixture<EditCompletedToursComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditCompletedToursComponent, LocalizePipe],
            imports: [Angulartics2RouterlessModule.forRoot(), HttpClientTestingModule],
            providers: [
                AppSessionService,
                SessionServiceProxy,
                AppUiCustomizationService,
                AppLocalizationService,
                AppUrlService,
                ToursEditorService,
                DateTimeService,
                AppNavigationService,
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditCompletedToursComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
