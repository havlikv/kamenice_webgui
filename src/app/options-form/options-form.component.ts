import { Component, OnInit } from '@angular/core';
import { Option } from '../domain/option';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Utils } from '../utils/utils';



@Component({
	selector: 'app-options-form',
	templateUrl: './options-form.component.html',
	styleUrls: ['./options-form.component.css']
})
export class OptionsFormComponent implements OnInit
{

	newOption: Option = {
		name: "Option1",
		description: "Descr.",
		images: []
	};


	formGroup: FormGroup = new FormGroup({
		option: new FormControl("")
	});


	formGroups: FormGroup[] = [];



	constructor()
	{

	}

	ngOnInit()
	{
		let x = this.formGroup.get("option");

		x.setValue(this.newOption);
	}

	

	edit(i: number): void
	{
		let option: Option = this.formGroups[i].value.option;

		this.formGroups[i].get("option").setValue(option);

		this.formGroups[i].markAsPristine();
	}



	delete(i: number)
	{
		this.formGroups.splice(i, 1);
	}
}
