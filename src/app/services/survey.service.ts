import { Injectable, InjectionToken } from '@angular/core';
import { Survey } from '../domain/survey';
import { Observable, of, throwError }  from "rxjs";
import { Option } from '../domain/option';
import { Utils } from '../utils/utils';
import { environment } from "../../environments/environment";
import { MockSurveyService } from './mock-survey.service';
import { BackendSurveyService } from './backend-survey.service';
import { HttpClient } from '@angular/common/http';


export const SURVEY_SERVICE_INJTOKEN = new InjectionToken<string>("SurveyService");



export interface SurveyService
{

	getSurveys(): Observable<Survey[]>;
	createSurvey(inSurvey: Survey): Observable<number>;
	updateSurvey(inSurvey: Survey): Observable<void>;
	deleteSurvey(id: number): Observable<void>;
	getSurveyById(id: number): Observable<Survey>;
	getOptions(surveyId: number): Observable<Option[]>;
	createOption(surveyId: number, option: Option): Observable<number>;
	updateOption(surveyId: number, option: Option): Observable<void>;
	deleteOption(surveyId: number, optionId: number): Observable<void>;
}



export class BeSurvey
{

	public static toBeSurvey(survey: Survey): BeSurvey
	{
		let fromTimestamp = new Date(survey.fromDate.year,
			survey.fromDate.month,
			survey.fromDate.day,
			survey.fromTime.hour,
			survey.fromTime.minute,
			survey.fromTime.second,
			0);

		let untilTimestamp = new Date(survey.fromDate.year,
			survey.untilDate.month,
			survey.untilDate.day,
			survey.untilTime.hour,
			survey.untilTime.minute,
			survey.untilTime.second,
			0);
	
		return {
			id: survey.id ? survey.id: null,
			name: survey.name,
			description: survey.description,
			fromTimestamp: fromTimestamp.getTime(),
			untilTimestamp: untilTimestamp.getTime()
		}
	}



	public static toSurvey(beSurvey: BeSurvey): Survey
	{
		let fromTimestamp = new Date();
		fromTimestamp.setTime(beSurvey.fromTimestamp);

		let untilTimestamp = new Date();
		untilTimestamp.setTime(beSurvey.untilTimestamp);

		return {
			id: beSurvey.id,
			name: beSurvey.name,
			description: beSurvey.description,
			fromDate: {
				year: fromTimestamp.getFullYear(),
				month: fromTimestamp.getMonth(),
				day: fromTimestamp.getDay()+1
			},
			fromTime: {
				hour: fromTimestamp.getHours(),
				minute: fromTimestamp.getMinutes(),
				second: fromTimestamp.getSeconds()
			},
			untilDate: {
				year: untilTimestamp.getFullYear(),
				month: untilTimestamp.getMonth(),
				day: untilTimestamp.getDay()+1
			},
			untilTime: {
				hour: untilTimestamp.getHours(),
				minute: untilTimestamp.getMinutes(),
				second: untilTimestamp.getSeconds()
			}
		}
	}

	id?: number;
    name: string;
	description: string;
	fromTimestamp: number;
	untilTimestamp: number;
}
