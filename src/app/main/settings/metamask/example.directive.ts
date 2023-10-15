import {
    AfterContentInit,
    ContentChildren,
    Directive,
    ElementRef,
    Renderer2,
    QueryList
  } from "@angular/core";
  
  @Directive({
    selector: "[example-directive]"
  })
  export class ExampleDirective implements AfterContentInit {
    @ContentChildren("*") elms!: QueryList<unknown>;
  
    constructor(private element: ElementRef, private render: Renderer2) {}
  
    // for any ng-content
    public ngAfterContentInit(): void {}
  }