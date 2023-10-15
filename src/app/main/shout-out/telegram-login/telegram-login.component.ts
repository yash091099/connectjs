import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

@Component({
	selector: 'app-telegram-login',
	templateUrl: './telegram-login.component.html',
	styleUrls: ['./telegram-login.component.css']
})
export class TelegramLoginComponent implements OnInit {

	/******EventEmitter****/
	@ViewChild('script', { static: true }) script: ElementRef;
	@Output() public found = new EventEmitter();

	constructor() { }

	ngOnInit(): void {
		window['onTelegramAuth'] = loginData => this.onTelegramAuth(loginData);
	}

	onTelegramAuth(user) {
		console.log(user, "user")
		this.found.emit(user);
	}
	convertToScript() {
		console.log("script")
		const element = this.script.nativeElement;
		const script = document.createElement('script');
		script.src = 'https://telegram.org/js/telegram-widget.js?21';
		script.setAttribute('data-telegram-login', 'tdx_staging_bot');
		script.setAttribute('data-size', 'medium');
		script.setAttribute('id', 'telegramButton');
		script.setAttribute('data-radius', '5');
		script.setAttribute('data-onauth', 'onTelegramAuth(user)');
		script.setAttribute('data-request-access', 'write');
		console.log(script)
		element.parentElement.replaceChild(script, element);
	}
	
	// convertToScript() {
	// 	console.log("script")
	// 	const element = this.script.nativeElement;
	// 	const script = document.createElement('script');
	// 	script.src = 'https://telegram.org/js/telegram-widget.js?22';
	// 	script.setAttribute('data-telegram-login', 'Social_Shoutout_bot');
	// 	script.setAttribute('data-size', 'medium');
	// 	script.setAttribute('id', 'telegramButton');
	// 	script.setAttribute('data-radius', '5');
	// 	script.setAttribute('data-onauth', 'onTelegramAuth(user)');
	// 	script.setAttribute('data-request-access', 'write');
	// 	console.log(script)
	// 	element.parentElement.replaceChild(script, element);
	// }


	ngAfterViewInit() {
		console.log("start")
		this.convertToScript();
	}

	clickTelegramButton() {
		let telegramButton = document.getElementById('telegramButton');
		console.log("click")
		telegramButton.click();
	}

	getClick() {
		console.log("click")
		this.clickTelegramButton()
	}


}
