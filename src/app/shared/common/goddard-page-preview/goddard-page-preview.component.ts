import {
    Component,
    Injector,
    Input,
    Output,
    OnInit,
    ElementRef,
    ViewChild,
    Renderer2,
    EventEmitter,
    OnDestroy,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AppComponentBase } from '@shared/common/app-component-base';
import { NgxSpinnerService } from 'ngx-spinner';
import { v4 as uuidv4 } from 'uuid';
import { finalize } from 'rxjs/operators';
import { IframeService } from '../services/iframe-service';
import { Observable } from 'rxjs';
import { GetSitePageOutput } from '@shared/service-proxies/service-proxies';

@Component({
    selector: 'goddard-page-preview',
    templateUrl: './goddard-page-preview.component.html',
    styleUrls: ['./goddard-page-preview.component.css'],
})
export class GoddardPagePreviewComponent extends AppComponentBase implements OnInit, OnDestroy {
    @Input() pageId: string;
    @Input() editorTriggers;
    @Input() disableAnchors: boolean = true;
    @Output() iframeIsResized = new EventEmitter<boolean>();
    @ViewChild('iframe', { static: false }) iframe: ElementRef;
    data: SafeHtml | undefined = undefined;
    frameContent;
    frameCurrentHeight: number;
    isIframeLoaded = false;
    pollingInterval = 1; // polling interval in seconds

    constructor(
        injector: Injector,
        public _sanitizer: DomSanitizer,
        public renderer: Renderer2,
        public iframeService: IframeService,
        public spinner: NgxSpinnerService
    ) {
        super(injector);
    }

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this.unsubscribeFromSubscriptionsAndHideSpinner();
    }

    loadPagePreview(getPageObservable: () => Observable<GetSitePageOutput>, successCallback: (result) => void): void {
        this.spinner.show('content');
        this.addSubscription(
            getPageObservable()
                .pipe(finalize(() => this.spinner.hide('content')))
                .subscribe(successCallback)
        );
    }

    onSuccessLoadingPage(result: GetSitePageOutput): void {
        if (!result || !result.pageHTML) {
            return;
        }
        this.data = this._sanitizer.bypassSecurityTrustHtml(result.pageHTML);

        this.iframeService.setCurrentIframe(this.iframe);

        // 20220429RBP - FIX: Moved this call from ngOnInit to here
        // to fix issue when we are reloading the iframe srcDoc
        // because the load event doesn't seem to fire on srcDoc changes
        this.runIsFrameLoadedTimer();
    }

    // Will poll the page at the polling interval and check to see if our frame has been loaded
    runIsFrameLoadedTimer() {
        this.iframeService.runIsFrameLoadedTimer(this.iframe, () => {
            this.resizeFrame();
            this.hideMainSpinner();
        });
    }

    resizeFrame() {
        if (this.iframeService.resizeFrame(this.iframe, this.renderer, this.disableAnchors)) {
            this.iframeIsResized.emit(true);
            this.removeContent();
            if (!this.disableAnchors) {
                this.iframeService.modifyInternalAnchors(this.iframe, this.renderer);
            }
        }
    }

    removeContent() {
        //remove common content
        this.iframeService.removeContent(this.iframe, this.renderer);

        //remove content from school's home page
        const content: Element = this.iframe.nativeElement.contentDocument || this.iframe.nativeElement.contentWindow;

        // Adjust Body paging
        const body: Element =
            content.querySelectorAll('.school-home-page')[0] || content.querySelectorAll('.school-content-page')[0];
        body?.classList.add('pt-0');
    }

    getEditingItemInfo(identifer: string) {
        const content = this.iframe.nativeElement.contentDocument || this.iframe.nativeElement.contentWindow;
        let elements = content.querySelectorAll(identifer);
        return elements;
    }
}
