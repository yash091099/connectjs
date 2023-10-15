import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from "@angular/router";
import { Messages } from 'src/app/config/message';
@Component({
	selector: 'app-transactions',
	templateUrl: './transactions.component.html',
	styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

	/*****Variable*****/
	selectedTab: any
	tabData = Messages.CONST_MSG.DEPOSIT;
	
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router
	) { }

	ngOnInit(): void {
		let selectedTabs = localStorage.getItem('selectedTab');

		if (selectedTabs) {
			if (selectedTabs === 'WALLET') {
				this.selectedTab ='usd-wallet'
			} else {
				this.selectedTab='commission-wallet'
			}
		} else {
			
			this.selectedTab = 'usd-wallet'
		}
		console.log(selectedTabs,this.selectedTab)
		localStorage.removeItem('selectedTab')
		this.activatedRoute.params.subscribe((param) => {
			if (param?.data) {
				this.selectedTab = param?.data;
				this.tabData = Messages.CONST_MSG.PURCHASE
			}
		})
	}

	/**
	 * @description: used to set selected tab value
	 * @param data 
	 */
	handleTabChage(data) {
		this.selectedTab = data
	}
	/**
	 * @description: used to go back to wallet
	 */
	backDashboard() {
		this.router.navigate(["/wallet"]);
	}
}
