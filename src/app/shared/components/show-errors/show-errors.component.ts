import { Component, OnInit, Input } from '@angular/core';
import { AbstractControlDirective, AbstractControl } from '@angular/forms';
@Component({
	selector: 'app-show-errors',
	templateUrl: './show-errors.component.html',
	styleUrls: ['./show-errors.component.css']
})
export class ShowErrorsComponent implements OnInit {

	private static readonly errorMessages = {
		'required': (param?) => `${param} is required`,
		'email': () => 'Please enter a valid email',
		'minlength': (params) => 'The min number of characters is ' + params.requiredLength,
		'maxlength': (params) => 'The max allowed number of characters is ' + params.requiredLength,
		'pattern': (params) => 'Please Enter a valid value',
		'min': (params) => `Atleast ${params.min} is required in this field`,
		'max': (params) => `Max value can be ${params.max} only`,
		'ngxEditor': (params) => `The max allowed number of characters is ${params.allowedLength} and curent characters are ${params.textLength}`,
		'whitespace': () => 'Please enter valid input',
		'forbiddenEmail': () => 'Please enter a valid email!',
	};

	@Input()
	private control: AbstractControlDirective | AbstractControl;
	@Input() fname = "";
	constructor() { }

	ngOnInit() {
	}
	/**
	 * @description: used to set whether to show errors or not
	 */
	shouldShowErrors(): boolean {
		return this.control &&
			this.control.errors &&
			(this.control.dirty || this.control.touched);
	}

	/**
	 * @description: used to set the list of errors
	 */
	listOfErrors(): string[] {
		let arr = Object.keys(this.control.errors);
		let msg = this.getMessage(arr[0], this.control.errors[arr[0]]);
		let array = [];
		array.push(msg);
		return array;
	}

	/**
	 * @description: used to get the error validation message
	 * @param type 
	 * @param params 
	 * @returns 
	 */
	private getMessage(type: string, params: any) {
		if(type == "required"){
			if(this.fname){
			  params = this.fname;
			}else{
			  params = 'This field';
			  } 
		  }
		
		return ShowErrorsComponent.errorMessages[type](params);
	}
}
