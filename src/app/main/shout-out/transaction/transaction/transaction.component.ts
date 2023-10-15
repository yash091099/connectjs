import { Component, OnInit } from '@angular/core';
import { Constants } from 'src/app/config/constant';
@Component({
	selector: 'app-transaction',
	templateUrl: './transaction.component.html',
	styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {

	/*********Constant*********/
	constants = Constants.TABS;
	/****Variable*****/
	selectedTab: any;

	constructor() { }

	ngOnInit(): void {
		let selectTab = localStorage.getItem('selectTab')
		this.selectedTab = selectTab || this.constants.TRANSACTIONS
		localStorage.removeItem('selectTab');
	}

	/**
	 * @description: used to set selected tab value
	 * @param tab : selected tab value
	 */
	selectTab(tab) {
		localStorage.setItem('selectTab', tab);
		this.selectedTab = tab;
	}
}
