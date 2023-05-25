import { Attribute, Directive, forwardRef } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';
//Got from: https://scotch.io/tutorials/how-to-implement-a-custom-validator-directive-confirm-password-in-angular-2
@Directive({
    selector:
        '[validateTimeGreaterThan][formControlName],[validateTimeGreaterThan][formControl],[validateTimeGreaterThan][ngModel]',
    providers: [{ provide: NG_VALIDATORS, useExisting: forwardRef(() => GreaterThanTimeValidator), multi: true }],
})
export class GreaterThanTimeValidator implements Validator {
    constructor(
        @Attribute('validateTimeGreaterThan') public validateTimeGreaterThan: string,
        @Attribute('reverse') public reverse: string,
        @Attribute('skipValidation') public skipValidation: string
    ) {}
    private get isReverse() {
        if (!this.reverse) {
            return false;
        }
        return this.reverse === 'true';
    }
    private get isSkipValidation() {
        if (!this.skipValidation) {
            return false;
        }
        return this.skipValidation === 'true';
    }
    validate(control: AbstractControl): { [key: string]: any } {
        const pairControl = control.root.get(this.validateTimeGreaterThan);

        if (this.isSkipValidation) {
            return null;
        }
        if (!pairControl) {
            return null;
        }

        const value = control.value;
        const pairValue = pairControl.value;

        if (!value && !pairValue) {
            this.deleteErrors(pairControl);
            return null;
        }

        if (this.isReverse) {
            if (this.validateDates(value, pairValue)) {
                this.deleteErrors(pairControl);
            } else {
                pairControl.setErrors({ validateTimeGreaterThan: true });
            }
            return null;
        } else {
            if (this.validateDates(value, pairValue)) {
                return {
                    validateTimeGreaterThan: true,
                };
            }
        }
    }

    deleteErrors(control: AbstractControl) {
        if (control.errors) {
            delete control.errors['validateTimeGreaterThan'];
        }
        if (control.errors && !Object.keys(control.errors).length) {
            control.setErrors(null);
        }
    }

    validateDates(sDate: string, eDate: string): boolean {
        if (sDate == null || eDate == null) {
            return false;
        }

        let startDate = new Date(sDate);
        let endDate = new Date(eDate);

        let startingTime = new Date(new Date().setUTCHours(startDate.getHours(), startDate.getMinutes(), 0, 0));
        let endingTime = new Date(new Date().setUTCHours(endDate.getHours(), endDate.getMinutes(), 0, 0));

        return endingTime.getTime() >= startingTime.getTime();
    }

    getMinutes(date: Date): number {
        return date.getMinutes() + date.getHours() * 60;
    }
}
