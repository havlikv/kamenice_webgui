import { Survey } from '../domain/survey';
import { Observable, of, throwError, Subject } from "rxjs";
import { Option } from '../domain/option';
import { SurveyService } from './survey.service';
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

		return this.httpClient.get<BeSurvey[]>(`${this.backendUrl}/survey`).pipe(
			catchError(error =>
			{
				this.errorShowService.showError(error);

				return throwError(error);
			}),

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

		let beSurvey = BeSurvey.toBeSurvey(survey);

		return this.httpClient.post<number>(`${this.backendUrl}/survey`, beSurvey).pipe(
			catchError(error =>
			{
				this.errorShowService.showError(error);

				return throwError(error);
			}),

			finalize(() => this.busyService.hideBusy())
		);
	}



	updateSurvey(survey: Survey): Observable<void>
	{
		this.busyService.showBusy();

		let beSurvey = BeSurvey.toBeSurvey(survey);

		return this.httpClient.put<void>(`${this.backendUrl}/survey`, beSurvey).pipe(
			catchError(error =>
			{
				this.errorShowService.showError(error);

				return throwError(error);
			}),

			finalize(() => this.busyService.hideBusy())
		);
	}



	deleteSurvey(id: number): Observable<void>
	{
		this.busyService.showBusy();

		return this.httpClient.delete<void>(`${this.backendUrl}/survey?id=${id}`).pipe(
			catchError(error =>
			{
				this.errorShowService.showError(error);

				return throwError(error);
			}),

			finalize(() => this.busyService.hideBusy())
		);
	}



	get hasSurveys(): Observable<boolean>
	{
		this.busyService.showBusy();

		return this.httpClient.get<boolean>(`${this.backendUrl}/has_surveys`).pipe(
			catchError(error =>
			{
				this.errorShowService.showError(error);

				return throwError(error);
			}),

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
			catchError(error =>
			{
				this.errorShowService.showError(error);

				return throwError(error);
			}),

			map((beSurvey: BeSurvey) =>
			{
				return BeSurvey.toSurvey(beSurvey);
			}),
			finalize(() => this.busyService.hideBusy()),
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
			catchError(error =>
			{
				this.errorShowService.showError(error);

				return throwError(error);
			}),

			finalize(() => this.busyService.hideBusy())
		);
	}



	createOption(surveyId: number, option: Option): Observable<number>
	{
		this.busyService.showBusy();

		let beOption = BeOption.toBeOption(option);

		return this.httpClient.post<number>(`${this.backendUrl}/option?survey_id=${surveyId}`, beOption).pipe(
			catchError(error =>
			{
				this.errorShowService.showError(error);

				return throwError(error);
			}),
			finalize(() => this.busyService.hideBusy())
		);
	}



	updateOption(surveyId: number, option: Option): Observable<void>
	{
		this.busyService.showBusy();

		let beOption = BeOption.toBeOption(option);

		return this.httpClient.put<void>(`${this.backendUrl}/option?survey_id=${surveyId}`, beOption).pipe(
			catchError( error => {
				this.errorShowService.showError(error);

				return throwError(error);
			}),

			finalize(() => this.busyService.hideBusy())
		);
	}



	deleteOption(surveyId: number, id: number): Observable<void>
	{
		this.busyService.showBusy();

		return this.httpClient.delete<void>(`${this.backendUrl}/option?id=${id}`).pipe(
			catchError( error => {
				this.errorShowService.showError(error);

				return throwError(error);
			}),

			finalize(() => this.busyService.hideBusy())
		);
	}

}





class BeSurvey
{

	public static toBeSurvey(survey: Survey): BeSurvey
	{
		let fromTimestamp = new Date(survey.fromDate.year,
			survey.fromDate.month,
			survey.fromDate.day,
			survey.fromTime.hour,
			survey.fromTime.minute,
			survey.fromTime.second,
			0);

		let untilTimestamp = new Date(survey.fromDate.year,
			survey.untilDate.month,
			survey.untilDate.day,
			survey.untilTime.hour,
			survey.untilTime.minute,
			survey.untilTime.second,
			0);
	
		return {
			id: survey.id ? survey.id: null,
			name: survey.name,
			description: survey.description,
			fromTimestamp: fromTimestamp.getTime(),
			untilTimestamp: untilTimestamp.getTime()
		}
	}



	public static toSurvey(beSurvey: BeSurvey): Survey
	{
		let fromTimestamp = new Date();
		fromTimestamp.setTime(beSurvey.fromTimestamp);

		let untilTimestamp = new Date();
		untilTimestamp.setTime(beSurvey.untilTimestamp);

		return {
			id: beSurvey.id,
			name: beSurvey.name,
			description: beSurvey.description,
			fromDate: {
				year: fromTimestamp.getFullYear(),
				month: fromTimestamp.getMonth(),
				day: fromTimestamp.getDay()+1
			},
			fromTime: {
				hour: fromTimestamp.getHours(),
				minute: fromTimestamp.getMinutes(),
				second: fromTimestamp.getSeconds()
			},
			untilDate: {
				year: untilTimestamp.getFullYear(),
				month: untilTimestamp.getMonth(),
				day: untilTimestamp.getDay()+1
			},
			untilTime: {
				hour: untilTimestamp.getHours(),
				minute: untilTimestamp.getMinutes(),
				second: untilTimestamp.getSeconds()
			}
		}
	}

	id?: number;
    name: string;
	description: string;
	fromTimestamp: number;
	untilTimestamp: number;
}



class BeOption
{
	public static toBeOption(option: Option): BeOption
	{
		return {
			id: option.id ? option.id : null,
			name: option.name,
			description: option.description
		}
	}

	id?: number;
	name: string;
	description: string;

}

