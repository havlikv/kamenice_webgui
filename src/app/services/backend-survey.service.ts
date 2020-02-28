import { Survey } from '../domain/survey';
import { Observable, of, throwError, Subject }  from "rxjs";
import { Option } from '../domain/option';
import { SurveyService, BeSurvey } from './survey.service';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { tap, map, switchMap } from 'rxjs/operators';




export class BackendSurveyService implements SurveyService
{
	private backendUrl: string;

	private hasSurveysSubject: Subject<boolean>;
	private hasSurveysObs: Observable<boolean>;


	constructor(private httpClient: HttpClient)
	{
		this.backendUrl = environment["backendUrl"];

		this.hasSurveysSubject = new Subject<boolean>();
		this.hasSurveysObs = this.hasSurveysSubject.asObservable();
	}


	
	getSurveys(): Observable<Survey[]>
	{
		return this.httpClient.get<BeSurvey[]>(`${this.backendUrl}/survey`)
			.pipe(
				map( (beSurveys: BeSurvey[]) => {
					return beSurveys.map( BeSurvey.toSurvey );
				} )
			);
	}



	createSurvey(survey: Survey): Observable<number>
	{
		return this.httpClient.post<number>(`${this.backendUrl}/survey`, BeSurvey.toBeSurvey(survey) );
	}



	updateSurvey(survey: Survey): Observable<void>
	{
		return this.httpClient.put<void>(`${this.backendUrl}/survey`, BeSurvey.toBeSurvey(survey) );
	}



	deleteSurvey(id: number): Observable<void>
	{
		return this.httpClient.delete<void>(`${this.backendUrl}/survey?id=${id}`);
	}


	
	get hasSurveys(): Observable<boolean>
	{
		return this.httpClient.get<boolean>(`${this.backendUrl}/has_surveys`)
		.pipe(tap((x) => {
			this.hasSurveysSubject.next(x);
		}),
		switchMap(
			() => {
				return this.hasSurveysObs;
			}
		)	);
	}


	
	getSurveyById(id: number): Observable<Survey>
	{
		return this.httpClient.get<BeSurvey>(`${this.backendUrl}/survey_by_id?id=${id}`).pipe(
			map( (beSurvey: BeSurvey) => {
				return BeSurvey.toSurvey(beSurvey);
			}),
			tap( ( survey: Survey ) => {
				this.setupImagesUrl(survey);
			})
		);
	}



	private setupImagesUrl(survey: Survey)
	{
		if(!survey.options)
		{
			return;
		}

		for(let option of survey.options)
		{
			if(!option.images)
			{
				continue;
			}

			for(let image of option.images)
			{
				image.imageUrl = `${this.backendUrl}/images/${image.id}`;
			}
		}
	}

	

	getOptions(surveyId: number): Observable<Option[]>
	{
		return this.httpClient.get<Option[]>(`${this.backendUrl}/option?surveyId=${surveyId}`);
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
