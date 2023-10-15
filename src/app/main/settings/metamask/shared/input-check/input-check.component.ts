import { Component, Input, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

import { BaseControlValueAccessor } from "../BaseControlValueAccessor";

@Component({
  selector: "input-check",
  templateUrl: "./input-check.component.html",
  styleUrls: ["./input-check.component.css"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputCheckComponent),
      multi: true
    }
  ]
})
export class InputCheckComponent extends BaseControlValueAccessor<any>
  implements ControlValueAccessor {
  @Input() checked = false;
  @Input()  disabled = false;
  @Input() required = false;
  @Input() switch = true; // switch between checkbox or toggle button styles
  @Input() label = "";
  @Input() name = "";

  constructor() {
    super();
  }

  // ControlValueAccessor interface methods // don't forget to use super(): super.parentmethod(value);
  public  writeValue(value: boolean): void {
    this.checked = value;
  }

  // change events from the checkbox
  public onValueChange(): void {
    // update the form
    this.onChange(this.checked);
  }

  // using BaseControlValueAccessor instead
  // onTouched(_?: any): void { }
  // onChange(fn: any): void { console.log(fn);}
  // registerOnChange(fn: any): void { this.onChange = fn; }
  // registerOnTouched(fn: any): void { this.onTouched = fn; }
  // setDisabledState?(isDisabled: boolean): void { this.disabled = isDisabled; }

  onInput(event: any): void {}
  onFocus(event: any): void {}
  onBlurred(event: any): void {}
}