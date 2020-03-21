import { InjectionToken } from '@angular/core';
import { Survey } from '../domain/survey';
import { Observable, of, throwError }  from "rxjs";
import { Option } from '../domain/option';
import { Image } from "../domain/image";



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
	createImage(optionId: number, image: Image, seq: number): Observable<number>;
	deleteImage(imageId: number): Observable<void>;
	updateImageSeq(imageId: number, seq: number): Observable<void>;
}

