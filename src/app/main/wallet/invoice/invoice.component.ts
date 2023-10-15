import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constants } from 'src/app/config/constant';
import { HelperService } from 'src/app/shared/services';

@Component({
	selector: 'app-invoice',
	templateUrl: './invoice.component.html',
	styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {

	/****Variable*****/
	deposit = null;
	purchase = null;
	startup = null;
	userName = null;
	email = null;
	/****Constants*****/
	paymode = Constants.PAYMODE

	constructor(
		private activatedRoute: ActivatedRoute,
		private helperService: HelperService) { }

	ngOnInit(): void {
		this.deposit = this.activatedRoute.snapshot.queryParamMap.get('deposit');
		this.purchase = this.activatedRoute.snapshot.queryParamMap.get('purchase');
		this.startup = this.activatedRoute.snapshot.queryParamMap.get('startup');
		if (this.deposit != null) {
			this.deposit = JSON.parse(this.deposit);
		} else if (this.startup != null) {
			this.startup = JSON.parse(this.startup);
		} else {
			this.purchase = JSON.parse(this.purchase);
		}
		this.userName = JSON.parse(this.helperService.user).userName;
		this.email = JSON.parse(this.helperService.user).email;
	}

}
