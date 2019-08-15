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

		let survey: Survey = SurveyService.deepCopyNoOption(inSurvey);

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

		Object.assign(this.surveys[index], SurveyService.deepCopyNoOption(inSurvey));

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
			surveys.push(SurveyService.deepCopyNoOption(survey));
		}

		return of(surveys);
	}



	hasSurveys(): boolean
	{
		return ( this.surveys.length > 0 );
	}



	getSurveyById(id: number): Observable<Survey>
	{
		const index = this.findSurveyIndexById(id);
		if(index < 0)
		{
			return throwError(this.i18n("Cannot get."));
		}
		const survey = this.surveys[index];

		return of(SurveyService.deepCopyNoOption(survey));
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

		survey.options.push( SurveyService.deepCopyNoOption(option) );

		return of();
	}



	updateOption(surveyId: number, option: Option): Observable<void>
	{
		const surveyIndex = this.findSurveyIndexById(surveyId);
		if(surveyIndex < 0)
		{
			throwError(this.i18n("Cannot update."));
		}
		const survey = this.surveys[surveyIndex];

		const optionIndex = this.findOptionIndexById(survey, option.id);

		if(optionIndex < 0)
		{
			return throwError(this.i18n("Cannot update."));
		}

		this.purgeOption(survey, optionIndex);

		option.imageUrl = window.URL.createObjectURL(option.file);

		survey.options.splice(optionIndex, 0, option);

		return of();
	}



	deleteOption(surveyId: number, optionId: number): Observable<void>
	{
		const surveyIndex = this.findSurveyIndexById(surveyId);

		if(surveyIndex < 0)
		{
			return throwError(this.i18n("Cannot delete."));
		}

		const survey = this.surveys[surveyIndex];

		const optionIndex = this.findOptionIndexById(survey, optionId);

		if(optionIndex < 0)
		{
			return throwError(this.i18n("Cannot delete."));
		}

		this.purgeOption(survey, optionIndex);
	}



	private purgeOption(survey: Survey, optionIndex: number)
	{
		const option = survey.options[optionIndex];
		URL.revokeObjectURL(option.imageUrl);
		survey.options.splice(optionIndex, 1);
	}



	private findOptionIndexById(survey: Survey, optionId: number): number
	{
		const options = survey.options;

		for(let i=0; i < options.length; i++)
		{
			if(options[i].id === optionId)
			{
				return i;
			}
		}

		return -1;
	}



	static deepCopyNoOption(obj: any): any
	{
		const x = JSON.parse(JSON.stringify(obj));

		delete x["options"];

		return x;
	}
}
