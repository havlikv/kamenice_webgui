import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Survey } from './domain/survey';
import { SurveyService } from './services/survey.service';



@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent
{

	constructor()
	{
	}
}
