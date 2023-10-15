import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LoaderService } from "src/app/shared/services";
import { ReferService } from "./service/refer.service";
import { ToastrService } from "ngx-toastr";
import { Messages } from "src/app/config/message";
import { Constants } from "src/app/config/constant";
import { UpdateReferralTabStatusService } from "./service/update-referral-tab-status.service";
@Component({
	selector: "app-refer",
	templateUrl: "./refer.component.html",
	styleUrls: ["./refer.component.css"],
})
export class ReferComponent implements OnInit {
	/****Varaiable****/
	selectedTab: any;
	selectedCampaignId: any;
	totalEarning: any = 0;
	selectedReferralData:any;
	selectedCampaignType: any;
	
	/****Constant****/
	constants = Messages.CONST_MSG
	selectTabArray = Constants.REFER_SELECTED_TAB

	constructor(
		private loaderService: LoaderService,
		public toasterService: ToastrService,
		private referService: ReferService,
		private router: Router,
		public route: ActivatedRoute,
		private referralTabStatusService: UpdateReferralTabStatusService
	) { }

	ngOnInit(): void {
		this.selectedTab = "refer-earn";
		this.route.params.subscribe((params) => {
			console.log(params)
			if (params?.tab) {

				this.handleTabChage(params?.tab);
			}
		});
		this.getTotalEarnings();
	}

	/**
	 * @description: used to set selected tab data
	 * @param data : selected tab
	 * @param $event 
	 */
	handleTabChage(data, $event?) {
		this.getTotalEarnings();
		this.selectedCampaignId = null
		this.selectedCampaignType = null
		localStorage.setItem('previousTab', this.selectedTab);
		localStorage.setItem('selectedTab', data);
		this.selectedTab = data;
		this.referralTabStatusService.updateReferralTabStatus(this.selectedTab)
	}

	/**
	 * @description: used to get child emitted data
	 * @param data 
	 */
	handleTab(data) {
		console.log(data);
		if (data.valueFor) {
			this.selectedCampaignId = data.valueFor
		}
		if (data.value) {
			this.selectedTab = data.value
		}
		if(data?.campaignType){
			this.selectedCampaignType = data?.campaignType
		}
		console.log(this.selectedTab)
		console.log("handle tab data",data);
	}

	/**
	 * @description: used to get total earnings data
	 */
	getTotalEarnings() {
		// this.loaderService.show();
		this.referService.getTotalEarnings().subscribe(
			(res) => {
				this.loaderService.hide();
				if (res?.error) {
					this.loaderService.hide();
					console.log(res.message, "referral array api error");
					this.toasterService.error(res?.message || this.constants.SOMETHING_WENT_WRONG);
				} else {
					this.totalEarning = res?.data?.usd?.$numberDecimal || 0;
				}
			},
			(error) => {
				this.loaderService.hide();
				console.log(error.error.message, "referral array api error");
			}
		);
	}

	/**
	 * @description: used to get selected tab from emitted child data
	 * @param tab 
	 */
	changeSelectedTab(tab){
		this.selectedTab = tab
	}

	/**
	 * @description: used to get selected referral tab
	 * @param data 
	 */
	changeSelectedReferral(data){
		this.selectedReferralData = data;
	}

	/**
	 * @description: used to get previos page selected tab
	 * @param data 
	 */
	getPreviousPage(data) {
		this.selectedTab = data
		this.selectedCampaignId = null
	}
	
	/**
	 * @description: used to get selected tab value
	 * @param data 
	 */
	getSelectedTabValue(data){
		this.selectedTab = data;
	}

}
