import { Survey } from '../domain/survey';
import { Observable, of, throwError, Subject, from, Observer } from "rxjs";
import { Option } from '../domain/option';
import { SurveyService } from './survey.service';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { tap, map, switchMap, finalize, catchError } from 'rxjs/operators';
import { BusyService } from './busy.service';
import { ErrorShowService } from './errorshow.service';
import { Image } from "../domain/image";
import { Utils } from '../utils/utils';




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
			finalize(() => this.busyService.hideBusy())
		);
	}

	

	getOptions(surveyId: number): Observable<Option[]>
	{
		this.busyService.showBusy();

		const comp = this;

		return this.httpClient.get<BeOption[]>(`${this.backendUrl}/option?surveyId=${surveyId}`).pipe(
			catchError(error =>
			{
				this.errorShowService.showError(error);

				return throwError(error);
			}),

			comp.convertToOptions.bind(comp),
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

		return this.httpClient.put<void>(`/option?survey_id=${surveyId}`, beOption).pipe(
			catchError(error =>
			{
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
			catchError(error =>
			{
				this.errorShowService.showError(error);

				return throwError(error);
			}),


			finalize(() => this.busyService.hideBusy())
		);
	}



	createImage(optionId: number, image: Image): Observable<number>
	{
		this.busyService.showBusy();

		const formData = new FormData();
		formData.append("blob", image.file);

		return this.httpClient.post<number>(`${this.backendUrl}/image?option_id=${optionId}`, formData).pipe(
			catchError(error =>
			{
				this.errorShowService.showError(error);

				return throwError(error);
			}),

			finalize(() => this.busyService.hideBusy())
		);
	}



	convertToOptions(beObservable: Observable<BeOption[]>): Observable<Option[]>
	{
		let index = 0;
		let options: Option[] = [];

		const comp = this;

		function doWork(beOptions: BeOption[], observer: Observer<Option[]>)
		{
			if (Utils.indexWithin(beOptions, index))
			{
				const beOption = beOptions[index];
				index++;

				const id = beOption.id;
				comp.httpClient.get<number[]>(`${comp.backendUrl}/images_ids?option_id=${id}`).subscribe(
					(ids: number[]) =>
					{
						let option = BeOption.toOption(beOption, ids, `${comp.backendUrl}`)

						options.push(option);

						doWork(beOptions, observer);
					}
				);
			}
			else
			{
				observer.next(options);
				observer.complete();
			}
		}



		function createObserver(observer: Observer<Option[]>): Observer<BeOption[]>
		{
			return {
				next: (beOptions: BeOption[]) => { doWork(beOptions, observer); },
				error: () => { },
				complete: () => { }
			}
		}


		return new Observable<Option[]>((observer) =>
		{
			let beObserver = createObserver(observer);

			beObservable.subscribe(beObserver);
		});
	}

}






class BeSurvey
{

	id?: number;
	name: string;
	description: string;
	fromTimestamp: number;
	untilTimestamp: number;



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
			id: survey.id ? survey.id : null,
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
				day: fromTimestamp.getDay() + 1
			},
			fromTime: {
				hour: fromTimestamp.getHours(),
				minute: fromTimestamp.getMinutes(),
				second: fromTimestamp.getSeconds()
			},
			untilDate: {
				year: untilTimestamp.getFullYear(),
				month: untilTimestamp.getMonth(),
				day: untilTimestamp.getDay() + 1
			},
			untilTime: {
				hour: untilTimestamp.getHours(),
				minute: untilTimestamp.getMinutes(),
				second: untilTimestamp.getSeconds()
			}
		}
	}
}



class BeOption
{
	id?: number;
	name: string;
	description: string;



	public static toBeOption(option: Option): BeOption
	{
		return {
			id: option.id ? option.id : null,
			name: option.name,
			description: option.description
		}
	}



	public static toOption(beOption: BeOption, imageIds: number[], backendUrl: string)
	{
		let images: Image[] = [];
		for (let imageId of imageIds)
		{
			let image = {
				id: imageId,
				file: null,
				imageUrl: `${backendUrl}/image?image_id=${imageId}`
			};
			images.push(image);
		}


		return {
			id: beOption.id,
			name: beOption.name,
			description: beOption.description,
			images: images
		}
	}
}

