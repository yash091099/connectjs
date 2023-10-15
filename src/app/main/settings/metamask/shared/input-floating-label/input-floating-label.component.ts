
import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  ElementRef,
  Renderer2,
  OnInit,
  ChangeDetectorRef
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { DecimalPipe, DatePipe } from "@angular/common";

@Component({
  selector: "input-floating-label",
  templateUrl: "./input-floating-label.component.html",
  styleUrls: ["./input-floating-label.component.css"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FloatingLabelComponent),
      multi: true
    },
    DatePipe
  ]
})
export class FloatingLabelComponent implements ControlValueAccessor, OnInit {
  @Input("label") label: string = "";
  @Input("type") type: string = "text";
  @Input("name") name: string = "";
  @Input("usd") usd: boolean = false;
  @Input("time") time: string;
  @Input("inputmode") inputmode: string = "";
  @Input("disabled") disabled: boolean = false;
  @Input("required") required: boolean = false;
  @Input("autocomplete") autocomplete: string = "off";
  @Input("maxLength") maxLength: number = 10000;
  @Input("value") value: string | null = null; // gets inherited from the form control

  // prepended / appended icons (or button if 'btn')
  @Input() append: string;
  @Input() prepend: string;
  // icon/button click events
  @Output() prependClick: EventEmitter<boolean> = new EventEmitter();
  @Output() appendClick: EventEmitter<boolean> = new EventEmitter();

  // toggle floating label position
  public float = false;

  constructor(
    private decimalPipe: DecimalPipe,
    private datePipe: DatePipe,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private eRef: ElementRef
  ) {}

  public ngOnInit() {
    this.float = this.value ? true : false;
  }

  // required ControlValueAccessor interface methods
  public writeValue(val: string) {
    this.value = val ? val : "";
    this.float =
      this.value !== "" || this.type === "date" || this.type === "time"
        ? true
        : false; // for autocomplete values added onload
  }

  public onInput(event: any) {
    const val = (event.target as HTMLInputElement).value;

    // currency formatted strings
    if (this.usd) {
      const inputElement = this.eRef.nativeElement.querySelectorAll(
        ".floating-label__input"
      )[0];
      const invalids = new RegExp("[^0-9]", "g"); // anything NOT in brackets
      const numeric = String(val).replace(invalids, "");
      // format the number (add commas)
      this.value = this.decimalPipe.transform(numeric, "1.0", "en-US");
      // set the native input with the formatted value
      this.renderer.setProperty(inputElement, "value", this.value);
    } else if (this.time) {
      // force time formatted strings when time=true
      const inputElement = this.eRef.nativeElement.querySelectorAll(
        ".floating-label__input"
      )[0];
      const invalids = new RegExp("[^0-9:]{1,6}", "g");
      this.value = String(val).replace(invalids, "");
      this.renderer.setProperty(inputElement, "value", this.value);
    } else {
      this.value = val.trim();
    }
    this.onChange(this.value); // this is what sets the control/form value
    this.cdr.detectChanges();
  }
  public onFocus() {
    this.float = true;
    this.cdr.detectChanges();
  }
  public onBlurred() {
    this.onTouched();
    this.float =
      this.value !== "" || this.type === "date" || this.type === "time"
        ? true
        : false;
    this.cdr.detectChanges();
  }
  public onChange: (value: string) => void;
  public onTouched(_?: any) {}
  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  public onAppendClick(): void {
    this.appendClick.emit(true);
  }
  public onPrependClick(): void {
    this.prependClick.emit(true);
  }
}