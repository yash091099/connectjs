import { AbstractControl } from "@angular/forms";

function noWhitespaceValidator(control: AbstractControl) {

	
	const isWhitespace = (control.value )?.toString().trim().length === 0;
	const isValid = !isWhitespace;
	return isValid ? null : { 'whitespace': true };
}

export default noWhitespaceValidator; 