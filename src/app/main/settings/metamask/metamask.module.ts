
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DecimalPipe } from "@angular/common";

import { ExampleDirective } from "./example.directive";
import { StepperComponent } from "./shared/stepper/stepper.component";
import { IconComponent } from "./shared/icon/icon.component";
import { ValidatorComponent } from "./shared/validator/validator.component";
import { FloatingLabelComponent } from "./shared/input-floating-label/input-floating-label.component";
import { StepDirective } from "./shared/stepper/stepper.directive";
import { InputCheckComponent } from "./shared/input-check/input-check.component";

@NgModule({
  imports: [BrowserModule, FormsModule, ReactiveFormsModule],
  declarations: [
    ExampleDirective,
    StepperComponent,
    StepDirective,
    IconComponent,
    FloatingLabelComponent,
    ValidatorComponent,
    InputCheckComponent
  ],
  providers: [DecimalPipe],
})
export class MetamaskModule {}