import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { BusyService, BusyState } from '../services/busy.service';



@Component({
	selector: 'app-busy',
	templateUrl: './busy.component.html',
	styleUrls: ['./busy.component.css']
})
export class BusyComponent implements OnInit, OnDestroy {

	busy = false;
	private subscription: Subscription;



	constructor(private busyService: BusyService) {
	}



	ngOnInit() {
		this.subscription = this.busyService.getBusyStateObservable()
			.subscribe((busyState: BusyState) => { this.busy = busyState.busy; });
	}



	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

}
