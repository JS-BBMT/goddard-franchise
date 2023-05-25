import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'app-mailto-link',
    templateUrl: './mailto-link.component.html',
    styleUrls: ['./mailto-link.component.css'],
})
export class MailtoLinkComponent extends AppComponentBase implements OnInit {
    @Input() requestSubject: string;
    @Input() linkText: string;
    @Input() mailto: string;

    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {}
}
