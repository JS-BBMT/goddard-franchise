import { Component, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'edit-events',
    templateUrl: './edit-events.component.html',
    styleUrls: ['./edit-events.component.css'],
    animations: [appModuleAnimation()],
})
export class EditEventsComponent extends AppComponentBase implements OnInit {

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    ngOnInit(): void {
    }
}
