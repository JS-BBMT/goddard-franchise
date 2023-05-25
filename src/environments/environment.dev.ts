import { tokenizedOrDefault } from './tokenized-or-default';

// DEV environment configuration

export const environment = {
    dev: true,
    production: false,
    hmr: false,
    sso: true,
    appConfig: 'appconfig.dev.json',
    contentAPIBasePath: tokenizedOrDefault(
        '#{{CONTENT_API_BASE_PATH}}#',
        'https://ipaas-qa-useast-apim.azure-api.net/content'
    ),
    featuresAPIBasePath: tokenizedOrDefault(
        '#{{FEATURES_API_BASE_PATH}}#',
        'https://ipaas-qa-useast-apim.azure-api.net/schoolfeatures'
    ),
    facultyAPIBasePath: tokenizedOrDefault(
        '#{{FACULTY_API_BASE_PATH}}#',
        'https://ipaas-qa-useast-apim.azure-api.net/faculty'
    ),
    testimonialsAPIBasePath: tokenizedOrDefault(
        '#{{TESTIMONIALS_API_BASE_PATH}}#',
        'https://ipaas-qa-useast-apim.azure-api.net/testimonials'
    ),
    careersAPIBasePath: tokenizedOrDefault(
        '#{{CAREERS_API_BASE_PATH}}#',
        'https://ipaas-qa-useast-apim.azure-api.net/careers'
    ),
    schoolEventsAPIBasePath: tokenizedOrDefault(
        '#{{SCHOOL_EVENTS_API_BASE_PATH}}#',
        'https://ipaas-qa-useast-apim.azure-api.net/schoolevents'
    ),
    APIM_KEY: tokenizedOrDefault('#{{APIM_KEY}}#', 'd47006219e88418da84b2d3984054454'),
    schoolBaseSiteUrl: tokenizedOrDefault('#{{SCHOOL_BASE_SITE_URL}}#', 'https://www-qa.goddardschool.com'),
    authorBaseSiteUrl: tokenizedOrDefault(
        '#{{AEM_AUTHOR_BASE_SITE_URL}}#',
        'https://author-p24717-e553107.adobeaemcloud.com'
    ),
    // In DEV we access the DEV FBP API so need to specify an override over the APIM_KEY which will have the QA APIM key value
    FBP_APIM_KEY: tokenizedOrDefault('#{{FBP_APIM_KEY}}#', 'c618970deacb4567a44a6b7b27620a9e'),
    userGuideLink:
        'https://goddardsystems.sharepoint.com/:b:/r/sites/covid19/Shared%20Documents/Marketing/iGoddard_UserGuide.pdf?csf=1&web=1&e=EdR44R'
};
