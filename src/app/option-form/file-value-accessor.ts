import { Directive, HostListener, Renderer2, ElementRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';



@Directive({
	selector: 'input[type=file]',
	providers: [
		{ provide: NG_VALUE_ACCESSOR, useExisting: FileValueAccessor, multi: true }
	]
})
export class FileValueAccessor implements ControlValueAccessor
{

	private changedFns = new Array<(value) => void>();
	private touchedFns = new Array<() => void>();


	constructor(private _renderer: Renderer2, private _elementRef: ElementRef)
	{
	}



	@HostListener("change", ["$event.target.files[0]"]) onChange(file: File): void
	{
		this.changedFns.forEach( (f) => f(file));
	}



	@HostListener("blur") onTouched(): void
	{
		this.touchedFns.forEach( (f) => f());
	}


	writeValue(value: any)
	{
		this._renderer.setProperty(this._elementRef.nativeElement, "value", null);
	}



	registerOnChange(fn: (x: any) => void)
	{
		this.changedFns.push(fn);
	}



	registerOnTouched(fn: () => void)
	{
		this,this.touchedFns.push(fn);
	}
}
