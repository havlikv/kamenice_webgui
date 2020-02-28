import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';



@Injectable({
	providedIn: 'root'
})
export class ErrorShowService {

	private errorShowSubject = new Subject<string>();
	private errorShowStateObservable = this.errorShowSubject.asObservable();


	constructor() { }



	showError(error: any): void {
		this.errorShowSubject.next(error);
	}



	getBusyStateObservable(): Observable<string> {
		return this.errorShowStateObservable;
	}
}
