import { TestBed } from '@angular/core/testing';
import { DateTime } from 'luxon';
import { AppLocalizationService } from '../localization/app-localization.service';
import { DateTimeService } from './date-time.service';

describe('DateTimeService', () => {
    let dateTimeService: DateTimeService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                DateTimeService,
                {
                    provide: AppLocalizationService,
                    useValue: jasmine.createSpyObj('AppLocalizationService', ['l', 'ls']),
                },
            ],
        });

        dateTimeService = TestBed.inject(DateTimeService);
    });

    it('#getAge should return "1 Month" when age is under 40 Days old', () => {
        const date = DateTime.local().plus({ days: -40 }); //create date
        const age = dateTimeService.getAge(date).toString();
        expect(age === '1 Month').toBeTruthy();
    });

    it('#getAge should include "Months" when age is older that 1 month but younger that 1 year', () => {
        const date = DateTime.local().plus({ months: -11 }); //create date
        const age = dateTimeService.getAge(date).toString();
        expect(age.includes('Months')).toBeTruthy();
    });

    it('#getAge should return "1 Year" when age is 13 months old', () => {
        const date = DateTime.local().plus({ months: -13 }); //create date
        const age = dateTimeService.getAge(date).toString();
        expect(age === '1 Year').toBeTruthy();
    });

    it('#getAge should return "years" when a child is less than 24 months old', () => {
        const date = DateTime.local().plus({ months: -23 }); //create date
        const age = dateTimeService.getAge(date).toString();
        expect(age === '1 Year').toBeTruthy();
    });

    it('#getAge should return "years" when a child is at months old', () => {
        const date = DateTime.local().plus({ months: -24 }); //create date
        const age = dateTimeService.getAge(date).toString();
        expect(age === '2 Years').toBeTruthy();
    });
});
