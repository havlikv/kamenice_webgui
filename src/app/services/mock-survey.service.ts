import { Survey } from '../domain/survey';
import { Observable, of, throwError }  from "rxjs";
import { Option } from '../domain/option';
import { SurveyService } from "./survey.service";
import { Image } from "../domain/image";


export class MockSurveyService implements SurveyService
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
			surveys.push(MockSurveyService.deepCopyNoOption(survey));
		}

		return of(surveys);
	}



	createSurvey(inSurvey: Survey): Observable<number>
	{
		MockSurveyService.logObject("createSurvey: ", inSurvey);

		let survey: Survey = MockSurveyService.deepCopyNoOption(inSurvey);
		survey.options = [];

		survey.id = this.surveySeq;
		this.surveySeq++;
		this.surveys.push(survey);

		return of(survey.id);
	}



	updateSurvey(inSurvey: Survey): Observable<void>
	{
		MockSurveyService.logObject("updateSurvey: ", inSurvey);

		const index = this.findSurveyIndexById(inSurvey.id);

		if(index < 0)
		{
			throwError("Cannot update.");
		}

		Object.assign(this.surveys[index], MockSurveyService.deepCopyNoOption(inSurvey));

		return of();
	}



	deleteSurvey(id: number): Observable<void>
	{
		MockSurveyService.logObject("deleteSurvey: ", id);

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



	getSurveyById(id: number): Observable<Survey>
	{
		const index = this.findSurveyIndexById(id);
		if(index < 0)
		{
			return throwError("Cannot get.");
		}
		const survey = this.surveys[index];

		return of(MockSurveyService.deepCopyNoOption(survey));
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



	createOption(surveyId: number, option: Option): Observable<number>
	{
		MockSurveyService.logObject("createOption: ", option);

		const index = this.findSurveyIndexById(surveyId);
		if(index < 0)
		{
			throwError("Cannot add.");
		}
		const survey = this.surveys[index];

		option.id = this.optionSeq;
		this.optionSeq++;

		survey.options.push( MockSurveyService.deepCopyNoOption(option) );

		return of(option.id);
	}



	updateOption(surveyId: number, option: Option): Observable<void>
	{
		MockSurveyService.logObject("updateOption: ", option);

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
		MockSurveyService.logObject("deleteOption: ", optionId);

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



	createImage(optionId: number, image: Image, seq: number): Observable<number>
	{
		return of(0);
	}



	deleteImage(imageId: number): Observable<void>
	{
		return of();
	}



	updateImageSeq(imageId: number, seq: number): Observable<void>
	{
		return of();
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
