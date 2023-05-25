// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
    dev: true,
    production: false,
    hmr: false,
    sso: false,
    appConfig: 'appconfig.json',
    contentAPIBasePath: 'https://ipaas-qa-useast-apim.azure-api.net/content',
    featuresAPIBasePath: 'https://ipaas-qa-useast-apim.azure-api.net/schoolfeatures',
    facultyAPIBasePath: 'https://ipaas-qa-useast-apim.azure-api.net/faculty',
    testimonialsAPIBasePath: 'https://ipaas-qa-useast-apim.azure-api.net/testimonials',
    careersAPIBasePath: 'https://ipaas-qa-useast-apim.azure-api.net/careers',
    schoolEventsAPIBasePath: 'https://ipaas-qa-useast-apim.azure-api.net/schoolevents',
    APIM_KEY: 'd47006219e88418da84b2d3984054454',
    schoolBaseSiteUrl: 'https://www-stage.goddardschool.com',
    authorBaseSiteUrl: 'https://author-p24717-e85656.adobeaemcloud.com',
    // Overrides APIM_KEY for calls to the FBP API
    // Only needs to be specified key when accessing FBP API in a different environment from other iPaaS APIs (ex. DEV)
    FBP_APIM_KEY: '',
    userGuideLink:
        'https://goddardsystems.sharepoint.com/:b:/r/sites/covid19/Shared%20Documents/Marketing/iGoddard_UserGuide.pdf?csf=1&web=1&e=EdR44R'
};
