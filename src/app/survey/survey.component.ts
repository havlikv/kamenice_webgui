import { Component, OnInit } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

@Component({
	selector: 'app-survey',
	templateUrl: './survey.component.html',
	styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit
{

	constructor() { }

	ngOnInit()
	{
		console.log("XXX");
	}
}
