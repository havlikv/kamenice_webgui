import { Component, OnInit } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

@Component({
	selector: 'app-survey',
	templateUrl: './survey.component.html',
	styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit, ControlValueAccessor
{



	constructor() { }

	ngOnInit()
	{
	}



	writeValue(obj: any): void
	{
	}



	registerOnChange(fn: any): void
	{
	}



	registerOnTouched(fn: any): void
	{
	}



	setDisabledState?(isDisabled: boolean): void
	{
	}
}
