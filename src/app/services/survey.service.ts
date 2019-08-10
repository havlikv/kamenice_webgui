import { Injectable } from '@angular/core';
import { Survey } from '../domain/survey';
import { Observable, of, throwError }  from "rxjs";
import { Option } from '../domain/Option';
import { I18n } from "@ngx-translate/i18n-polyfill";



@Injectable({
	providedIn: 'root'
})
export class SurveyService
{
	private surveys: Survey[] = [];
	private surveySeq = 0;

	private optionSeq = 0;

	constructor(private i18n: I18n) { }


	addSurvey(inSurvey: Survey): Observable<number>
	{
		console.log(inSurvey);

		let survey: Survey = SurveyService.deepCopy(inSurvey);

		survey.id = this.surveySeq;
		this.surveySeq++;
		this.surveys.push(survey);

		return of(survey.id);
	}



	updateSurvey(inSurvey: Survey): Observable<void>
	{
		const index = this.findSurveyIndexById(inSurvey.id);

		if(index < 0)
		{
			throwError(this.i18n("Cannot update."));
		}

		let survey: Survey = SurveyService.deepCopy(inSurvey);
		this.surveys.splice(index, 1, survey);

		return of();
	}



	deleteSurvey(id: number): Observable<void>
	{
		const index = this.findSurveyIndexById(id);

		if(index < 0)
		{
			throwError(this.i18n("Cannot delete."));
		}

		this.surveys.splice(index, 1);

		return of();
	}



	private findSurveyIndexById(id: number): number
	{
		for(let i = 0; i < this.surveys.length; i++)
		{
			let survey = this.surveys[i];
			if(id === survey.id)
			{
				return i;
			}
		}

		return -1;
	}



	getSurveys(): Observable<Survey[]>
	{
		let surveys: Survey[] = [];
		for(const survey of this.surveys)
		{
			surveys.push(SurveyService.deepCopy(survey));
		}

		return of(surveys);
	}



	hasSurveys(): Observable<boolean>
	{
		return of(this.surveys.length > 0);
	}



	getSurveyById(id: number): Observable<Survey>
	{
		const index = this.findSurveyIndexById(id);
		if(index < 0)
		{
			return throwError(this.i18n("Cannot get."));
		}
		const survey = this.surveys[index];

		return of(SurveyService.deepCopy(survey));
	}



	addOption(surveyId: number, option: Option): Observable<void>
	{
		const index = this.findSurveyIndexById(surveyId);
		if(index < 0)
		{
			throwError(this.i18n("Cannot add."));
		}
		const survey = this.surveys[index];

		option.imageUrl = window.URL.createObjectURL(option.file);

		survey.options.push( SurveyService.deepCopy(option) );

		return of();
	}



	deleteOption(surveyId: number, optionId: number): Observable<void>
	{
		const index = this.findSurveyIndexById(surveyId);
		if(index < 0)
		{
			throwError(this.i18n("Cannot delete."));
		}

		const options = this.surveys[index].options;

		for(let i=0; i < options.length; i++)
		{
			let option = options[i];
			if(option.id === optionId)
			{
				URL.revokeObjectURL(option.imageUrl);
				options.splice(i, 1);

				return of();
			}
		}

		return throwError(this.i18n("Cannot delete."));
	}



	static deepCopy(obj: any): any
	{
		return JSON.parse(JSON.stringify(obj));
	}
}
