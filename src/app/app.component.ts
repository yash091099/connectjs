import { Component, OnInit } from '@angular/core';
import { CookiesService } from './shared/services/cookies.service';
declare var $: any;
import * as AOS from 'aos';
import { ActivatedRoute } from '@angular/router';
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	title = 'TDX-Launchpad';
	public cookieBox = false;


	constructor(private cookieService: CookiesService, private route: ActivatedRoute) {

	}
	ngOnInit() {
		if (!this.cookieService.get('cookie-box') && window.location.pathname != "/kyc-verification") {
			this.cookieBox = true;
		}
		if (window.location.pathname === "/settings/email") {
			this.saveTempState();
		}



		AOS.init();

		$(document).ready(function () {

			var scrollTop = $(".scrollTop");

			$(window).scroll(function () {
				var topPos = $(this).scrollTop();
				if (topPos > 100) {
					$(scrollTop).css("opacity", "1");

				} else {
					$(scrollTop).css("opacity", "0");
				}

			});
			$(scrollTop).click(function () {
				$('html, body').animate({
					scrollTop: 0
				}, 800);
				return false;

			});
		
		});
	

	}

	saveTempState() {
		let state = {
			url: 'settings/email'
		};
		this.cookieService.setCookie("savedState", JSON.stringify(state), 365);
	}



	acceptCookies() {
		if (!this.cookieService.get('cookie-box')) {
			this.cookieService.setCookie('cookie-box', true, 10*365);
			this.cookieBox = false;
			window.location.reload();
		}
	}



}
