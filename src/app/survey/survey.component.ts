import { Component, OnInit, ViewChild, Inject, ViewChildren, QueryList } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SurveyService, SURVEY_SERVICE_INJTOKEN } from '../services/survey.service';
import { Survey } from "../domain/survey";
import { throwError } from 'rxjs';
import { Router } from "@angular/router";
import { Option } from '../domain/option';
import { switchMap } from 'rxjs/operators';
import { Utils } from '../utils/utils';
import { OptionFormComponent } from '../option-form/option-form.component';



@Component({
	selector: 'app-survey',
	templateUrl: './survey.component.html',
	styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit
{
	errorMessage: string = null;

	surveyFormGroup: FormGroup;

	surveyId: number;

	newOption: Option = {
		id: null,
		name: "Option1",
		description: "Descr.",
		images: []
	};


	optionFormGroup: FormGroup;

	@ViewChild(OptionFormComponent)	optionFormGroupComp: OptionFormComponent;

	optionFormGroups: FormGroup[] = [];

	@ViewChildren(OptionFormComponent) optionFormGroupComps: QueryList<OptionFormComponent>; // XXX All, including the first one, which is used for creating.



	constructor(private route: ActivatedRoute, @Inject(SURVEY_SERVICE_INJTOKEN) private surveyService: SurveyService, private router: Router)
	{
	}



	ngOnInit()
	{
		this.surveyFormGroup = new FormGroup({
			survey: new FormControl("")
		});


		this.optionFormGroup = new FormGroup({
			option: new FormControl("")
		});

		this.optionFormGroup.get("option").setValue(this.newOption);


		this.route.url.pipe(switchMap(
			(urlSegments) =>
			{
				this.errorMessage = null;

				if (urlSegments.length == 0)
				{
					return throwError("Bad URL.");
				}
				else
				{
					this.surveyId = +urlSegments[urlSegments.length - 1].path;

					return this.surveyService.getSurveyById(this.surveyId);
				}
			}
		),
			switchMap(
				(survey: Survey) =>
				{
					this.surveyFormGroup.setValue({
						"survey": survey
					});
					return this.surveyService.getOptions(this.surveyId);
				}
			))
			.subscribe(
				(options: Option[]) =>
				{
					this.setupOptions(options);
				},
				(x) =>  {
					this.errorMessage = x;
				}
			);
	}



	private loadSurvey(id: number): void
	{
		this.surveyService.getSurveyById(id).subscribe(
			(survey) =>
			{
				this.surveyFormGroup.setValue({
					"survey": survey
				});

				this.surveyFormGroup.markAsPristine();
			},
			(x) =>
			{
				this.errorMessage = "Cannot resolve.";
			}

		);
	}



	updateSurvey(): void
	{
		const survey: Survey = this.surveyFormGroup.get("survey").value;
		this.surveyService.updateSurvey(survey).subscribe(null, null,
			() =>
			{
				this.loadSurvey(survey.id);
			}
		)
	}



	createOption(): void
	{
		let option = this.optionFormGroup.value.option;

		const images = option.images;

		let index = 0;

		const comp = this;

		let createImages = function(optionId: number) {

			if(! Utils.indexWithin(images, index))
			{
				comp.optionFormGroupComp.reset();

				comp.loadOptions(comp.surveyId);

				return;
			}

			const image = images[index];
			index++;

			comp.surveyService.createImage(optionId, image, index).subscribe(
				() => createImages(optionId),
				null,
				null
			);
		};

		this.surveyService.createOption(this.surveyId, option).subscribe(
			(optionId) => {
				createImages(optionId);
			}
		);
	}



	updateOption(i: number): void
	{
		let option: Option = this.optionFormGroups[i].value.option;

		const optionFormGroupComp = this.optionFormGroupComps.toArray()[i+1];
		const imagesIdsToDelete = optionFormGroupComp.imagesIdsTodelete;

		const images = option.images;

		const comp = this;

		let deleteIndex = 0;

		let imageIndex = 0;

		function doWork()
		{
			let deletingImages = Utils.indexWithin(imagesIdsToDelete, deleteIndex);
			if(deletingImages)
			{
				const imageIdToDelete = imagesIdsToDelete[deleteIndex];
				deleteIndex++;

				comp.surveyService.deleteImage(imageIdToDelete).subscribe(
					() => {
						doWork();
					},
					null,
					null
				)
			}
			else
			{
				if(!images)
				{
					return;
				}

				if(! Utils.indexWithin(images, imageIndex))
				{
					comp.optionFormGroupComp.reset();

					comp.loadOptions(comp.surveyId);

					return;
				}

				const image = images[imageIndex];
				imageIndex++;

				if( Utils.isUndefOrNull(image.id) )
				{
					comp.surveyService.createImage(option.id, image, imageIndex).subscribe(
						() => doWork(),
						null,
						null
					);
				}
				else
				{
					comp.surveyService.updateImageSeq(image.id, imageIndex).subscribe(
						() => doWork(),
						null,
						null
					);
				}
			}

		}


		this.surveyService.updateOption(this.surveyId, option).subscribe(
			null, null,
			() => {
				doWork();
			}
		);
	}



	deleteOption(i: number): void
	{
		this.surveyService.deleteOption(this.surveyId, i).subscribe(
			null, null,
			() => {
				this.loadOptions(this.surveyId);
			}
		);
	}



	loadOptions(surveyId: number)
	{
		this.surveyService.getOptions(surveyId).subscribe(
			(options: Option[]) => {
				this.setupOptions(options);
			}
		)
	}



	setupOptions(options: Option[])
	{
		this.optionFormGroups = [];

		for (const option of options)
		{
			let x = new FormGroup({
				option: new FormControl("")
			});
			x.setValue({
				option: option
			})
			this.optionFormGroups.push(x);
		}
	}

}
