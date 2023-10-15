import { Component, OnInit } from '@angular/core';
import { MessageState } from './message-model';
import { MessageService } from './message.service';
import { Subscription } from 'rxjs';
@Component({
	selector: 'app-messages',
	templateUrl: './messages.component.html',
	styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
	/**String */
	public message = "";
	/**Boolean */
	public showErrorMessage = false;
	public showSuccessMessage = false;
	/**Subscription */
	subscription: Subscription;
	
	constructor(private messageService: MessageService) { }

	ngOnInit(): void {
		this.subscription = this.messageService.messageState
			.subscribe((state: MessageState) => {
				if (state.type == 'SUCCESS') {
					this.successMessage(state.message);
				} else if (state.type == 'ERROR') {
					this.errorMessage(state.message);
				}
			});
	}
	/**
	 * @description: used to set the success message
	 * @param message 
	 */
	successMessage(message) {
		this.showErrorMessage = false;
		this.showSuccessMessage = true;
		this.message = message;
		let that = this;
		setTimeout(function () {
			that.showErrorMessage = false;
			that.showSuccessMessage = false;
			this.message = "";
		}, 3000);
	}
	/**
	 * @description: used to set the error message
	 * @param message 
	 */
	errorMessage(message) {
		this.showErrorMessage = true;
		this.showSuccessMessage = false;
		this.message = message;
	}

}