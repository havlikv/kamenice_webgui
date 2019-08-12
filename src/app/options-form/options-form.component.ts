import { Component, OnInit } from '@angular/core';
import { Option } from '../domain/Option';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';



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
		imageUrl: null,
		file: null,
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



	new(): void
	{
		let option = this.formGroup.value.option;
		option.imageUrl = window.URL.createObjectURL(option.file);

		let x = new FormGroup({
			option: new FormControl("")
		});
		x.get("option").setValue(option);
		this.formGroups.push(x);

		this.formGroup.reset();
	}



	edit(i: number): void
	{
		let option: Option = this.formGroups[i].value.option;

		option.imageUrl =  window.URL.createObjectURL(option.file);

		this.formGroups[i].get("option").setValue(option);

		this.formGroups[i].markAsPristine();
	}



	delete(i: number)
	{
		this.formGroups.splice(i, 1);
	}
}
