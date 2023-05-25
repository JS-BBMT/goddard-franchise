import { NgModule } from '@angular/core';
import { ToursEditorRoutingModule } from './tours-editor-routing.module';

import { CommonModule } from '@angular/common';
import { AppBsModalModule } from '@shared/common/appBsModal/app-bs-modal.module';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { UtilsModule } from '@shared/utils/utils.module';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { ManageToursComponent } from './manage-tours/manage-tours.component';
import { EditCompletedToursComponent } from './edit-completed-tours/edit-completed-tours.component';
import { EditToursAvailabilityComponent } from './edit-tours-availability/edit-tours-availability.component';
import { EditToursModalComponent } from './edit-tours-modal/edit-tours-modal.component';
import { FilterToursModalComponent } from './filter-tours-modal/filter-tours-modal.component';
import { NewLeadModalComponent } from './new-lead-modal/new-lead-modal.component';
@NgModule({
    imports: [
        AppSharedModule,
        CommonModule,
        AppBsModalModule,
        UtilsModule,
        ToursEditorRoutingModule,
        TimepickerModule.forRoot(),
    ],
    declarations: [
        ManageToursComponent,
        EditCompletedToursComponent,
        EditToursAvailabilityComponent,
        EditToursModalComponent,
        FilterToursModalComponent,
        NewLeadModalComponent
    ],
    providers: [],
    exports: [],
})
export class ToursEditorModule {}
