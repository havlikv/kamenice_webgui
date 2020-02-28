import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';



@Injectable({
	providedIn: 'root'
})
export class BusyService {

	private busySubject = new Subject<BusyState>();
	private busyStateObservable = this.busySubject.asObservable();


	constructor() { }



	showBusy(): void {
		this.busySubject.next({busy: true});
	}



	hideBusy(): void {
		this.busySubject.next({busy: false});
	}



	getBusyStateObservable(): Observable<BusyState> {
		return this.busyStateObservable;
	}
}



export interface BusyState {
	busy: boolean;
}
