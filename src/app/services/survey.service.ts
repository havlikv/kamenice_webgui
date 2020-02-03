import { Injectable } from '@angular/core';
import { Survey } from '../domain/survey';
import { Observable, of, throwError }  from "rxjs";
import { Option } from '../domain/option';
import { Utils } from '../utils/utils';



@Injectable({
	providedIn: 'root'
})
export class SurveyService
{
	private surveys: Survey[] = [];
	private surveySeq = 0;

	private optionSeq = 0;

	constructor() { }



	getSurveys(): Observable<Survey[]>
	{
		let surveys: Survey[] = [];
		for(const survey of this.surveys)
		{
			surveys.push(SurveyService.deepCopyNoOption(survey));
		}

		return of(surveys);
	}



	createSurvey(inSurvey: Survey): Observable<number>
	{
		SurveyService.logObject("createSurvey: ", inSurvey);

		let survey: Survey = SurveyService.deepCopyNoOption(inSurvey);
		survey.options = [];

		survey.id = this.surveySeq;
		this.surveySeq++;
		this.surveys.push(survey);

		return of(survey.id);
	}



	updateSurvey(inSurvey: Survey): Observable<void>
	{
		SurveyService.logObject("updateSurvey: ", inSurvey);

		const index = this.findSurveyIndexById(inSurvey.id);

		if(index < 0)
		{
			throwError("Cannot update.");
		}

		Object.assign(this.surveys[index], SurveyService.deepCopyNoOption(inSurvey));

		return of();
	}



	deleteSurvey(id: number): Observable<void>
	{
		SurveyService.logObject("deleteSurvey: ", id);

		const index = this.findSurveyIndexById(id);

		if(index < 0)
		{
			throwError("Cannot delete.");
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



	hasSurveys(): boolean
	{
		return ( this.surveys.length > 0 );
	}



	getSurveyById(id: number): Observable<Survey>
	{
		const index = this.findSurveyIndexById(id);
		if(index < 0)
		{
			return throwError("Cannot get.");
		}
		const survey = this.surveys[index];

		return of(SurveyService.deepCopyNoOption(survey));
	}



	getOptions(surveyId: number): Observable<Option[]>
	{
		const index = this.findSurveyIndexById(surveyId);

		if(index < 0)
		{
			return throwError("Cannot find.");
		}

		return of(this.surveys[index].options);
	}



	createOption(surveyId: number, option: Option): Observable<void>
	{
		SurveyService.logObject("createOption: ", option);

		const index = this.findSurveyIndexById(surveyId);
		if(index < 0)
		{
			throwError("Cannot add.");
		}
		const survey = this.surveys[index];

		option.id = this.optionSeq;
		this.optionSeq++;

		survey.options.push( SurveyService.deepCopyNoOption(option) );

		return of();
	}



	updateOption(surveyId: number, option: Option): Observable<void>
	{
		SurveyService.logObject("updateOption: ", option);

		const surveyIndex = this.findSurveyIndexById(surveyId);
		if(surveyIndex < 0)
		{
			throwError("Cannot update.");
		}
		const survey = this.surveys[surveyIndex];

		const optionIndex = this.findOptionIndexById(survey, option.id);

		if(optionIndex < 0)
		{
			return throwError("Cannot update.");
		}

		survey.options.splice(optionIndex, 1, option);

		return of();
	}



	deleteOption(surveyId: number, optionId: number): Observable<void>
	{
		SurveyService.logObject("deleteOption: ", optionId);

		const surveyIndex = this.findSurveyIndexById(surveyId);

		if(surveyIndex < 0)
		{
			return throwError("Cannot delete.");
		}

		const survey = this.surveys[surveyIndex];

		const optionIndex = this.findOptionIndexById(survey, optionId);

		if(optionIndex < 0)
		{
			return throwError("Cannot delete.");
		}

		survey.options.splice(optionIndex, 1);

		return of();
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



	static logObject(message, o): void
	{
		console.log(message);
		console.log(o);
	}
}
