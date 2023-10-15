
import {
  Component,
  Input,
  Renderer2,
  ElementRef,
  AfterViewInit,
  ViewChild,
  OnChanges
} from "@angular/core";

@Component({
  selector: "stepper",
  templateUrl: "./stepper.component.html",
  styleUrls: ["./stepper.component.css"]
})
export class StepperComponent implements AfterViewInit, OnChanges {
  private _viewInit = false;
  @ViewChild("container") container: ElementRef;
  @Input() step: number = 0;
  @Input() isSubmitting = false;
  public sections = [];

  constructor(private render: Renderer2, private el: ElementRef) {}

  public ngOnChanges() {
    if (this._viewInit) {
      this.sections = this.container.nativeElement.querySelectorAll("section");
      this.moveStep(this.step);
    }
  }

  public ngAfterViewInit() {
    this._viewInit = true;
    this.sections = this.container.nativeElement.querySelectorAll("section");
    this.moveStep(this.step);
  }

  /* ------------------------------------------------------------------------ *
        programatically handle .active
    * ------------------------------------------------------------------------ */
  public moveStep(step?: number) {
    // remove all .active classes
    this.sections.forEach(function(element) {
      element.classList.remove("stepper__active");
    });

    // activate the active step
    this.render.addClass(this.sections[step], "stepper__active");

    this.updateHeight();
  }

  /* ------------------------------------------------------------------------ *
        recalculate .container height
        for it's abso-posish'ed.active content
    * ------------------------------------------------------------------------ */
  public updateHeight() {
    // get height of .active + 35px + 35px of padding
    if (this.container) {
      this.sections = this.container.nativeElement.querySelectorAll("section");
      const content: number = this.sections[this.step].offsetHeight;
      const padding: number = 70;
      // make .container the total height
      this.render.setStyle(
        this.el.nativeElement.querySelector(".stepper__container"),
        "max-height",
        `${content + padding}px`
      );
    }
  }
}