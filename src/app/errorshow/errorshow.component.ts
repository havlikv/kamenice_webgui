import { Component, OnInit, OnDestroy } from '@angular/core';
import { ErrorShowService } from '../services/errorshow.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
	selector: 'app-errorshow',
	templateUrl: './errorshow.component.html',
	styleUrls: ['./errorshow.component.css']
})
export class ErrorshowComponent implements OnInit, OnDestroy
{

	error: string = null;
	private subscription: Subscription;

	constructor(private errorShowService: ErrorShowService) { }

	ngOnInit()
	{
		this.subscription = this.errorShowService.getBusyStateObservable().subscribe(
			(error: string) => {
				this.error = error;
			}
		);
	}



	ngOnDestroy()
	{
		this.subscription.unsubscribe();
	}


	dismiss(): void
	{
		this.error = null;
	}

}
