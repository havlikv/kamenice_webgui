import { Survey } from '../domain/survey';
import { Observable, of, throwError, Subject } from "rxjs";
import { Option } from '../domain/option';
import { SurveyService, BeSurvey } from './survey.service';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { tap, map, switchMap, finalize, catchError } from 'rxjs/operators';
import { BusyService } from './busy.service';
import { ErrorShowService } from './errorshow.service';




export class BackendSurveyService implements SurveyService
{
	private backendUrl: string;

	private hasSurveysSubject: Subject<boolean>;
	private hasSurveysObs: Observable<boolean>;


	constructor(private httpClient: HttpClient, private busyService: BusyService, private errorShowService: ErrorShowService)
	{
		this.backendUrl = environment["backendUrl"];

		this.hasSurveysSubject = new Subject<boolean>();
		this.hasSurveysObs = this.hasSurveysSubject.asObservable();
	}



	getSurveys(): Observable<Survey[]>
	{
		this.busyService.showBusy();

		return this.httpClient.get<BeSurvey[]>(`${this.backendUrl}/survey`)
			.pipe(
				map((beSurveys: BeSurvey[]) =>
				{
					return beSurveys.map(BeSurvey.toSurvey);
				}),
				finalize(() => this.busyService.hideBusy())
			);
	}



	createSurvey(survey: Survey): Observable<number>
	{
		this.busyService.showBusy();

		return this.httpClient.post<number>(`${this.backendUrl}/survey`, BeSurvey.toBeSurvey(survey)).pipe(
			finalize(() => this.busyService.hideBusy())
		);
	}



	updateSurvey(survey: Survey): Observable<void>
	{
		this.busyService.showBusy();

		return this.httpClient.put<void>(`${this.backendUrl}/survey`, BeSurvey.toBeSurvey(survey)).pipe(
			finalize(() => this.busyService.hideBusy())
		);
	}



	deleteSurvey(id: number): Observable<void>
	{
		this.busyService.showBusy();

		return this.httpClient.delete<void>(`${this.backendUrl}/survey?id=${id}`).pipe(
			finalize(() => this.busyService.hideBusy())
		);
	}



	get hasSurveys(): Observable<boolean>
	{
		this.busyService.showBusy();

		return this.httpClient.get<boolean>(`${this.backendUrl}/has_surveys`).pipe(
			tap((x) =>
			{
				this.hasSurveysSubject.next(x);
			}),
			finalize(() => this.busyService.hideBusy()),
			switchMap(
				() =>
				{
					return this.hasSurveysObs;
				}
			));
	}



	getSurveyById(id: number): Observable<Survey>
	{
		this.busyService.showBusy();

		return this.httpClient.get<BeSurvey>(`${this.backendUrl}/survey_by_id?id=${id}`).pipe(
			map((beSurvey: BeSurvey) =>
			{
				return BeSurvey.toSurvey(beSurvey);
			}),
			finalize( () => this.busyService.hideBusy() ),
			tap((survey: Survey) =>
			{
				this.setupImagesUrl(survey);
			})
		);
	}



	private setupImagesUrl(survey: Survey)
	{
		if (!survey.options)
		{
			return;
		}

		for (let option of survey.options)
		{
			if (!option.images)
			{
				continue;
			}

			for (let image of option.images)
			{
				image.imageUrl = `${this.backendUrl}/images/${image.id}`;
			}
		}
	}



	getOptions(surveyId: number): Observable<Option[]>
	{
		this.busyService.showBusy();

		return this.httpClient.get<Option[]>(`${this.backendUrl}/option?surveyId=${surveyId}`).pipe(
			finalize( () => this.busyService.hideBusy() )
		);
	}



	createOption(surveyId: number, option: Option): Observable<number>
	{
		this.busyService.showBusy();

		return this.httpClient.post<number>(`${this.backendUrl}/option`, option).pipe(
			catchError( error => {
				this.errorShowService.showError(error);

				return throwError(error);
			}
			),
			finalize( () => this.busyService.hideBusy() )
		);
	}



	updateOption(surveyId: number, option: Option): Observable<void>
	{
		this.busyService.showBusy();

		return this.httpClient.put<void>(`${this.backendUrl}/option`, option).pipe(
			finalize( () => this.busyService.hideBusy() )
		);
	}



	deleteOption(surveyId: number, id: number): Observable<void>
	{
		this.busyService.showBusy();

		return this.httpClient.delete<void>(`${this.backendUrl}/option?id=${id}`).pipe(
			finalize( () => this.busyService.hideBusy() )
		);
	}

}
