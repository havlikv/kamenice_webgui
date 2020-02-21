import { Injectable, InjectionToken } from '@angular/core';
import { Survey } from '../domain/survey';
import { Observable, of, throwError }  from "rxjs";
import { Option } from '../domain/option';
import { Utils } from '../utils/utils';
import { environment } from "../../environments/environment";
import { MockSurveyService } from './mock-survey.service';


export const SURVEY_SERVICE_INJTOKEN = new InjectionToken<string>("SurveyService");

export function createSurveyService()
{
	if(environment["backend"])
	{
		return null;
	}
	else
	{
		return new MockSurveyService;
	}
}



export interface SurveyService
{

	getSurveys(): Observable<Survey[]>;
	createSurvey(inSurvey: Survey): Observable<number>;
	updateSurvey(inSurvey: Survey): Observable<void>;
	deleteSurvey(id: number): Observable<void>;
	
	hasSurveys(): Observable<boolean>;
	
	getSurveyById(id: number): Observable<Survey>;
	
	getOptions(surveyId: number): Observable<Option[]>;
	createOption(surveyId: number, option: Option): Observable<number>;
	updateOption(surveyId: number, option: Option): Observable<void>;
	deleteOption(surveyId: number, optionId: number): Observable<void>;
}
