
/* ------------------------------------------------------------------------ *
    ValidatorComponent:
        accepts a form control, @Input control, and displays a validation message
        accepts a formGroup, @Input formGroup, and displays a validation message

    handles all HTML5's built-in validator errors: https://angular.io/api/forms/Validators
    static min(min: number): ValidatorFn
    static max(max: number): ValidatorFn
    static required(control: AbstractControl): ValidationErrors | null
    static requiredTrue(control: AbstractControl): ValidationErrors | null
    static email(control: AbstractControl): ValidationErrors | null
    static minLength(minLength: number): ValidatorFn
    static maxLength(maxLength: number): ValidatorFn
    static pattern(pattern: string | RegExp): ValidatorFn
    static nullValidator(control: AbstractControl): ValidationErrors | null
    static compose(validators: ValidatorFn[]): ValidatorFn | null
    static composeAsync(validators: AsyncValidatorFn[]): AsyncValidatorFn | null
* ------------------------------------------------------------------------ */

import { Component, OnInit, Input, HostBinding } from "@angular/core";
import { AbstractControl, ValidationErrors, FormGroup } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "input-validation",
  templateUrl: "./validator.component.html",
  styleUrls: ["./validator.component.css"]
})
export class ValidatorComponent implements OnInit {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  @HostBinding("class.disabled") disabled: boolean = false;
  @Input() control: AbstractControl = null;
  @Input() formGroup: FormGroup = null;

  public validation = { message: "", valid: false };
  @Input() helperText: string;
  public hintMessage: string;
  @Input() successText: string;
  @Input() disabledText: string;

  constructor() {}

  public ngOnInit(): void {
    this.setup();
    this.hintMessage = this.helperText ? this.helperText : "";
  }

  public setup(): void {
    if (this.control) {
      if (this.control.disabled) {
        this.disabled = true;
      }
      this.control.valueChanges
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(data => {
          // disabled messaging
          this.disabled = this.control.disabled ? true : false;
          // error messaging
          if (this.control.errors) {
            this.errorType(this.control.errors);
            this.validation["valid"] = false;
          } else {
            this.validation = { message: "", valid: true };
          }
          // success messaging
          if (this.successText && !this.control.errors && this.control.valid) {
            this.hintMessage = data === "" ? this.helperText : this.successText;
          }
        });
    }

    if (this.formGroup) {
      if (this.formGroup.disabled) {
        this.disabled = true;
      }
      this.formGroup.statusChanges
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(data => {
          this.disabled = this.formGroup.disabled ? true : false;

          // console.log(this.formGroup.errors);
          if (this.formGroup.errors) {
            this.validation = {
              message: this.formGroup.errors["message"],
              valid: false
            };
          } else {
            this.validation = { message: "", valid: true };
          }
          // console.log(this.validation.message);
        });
    }
  }

  public errorType(error: ValidationErrors) {
    // console.log(Object.keys(error));
    switch (Object.keys(error)[0]) {
      case "min":
        this.min(error);
        break;
      case "max":
        this.max(error);
        break;
      case "required":
        this.required(error);
        break;
      case "requiredTrue":
        this.requiredTrue(error);
        break;
      case "email":
        this.email(error);
        break;
      case "minlength":
        this.minLength(error);
        break;
      case "maxlength":
        this.maxLength(error);
        break;
      case "nullValidator":
        this.nullValidator(error);
        break;
      case "pattern":
        this.pattern(error);
        break;
      case "nullValidator":
        this.nullValidator(error);
        break;

      // custom validators
      case "duplicate":
        this.duplicate(error);
        break; // repeatable feilds like specialities
      case "alpha":
        this.alphaOnly(error);
        break; // repeatable feilds like specialities
      case "number":
        this.numberOnly(error);
        break; // repeatable feilds like specialities
      case "currency":
        this.currencyOnly(error);
        break; // repeatable feilds like specialities
      case "emailDomainMismatch":
        this.emailDomainMismatch(error);
        break; // emails checked against domain

      // the else statement
      default:
        this.default();
        break;
    }
  }

  public default() {
    this.validation["message"] = "Check values";
  }

  // https://angular.io/api/forms/Validators#min
  public min(error: ValidationErrors) {
    // {min: {min: 3, actual: 2}}
    // this.control.errors.min.min
    // this.control.errors.min.actual
    this.validation["message"] = `${this.control.errors["min"].min} required`;
  }

  public max(error: ValidationErrors) {
    // {max: {max: 15, actual: 16}}
    // this.control.errors.max.max
    // this.control.errors.max.actual
    const overage =
      this.control.errors["max"].actual - this.control.errors["max"].max;
    this.validation["message"] = `${overage} over`;
  }

  public minLength(error: ValidationErrors) {
    const more =
      this.control.errors["minlength"].requiredLength -
      this.control.errors["minlength"].actualLength;
    this.validation["message"] = `At least ${more} more characters`;
  }

  public maxLength(error: ValidationErrors) {
    const overage =
      this.control.errors["maxlength"].actualLength -
      this.control.errors["maxlength"].requiredLength;
    this.validation["message"] = `Remove ${overage} characters`;
  }

  public required(error: ValidationErrors) {
    this.validation["message"] = "Required";
  }

  // https://angular.io/api/forms/Validators#requiredtrue
  public requiredTrue(error: ValidationErrors) {
    this.validation["message"] = "Required";
  }

  public email(error: ValidationErrors) {
    this.validation["message"] = "Not a valid email address";
  }

  public nullValidator(error: ValidationErrors) {
    this.validation["message"] = "Required";
  }

  public pattern(error: ValidationErrors) {
    this.validation["message"] = "This is invalid";
  }

  /* ------------------------------------------------------------------------ *
        CUSTOM VALIDATORS
    * ------------------------------------------------------------------------ */
  public duplicate(error: ValidationErrors) {
    this.validation["message"] = "Duplicate values";
  }
  public alphaOnly(error: ValidationErrors) {
    this.validation["message"] = "Numbers are invalid";
  }
  public numberOnly(error: ValidationErrors) {
    this.validation["message"] = "Numbers only";
  }
  public currencyOnly(error: ValidationErrors) {
    this.validation["message"] = "Only numbers, $, and .";
  }
  public emailDomainMismatch(error: ValidationErrors) {
    console.log("Email must match domain");
    this.validation["message"] = "Email must match domain";
  }

  // when we execute unsubscribe
  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}