import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
	selector: 'app-privacy-policy',
	templateUrl: './privacy-policy.component.html',
	styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent implements OnInit {
	
	/*****Boolean*****/
	isLoggedIn = false

	constructor(
		private titleService: Title
	) { }

	ngOnInit(): void {
		this.titleService.setTitle("TDX Launchpad | Privacy Policy");
		if (localStorage.getItem('_u')) {
			this.isLoggedIn = true;
		}
	}

}
