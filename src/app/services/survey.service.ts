import { Injectable } from '@angular/core';
import { Survey } from '../domain/survey';
import { ToBeOption } from '../domain/ToBeOption';
import { Observable, of, throwError }  from "rxjs";
import { FromBeOption } from '../domain/FromBeOption';
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


	addSurvey(survey: Survey): Observable<number>
	{
		survey.id = this.surveySeq;
		this.surveySeq++;
		this.surveys.push(survey);

		return of(survey.id);
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
		return of(this.surveys);
	}



	hasSurveys(): Observable<boolean>
	{
		return of(this.surveys.length > 0);
	}



	addOption(surveyId: number, toBeOption: ToBeOption): Observable<void>
	{
		const index = this.findSurveyIndexById(surveyId);
		if(index < 0)
		{
			throwError(this.i18n("Cannot add."));
		}
		const survey = this.surveys[index];
		survey.options.push( this.convertToBeOption_to_FromBeOption(toBeOption) );

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
			let fromBeOption = options[i];
			if(fromBeOption.id === optionId)
			{
				URL.revokeObjectURL(fromBeOption.photoUrl);
				options.splice(i, 1);

				return of();
			}
		}

		return throwError(this.i18n("Cannot delete."));
	}



	convertToBeOption_to_FromBeOption(toBeOption: ToBeOption): FromBeOption
	{
		let fromBeOption: FromBeOption;

		fromBeOption.id = this.optionSeq++;
		fromBeOption.name = toBeOption.name;
		fromBeOption.description = toBeOption.description;
		fromBeOption.photoUrl = URL.createObjectURL(toBeOption.file);

		return fromBeOption;
	}
}
