import { Directive, ElementRef, Renderer2 } from "@angular/core";
/* ------------------------------------------------------------------------ *

* ------------------------------------------------------------------------ */
@Directive({
  selector: "[step]"
})
export class StepDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}
}
