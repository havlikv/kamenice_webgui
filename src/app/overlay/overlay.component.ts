import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { OverlayService, Command } from '../services/overlay.service';
import { Subscription } from 'rxjs';


@Component({
	selector: 'app-overlay',
	templateUrl: './overlay.component.html',
	styleUrls: ['./overlay.component.css']
})
export class OverlayComponent implements OnInit, OnDestroy
{
	private subscr: Subscription;

	imageUrl: string;

	constructor(private overlayService: OverlayService) { }


	ngOnInit()
	{
		this.subscr = this.overlayService.observable.subscribe( (c: Command) => {

			if(c.type === "hide")
			{
				this.imageUrl = null;
			}

			if(c.type !== "image")
			{
				return;
			}

			this.imageUrl = c.data;
		} )
	}



	ngOnDestroy()
	{
		this.subscr.unsubscribe();
	}



	@HostListener('click') click() {
		this.overlayService.hide();
	}
}
