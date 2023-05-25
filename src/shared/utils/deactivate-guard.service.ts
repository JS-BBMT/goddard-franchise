import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

export interface IDeactivateComponent {
    canExit: () => Observable<boolean> | Promise<boolean> | boolean;
}

//credits from: https://www.developer.com/languages/javascript/preventing-data-loss-in-angular-applications-using-a-candeactivate-route-guard/
@Injectable({
    providedIn: 'root',
})
export class DeactivateGuardService implements CanDeactivate<IDeactivateComponent> {
    public canDeactivate(component: IDeactivateComponent): Observable<boolean> | Promise<boolean> | boolean {
        return component.canExit ? component.canExit() : true;
    }
}
