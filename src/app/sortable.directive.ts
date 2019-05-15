import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appSortable]',
})
export class SortableDirective {

  constructor(private el: ElementRef) { }


  @HostListener("click")
  onClick() {
    this.log();
  }

  log(): void {
    console.log("In log().");
  }
}
