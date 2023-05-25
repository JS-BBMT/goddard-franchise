/**
 * Goddard School Features API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: v1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent, HttpParameterCodec }       from '@angular/common/http';
import { CustomHttpParameterCodec }                          from '../encoder';
import { Observable }                                        from 'rxjs';

import { AddFeatureModel } from '../model/models';
import { AddSchoolFeatureByAlternateIdModel } from '../model/models';
import { AddSchoolFeatureModel } from '../model/models';
import { DeleteSchoolFeatureModel } from '../model/models';
import { Feature } from '../model/models';
import { FeatureInterestOption } from '../model/models';
import { SchoolFeature } from '../model/models';
import { SchoolFeaturesModel } from '../model/models';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';



@Injectable({
  providedIn: 'root'
})
export class FeaturesService {

    protected basePath = 'http://localhost';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();
    public encoder: HttpParameterCodec;

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (configuration) {
            this.configuration = configuration;
        }
        if (typeof this.configuration.basePath !== 'string') {
            if (typeof basePath !== 'string') {
                basePath = this.basePath;
            }
            this.configuration.basePath = basePath;
        }
        this.encoder = this.configuration.encoder || new CustomHttpParameterCodec();
    }


    private addToHttpParams(httpParams: HttpParams, value: any, key?: string): HttpParams {
        if (typeof value === "object" && value instanceof Date === false) {
            httpParams = this.addToHttpParamsRecursive(httpParams, value);
        } else {
            httpParams = this.addToHttpParamsRecursive(httpParams, value, key);
        }
        return httpParams;
    }

    private addToHttpParamsRecursive(httpParams: HttpParams, value?: any, key?: string): HttpParams {
        if (value == null) {
            return httpParams;
        }

        if (typeof value === "object") {
            if (Array.isArray(value)) {
                (value as any[]).forEach( elem => httpParams = this.addToHttpParamsRecursive(httpParams, elem, key));
            } else if (value instanceof Date) {
                if (key != null) {
                    httpParams = httpParams.append(key,
                        (value as Date).toISOString().substr(0, 10));
                } else {
                   throw Error("key may not be null if value is Date");
                }
            } else {
                Object.keys(value).forEach( k => httpParams = this.addToHttpParamsRecursive(
                    httpParams, value[k], key != null ? `${key}.${k}` : k));
            }
        } else if (key != null) {
            httpParams = httpParams.append(key, value);
        } else {
            throw Error("key may not be null if value is not object or array");
        }
        return httpParams;
    }

    /**
     * @param addFeatureModel 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public apiV1FeaturePost(addFeatureModel?: AddFeatureModel, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<SchoolFeature>;
    public apiV1FeaturePost(addFeatureModel?: AddFeatureModel, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<HttpResponse<SchoolFeature>>;
    public apiV1FeaturePost(addFeatureModel?: AddFeatureModel, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<HttpEvent<SchoolFeature>>;
    public apiV1FeaturePost(addFeatureModel?: AddFeatureModel, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<any> {

        let headers = this.defaultHeaders;

        let credential: string | undefined;
        // authentication (ApiKeyAuth) required
        credential = this.configuration.lookupCredential('ApiKeyAuth');
        if (credential) {
            headers = headers.set('Ocp-Apim-Subscription-Key', credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'text/plain',
                'application/json',
                'text/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json',
            'text/json',
            'application/_*+json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.post<SchoolFeature>(`${this.configuration.basePath}/api/v1/feature`,
            addFeatureModel,
            {
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Returns all Features that exists.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public apiV1FeaturesGet(observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<Array<Feature>>;
    public apiV1FeaturesGet(observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<HttpResponse<Array<Feature>>>;
    public apiV1FeaturesGet(observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<HttpEvent<Array<Feature>>>;
    public apiV1FeaturesGet(observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<any> {

        let headers = this.defaultHeaders;

        let credential: string | undefined;
        // authentication (ApiKeyAuth) required
        credential = this.configuration.lookupCredential('ApiKeyAuth');
        if (credential) {
            headers = headers.set('Ocp-Apim-Subscription-Key', credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'text/plain',
                'application/json',
                'text/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.get<Array<Feature>>(`${this.configuration.basePath}/api/v1/features`,
            {
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * @param addSchoolFeatureModel 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public apiV1SchoolFeaturePost(addSchoolFeatureModel?: AddSchoolFeatureModel, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<SchoolFeaturesModel>;
    public apiV1SchoolFeaturePost(addSchoolFeatureModel?: AddSchoolFeatureModel, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<HttpResponse<SchoolFeaturesModel>>;
    public apiV1SchoolFeaturePost(addSchoolFeatureModel?: AddSchoolFeatureModel, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<HttpEvent<SchoolFeaturesModel>>;
    public apiV1SchoolFeaturePost(addSchoolFeatureModel?: AddSchoolFeatureModel, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<any> {

        let headers = this.defaultHeaders;

        let credential: string | undefined;
        // authentication (ApiKeyAuth) required
        credential = this.configuration.lookupCredential('ApiKeyAuth');
        if (credential) {
            headers = headers.set('Ocp-Apim-Subscription-Key', credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'text/plain',
                'application/json',
                'text/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json',
            'text/json',
            'application/_*+json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.post<SchoolFeaturesModel>(`${this.configuration.basePath}/api/v1/school-feature`,
            addSchoolFeatureModel,
            {
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Returns Features assigned to schools
     * @param crmSchoolIds 
     * @param features 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public apiV1SchoolFeaturesGet(crmSchoolIds?: Array<string>, features?: Array<string>, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<Array<SchoolFeature>>;
    public apiV1SchoolFeaturesGet(crmSchoolIds?: Array<string>, features?: Array<string>, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<HttpResponse<Array<SchoolFeature>>>;
    public apiV1SchoolFeaturesGet(crmSchoolIds?: Array<string>, features?: Array<string>, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<HttpEvent<Array<SchoolFeature>>>;
    public apiV1SchoolFeaturesGet(crmSchoolIds?: Array<string>, features?: Array<string>, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<any> {

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (crmSchoolIds) {
            crmSchoolIds.forEach((element) => {
                queryParameters = this.addToHttpParams(queryParameters,
                  <any>element, 'crmSchoolIds');
            })
        }
        if (features) {
            features.forEach((element) => {
                queryParameters = this.addToHttpParams(queryParameters,
                  <any>element, 'features');
            })
        }

        let headers = this.defaultHeaders;

        let credential: string | undefined;
        // authentication (ApiKeyAuth) required
        credential = this.configuration.lookupCredential('ApiKeyAuth');
        if (credential) {
            headers = headers.set('Ocp-Apim-Subscription-Key', credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'text/plain',
                'application/json',
                'text/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.get<Array<SchoolFeature>>(`${this.configuration.basePath}/api/v1/school-features`,
            {
                params: queryParameters,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * @param schoolCrmId 
     * @param deleteSchoolFeatureModel 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public apiV1SchoolFeaturesSchoolCrmIdDelete(schoolCrmId: string, deleteSchoolFeatureModel?: DeleteSchoolFeatureModel, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<SchoolFeaturesModel>;
    public apiV1SchoolFeaturesSchoolCrmIdDelete(schoolCrmId: string, deleteSchoolFeatureModel?: DeleteSchoolFeatureModel, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<HttpResponse<SchoolFeaturesModel>>;
    public apiV1SchoolFeaturesSchoolCrmIdDelete(schoolCrmId: string, deleteSchoolFeatureModel?: DeleteSchoolFeatureModel, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<HttpEvent<SchoolFeaturesModel>>;
    public apiV1SchoolFeaturesSchoolCrmIdDelete(schoolCrmId: string, deleteSchoolFeatureModel?: DeleteSchoolFeatureModel, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<any> {
        if (schoolCrmId === null || schoolCrmId === undefined) {
            throw new Error('Required parameter schoolCrmId was null or undefined when calling apiV1SchoolFeaturesSchoolCrmIdDelete.');
        }

        let headers = this.defaultHeaders;

        let credential: string | undefined;
        // authentication (ApiKeyAuth) required
        credential = this.configuration.lookupCredential('ApiKeyAuth');
        if (credential) {
            headers = headers.set('Ocp-Apim-Subscription-Key', credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'text/plain',
                'application/json',
                'text/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json',
            'text/json',
            'application/_*+json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.delete<SchoolFeaturesModel>(`${this.configuration.basePath}/api/v1/school-features/${encodeURIComponent(String(schoolCrmId))}`,
            {
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Returns feature interest options to be displayed on school lead forms
     * @param schoolCrmId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public apiV1SchoolFeaturesSchoolCrmIdLeadInterestOptionsGet(schoolCrmId: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<Array<FeatureInterestOption>>;
    public apiV1SchoolFeaturesSchoolCrmIdLeadInterestOptionsGet(schoolCrmId: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<HttpResponse<Array<FeatureInterestOption>>>;
    public apiV1SchoolFeaturesSchoolCrmIdLeadInterestOptionsGet(schoolCrmId: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<HttpEvent<Array<FeatureInterestOption>>>;
    public apiV1SchoolFeaturesSchoolCrmIdLeadInterestOptionsGet(schoolCrmId: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<any> {
        if (schoolCrmId === null || schoolCrmId === undefined) {
            throw new Error('Required parameter schoolCrmId was null or undefined when calling apiV1SchoolFeaturesSchoolCrmIdLeadInterestOptionsGet.');
        }

        let headers = this.defaultHeaders;

        let credential: string | undefined;
        // authentication (ApiKeyAuth) required
        credential = this.configuration.lookupCredential('ApiKeyAuth');
        if (credential) {
            headers = headers.set('Ocp-Apim-Subscription-Key', credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'text/plain',
                'application/json',
                'text/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.get<Array<FeatureInterestOption>>(`${this.configuration.basePath}/api/v1/school-features/${encodeURIComponent(String(schoolCrmId))}/lead-interest-options`,
            {
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * @param schoolCrmId 
     * @param addSchoolFeatureByAlternateIdModel 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public apiV1SchoolFeaturesSchoolCrmIdPost(schoolCrmId: string, addSchoolFeatureByAlternateIdModel?: AddSchoolFeatureByAlternateIdModel, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<SchoolFeaturesModel>;
    public apiV1SchoolFeaturesSchoolCrmIdPost(schoolCrmId: string, addSchoolFeatureByAlternateIdModel?: AddSchoolFeatureByAlternateIdModel, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<HttpResponse<SchoolFeaturesModel>>;
    public apiV1SchoolFeaturesSchoolCrmIdPost(schoolCrmId: string, addSchoolFeatureByAlternateIdModel?: AddSchoolFeatureByAlternateIdModel, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<HttpEvent<SchoolFeaturesModel>>;
    public apiV1SchoolFeaturesSchoolCrmIdPost(schoolCrmId: string, addSchoolFeatureByAlternateIdModel?: AddSchoolFeatureByAlternateIdModel, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<any> {
        if (schoolCrmId === null || schoolCrmId === undefined) {
            throw new Error('Required parameter schoolCrmId was null or undefined when calling apiV1SchoolFeaturesSchoolCrmIdPost.');
        }

        let headers = this.defaultHeaders;

        let credential: string | undefined;
        // authentication (ApiKeyAuth) required
        credential = this.configuration.lookupCredential('ApiKeyAuth');
        if (credential) {
            headers = headers.set('Ocp-Apim-Subscription-Key', credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'text/plain',
                'application/json',
                'text/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json',
            'text/json',
            'application/_*+json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.post<SchoolFeaturesModel>(`${this.configuration.basePath}/api/v1/school-features/${encodeURIComponent(String(schoolCrmId))}`,
            addSchoolFeatureByAlternateIdModel,
            {
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}