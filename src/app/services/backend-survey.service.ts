import { Survey } from '../domain/survey';
import { Observable, of, throwError }  from "rxjs";
import { Option } from '../domain/option';
import { SurveyService } from './survey.service';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";




export class BackendSurveyService implements SurveyService
{
	private backendUrl: string;


	constructor(private httpClient: HttpClient)
	{
		this.backendUrl = environment["backendUrl"];
	}


	
	getSurveys(): Observable<Survey[]>
	{
		return this.httpClient.get<Survey[]>(`${this.backendUrl}/survey`);
	}



	createSurvey(survey: Survey): Observable<number>
	{
		return this.httpClient.post<number>(`${this.backendUrl}/survey`, survey);
	}



	updateSurvey(inSurvey: Survey): Observable<void>
	{
		return this.httpClient.put<void>(`${this.backendUrl}/survey`, inSurvey);
	}



	deleteSurvey(id: number): Observable<void>
	{
		return this.httpClient.delete<void>(`${this.backendUrl}/survey?id=${id}`);
	}


	
	hasSurveys(): Observable<boolean>
	{
		return this.httpClient.get<boolean>(`${this.backendUrl}/has_surveys`);
	}


	
	getSurveyById(id: number): Observable<Survey>
	{
		return this.httpClient.get<Survey>(`${this.backendUrl}/survey_by_id?id=${id}`);
	}

	

	getOptions(surveyId: number): Observable<Option[]>
	{
		return this.httpClient.get<Option[]>(`${this.backendUrl}/option`);
	}



	createOption(surveyId: number, option: Option): Observable<number>
	{
		return this.httpClient.post<number>(`${this.backendUrl}/option`, option);
	}



	updateOption(surveyId: number, option: Option): Observable<void>
	{
		return this.httpClient.put<void>(`${this.backendUrl}/option`, option);
	}



	deleteOption(surveyId: number, id: number): Observable<void>
	{
		return this.httpClient.delete<void>(`${this.backendUrl}/option?id=${id}`);
	}

}
