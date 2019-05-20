import { Injectable } from '@angular/core';
import { Survey } from '../domain/survey';

@Injectable({
	providedIn: 'root'
})
export class SurveyService
{
	private surveys: Survey[] = [];
	private sequence = 0;

	constructor() { }


	addSurvey(survey: Survey): void
	{
		survey.id = this.sequence;
		this.sequence++;
		this.surveys.push(survey);
	}



	delete(id: number): void
	{
		for(let i = 0; i < this.surveys.length; i++)
		{
			let survey = this.surveys[i];
			if(id === survey.id)
			{
				this.surveys.splice(i, 1);

				return;
			}
		}
	}



	getSurveys(): Survey[]
	{
		return this.surveys;
	}



	hasSurveys(): boolean
	{
		return this.surveys.length > 0;
	}
}
