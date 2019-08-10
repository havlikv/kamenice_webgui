import { Injectable } from '@angular/core';
import { Subject } from "rxjs";



export interface Command
{
	type: string;
	data: string;
}



@Injectable({
	providedIn: 'root'
})
export class OverlayService
{

	private subject = new Subject<Command>();
	public observable = this.subject.asObservable();


	constructor() { }


	showImage(imageUrl: string): void
	{
		this.subject.next( { type: "image", data: imageUrl })
	}



	hide()
	{
		this.subject.next( { type: "hide", data: null })
	}
}
