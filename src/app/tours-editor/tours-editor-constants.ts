import { min } from 'lodash-es';

export class ToursEditorConstants {
    public static MANAGE_TOURS_PAGE_URL = '/app/tours-editor/manage-tours';
    public static MAX_LEADS_RETURNED = 10;
    public static COMPLETED_TOURS_PAGE_URL = '/app/tours-editor/edit-completed-tours';
    public static TOURS_AVAILABILITY_PAGE_URL = '/app/tours-editor/edit-tours-availability';
    public static MAX_ENABLED_CALENDAR_DATES = 730;
    public static NEW_TOURS_HOURS_DIFFERENCE = 48;
    public static ACTIVE_TOUR_STATUS = ['Scheduled', 'No Show'];
    public static NOT_YET_IMPLEMENTED = 'NOT YET IMPLEMENTED';
    public static IN_PERSON_STATUS = 'InPerson';
    public static SCHEDULED_TYPE = 'Scheduled';
    public static ALL_WEEK: string = 'All Week';
    public static DATE_FORMAT = 'MM/DD/YYYY';
    public static TOURS_SCHEDULE_FILTERS = 'Tours_Schedule_Filter';
}
