import { TourStatus, TourType } from '@shared/service-proxies/service-proxies';
import { DateTime } from 'luxon';

export interface IFindToursInput {
    schoolId: string;
    status?: TourStatus | undefined;
    startDate?: DateTime | undefined;
    endDate?: DateTime | undefined;
    type?: TourType | undefined;
    guideName?: string | undefined;
    leadName?: string | undefined;
    childAge?: number | undefined;
    leadStartDate?: DateTime | undefined;
    leadEndDate?: DateTime | undefined;
    programsOfInterest?: string[] | undefined;

    tourRangeDatesSelected?: boolean;
    filterByTourStartDateOption?: string;

    preferredRangeDatesSelected?: boolean;
    filterByPreferredStartDateOption?: string;
}

export class FindToursInput implements IFindToursInput {
    schoolId: string;
    status?: TourStatus | undefined;
    startDate?: DateTime | undefined;
    endDate?: DateTime | undefined;
    type?: TourType | undefined;
    guideName?: string | undefined;
    leadName?: string | undefined;
    childAge?: number | undefined;
    leadStartDate?: DateTime | undefined;
    leadEndDate?: DateTime | undefined;
    programsOfInterest?: string[] | undefined;

    tourRangeDatesSelected?: boolean;
    filterByTourStartDateOption?: string;

    preferredRangeDatesSelected?: boolean;
    filterByPreferredStartDateOption?: string;

    constructor(data?: IFindToursInput) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property)) (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    static fromJS(data: any): FindToursInput {
        data = typeof data === 'object' ? data : {};
        let result = new FindToursInput(data);
        return result;
    }

    static default(schoolId: string): FindToursInput {
        return this.fromJS({ schoolId: schoolId, status: TourStatus.Scheduled });
    }
}
