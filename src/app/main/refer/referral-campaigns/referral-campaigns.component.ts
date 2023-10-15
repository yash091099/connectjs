import { Component, ViewChild, OnInit, EventEmitter, Output, Input, ElementRef, OnDestroy } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { LoaderService } from "src/app/shared/services";
import { ReferService } from "../service/refer.service";
import { ToastrService } from "ngx-toastr";
import { environment } from "src/environments/environment";
import { Constants } from "src/app/config/constant";
import { Messages } from "src/app/config/message";
declare var $: any;

@Component({
	selector: "app-referral-campaigns",
	templateUrl: "./referral-campaigns.component.html",
	styleUrls: ["./referral-campaigns.component.css"],
})

export class ReferralCampaignsComponent implements OnInit, OnDestroy {
	/*******String******/
	selectedTab: any = 'PAGE';
	selectedCampaignType = "PAGE";
	campaignName = "";
	referralErrorMessage = "";
	disableCreateButton: boolean = false;
	disableHandleTabs: boolean = false;

	bannerCode = ''
	bannerImage = ''
	deleteCampaignId = '';

	/*****Pagination*****/
	totalCount = 0;
	count = 0;
	rowsPerPage = 0;
	currentPage = 1;

	totalPageCount = 0;
	totalBannerCount = 0;

	/*****Array*****/
	referralArray: any = [];
	loadingRefferalTableData: boolean = true;
	public hideme = [];

	/*********Variable*********/
	selectedMemberId: any
	bannerName: any;
	public selectedIndex: any;
	seletedReferralLink: any;
	selectedBannerLink: any;
	clientUrlForLandingPage = `${environment.clientUrl}promote/`;
	campaignDetails: any;
	selectedCampaign: any

	/***Constant***/
	copy_link = Constants.copyData.COPY_BANNER_Code
	copiedReferLink = Constants.copyData.COPIED
	constants = Messages.CONST_MSG
	selectCampaignType = Constants.SELECT_CAMPAIGN_TYPE;

	/***EventEmitter***/
	@Output() getSelectedTabEvent = new EventEmitter<any>();
	@ViewChild("addCampaign", { static: true }) campaignNameWhenArrayFilled: ElementRef
	@ViewChild("campaignCreated", { static: true }) campaignCreated: ElementRef
	@Input() item: any;
	@Input() campaignType: any;
	@Output() changeSelectedTab = new EventEmitter<string>();
	@Output() selectedReferralData = new EventEmitter<any>();

	constructor(
		private loaderService: LoaderService,
		public toasterService: ToastrService,
		private modalService: NgbModal,
		private referService: ReferService
	) { }

	ngOnInit(): void {
		window.scroll(0, 0);
		console.log(this.item, "item")
		if (this.item) {
			console.log(this.item, "ggfgwgfwweuwef")
			this.selectedCampaignType = "";
			this.modalService.open(this.campaignNameWhenArrayFilled, { centered: true, size: "md", windowClass: 'create-campaign' });
		}
		if (this.campaignType) {
			console.log("input campaign type", this.campaignType);
			this.selectedTab = this.campaignType
		}
		this.getCampaigns(this.selectedTab);
		this.referralArray = [];
		$(function () {
			$(".fold-table tr.view").on("click", function () {
				if ($(this).hasClass("open")) {
					$(this).removeClass("open").next(".fold").removeClass("open");
				} else {
					$(".fold-table tr.view")
						.removeClass("open")
						.next(".fold")
						.removeClass("open");
					$(this).addClass("open").next(".fold").addClass("open");
				}
			});
		});
	}

	/**
	 * @description: used to set selected tab
	 * @param value : selected tab
	 * @param valueFor : selected data
	 */
	getSelectedTab(value, valueFor?) {
		let data: any = {
			value: value,
			valueFor: valueFor,
			campaignType: this.selectedTab
		}
		console.log(data);
		localStorage.setItem("previousTab", "referral-campaigns");
		this.getSelectedTabEvent.emit(data);
	}

	/**
	 * @description: used to open add campaign popup
	 * @param template : html content
	 */
	openAddCampaignPopup(template) {
		if (this.totalBannerCount || this.totalPageCount) {
			this.selectedCampaignType = this.selectedTab;
		}
		else {
			this.selectedCampaignType = "";
		}
		this.campaignName = '';
		this.modalService.dismissAll();
		this.modalService.open(template, { centered: true, size: "md", windowClass: "create-campaign" });
	}

	/**
	 * @description: used to add referral campaign data
	 */
	addReferralCampaign() {
		if (!this.campaignName) {
			this.referralErrorMessage = this.constants.CMAPAIGN_NAME_REQUIRED;
			return;
		}
		if (this.referralErrorMessage) {
			return;
		}
		let dataToSend: any = {
			type: this.selectedCampaignType,
			name: this.campaignName
		};
		console.log('_+_+_+_+_+', dataToSend);
		this.selectedTab = this.selectedCampaignType;
		this.loaderService.show();
		this.disableCreateButton = true;

		this.referService.createCampaign(dataToSend).subscribe(
			(res) => {
				this.loaderService.hide();
				if (res?.error) {

					this.loaderService.hide();
					this.disableCreateButton = false;

					console.log(res.message, "referral array api error");
					this.toasterService.error(res?.message || this.constants.NAME_ALREADY_EXIST);
				} else {
					this.disableCreateButton = false;

					this.getCampaigns(this.selectedTab)
					this.modalService.dismissAll();
					let openModal = this.modalService.open(this.campaignCreated, { centered: true, size: "md", windowClass: 'sucess-popup' });
					setTimeout(function () {
						openModal.close()
					}, 3000);
				}
			},
			(error) => {
				this.disableCreateButton = false;

				this.loaderService.hide();
				this.toasterService.error(error?.error?.message || this.constants.NAME_ALREADY_EXIST);
			}
		);
	}

	/**
	 * @description: used to close modal and reset variables
	 */
	closePopup() {
		this.selectedMemberId = null
		this.referralErrorMessage = "";
		this.modalService.dismissAll();
	}

	/**
	 * @description: used to set selected tab data
	 * @param data : selected tab
	 */
	handleTabChage(data) {
		this.hideme = [];
		this.selectedTab = data;
		this.selectedCampaignType = data;
		this.currentPage = 1;
		this.getCampaigns(data)
	}

	/**
	 * @description: used to copy data
	 * @param data : banner code
	 * @param id : selected member id 
	 */
	copyToClipboard(data, id) {
		this.selectedBannerLink = id
		console.log(this.selectedMemberId, "memeber ID")
		if (this.selectedMemberId) {
			data = data.replace('SPONSOR_ID', this.selectedMemberId)
		}
		if (data) {
			setTimeout(() => {
				this.selectedBannerLink = null
			}, 3000);
			navigator.clipboard.writeText(data).then(() => {
				console.error(' copy data: ', data);
			}, (err) => {
				console.error('Could not copy data: ', err);
			});
		}
	}

	/**
	 * @description: used to copy referral link
	 * @param data 
	 * @param id 
	 * @param pageUrl 
	 */
	copyRefralLink(data, id, pageUrl = null) {
		this.seletedReferralLink = id
		if (data) {
			setTimeout(() => {
				this.seletedReferralLink = null;
			}, 3000);
			navigator.clipboard.writeText(`${this.clientUrlForLandingPage + pageUrl}/${data}`).then(() => {
				console.error(' copy data: ', data);
			}, (err) => {
				console.error('Could not copy data: ', err);
			});
		}
	}

	/**
	 * @description: used to get campaign listing
	 * @param selectedTab: selected tab 
	 */
	getCampaigns(selectedTab) {
		this.loadingRefferalTableData = true
		let dataToSend: any = {
			type: selectedTab,
			currentPage: this.currentPage
		}
		this.loaderService.show();
		this.disableHandleTabs = true;
		this.referService.getlinkCampaignData(dataToSend).subscribe(
			(res) => {
				this.loaderService.hide();
				if (res?.error) {
					this.loaderService.hide();
					this.disableHandleTabs = false;

					console.log(res.message, "referral array api error");
					this.toasterService.error(res?.message || this.constants.SOMETHING_WENT_WRONG);
				} else {
					this.disableHandleTabs = false;

					this.referralArray = res.data?.campaignDetails || [];
					if (selectedTab == this.selectCampaignType.PAGE) {
						this.totalPageCount = this.referralArray.length
					} else {
						this.totalBannerCount = this.referralArray.length
					}
					if (this.referralArray.length == 0 && this.count < 1) {
						this.getCampaigns('BANNER');
						this.count = this.count + 1;
						this.selectedTab = 'BANNER';
					}
					this.totalCount = res.data?.totalCount;
					this.rowsPerPage = res.data?.rowsPerPage;
					this.loadingRefferalTableData = false;
				}
				console.log(this.referralArray.length, "referral array length")
			},
			(error) => {
				this.disableHandleTabs = false;

				this.loadingRefferalTableData = false;
				this.loaderService.hide();
			}
		);
	}

	/**
	 * @description: on change function of pagination
	 * @param pageNumber : selected page number
	 */
	pageChanged(pageNumber) {
		this.currentPage = pageNumber;
		this.getCampaigns(this.selectedTab)
	}

	/**
	 * @description: used to get referral array details
	 * @param id : campaign id
	 * @param index : selected index
	 */
	getReferralArrayDetails(id, index, content?, referral?) {
		this.loadingRefferalTableData = true
		if (!content) {
			if (this.hideme[this.selectedIndex] && (this.selectedIndex || this.selectedIndex == 0)) {
				this.hideme[this.selectedIndex] = !this.hideme[this.selectedIndex];
			}
			this.hideme[index] = true;
			this.selectedIndex = index;
		}

		let dataToSend: any = {
			campaignId: id
		}
		// this.loaderService.show();
		this.referService.getReferralArrayDetails(dataToSend).subscribe(
			(res) => {
				this.loaderService.hide();
				if (res?.error) {
					this.loaderService.hide();
					this.toasterService.error(res?.message || this.constants.SOMETHING_WENT_WRONG);
				} else {
					if (content) {
						this.campaignDetails = res?.data
						this.selectedCampaign = referral
						this.openResponsiveTable(content)
					} else {
						this.referralArray[index].details = res.data;
					}
					this.loadingRefferalTableData = false
				}
			},
			(error) => {
				this.loadingRefferalTableData = false
				this.loaderService.hide();
			}
		);
	}

	/**
	 * @description: used to delete campaign
	 * @param content : delete modal content
	 * @param id : campaign id
	 */
	deleteCampaign(content, id) {
		this.deleteCampaignId = id;
		this.modalService.open(content, { centered: true, size: "sm", windowClass: 'delete-popup' });
	}

	/**
	 * @description: used to delete campaign
	 */
	deletePopUP() {
		let dataToSend: any = {
			campaignId: this.deleteCampaignId
		}
		// this.loaderService.show();
		this.referService.delete(dataToSend).subscribe(
			(res) => {
				this.loaderService.hide();
				if (res?.error) {
					this.loaderService.hide();
					this.toasterService.error(res?.message || this.constants.SOMETHING_WENT_WRONG);
				} else {
					this.getCampaigns(this.selectedTab);
					this.closePopup();
				}
			},
			(error) => {
				this.loaderService.hide();
			}
		);

	}

	/**
	 * @description: used to check campaign name vaidation
	 * @returns 
	 */
	checkCampaignName() {
		if (this.campaignName.trim().length > 40) {
			this.referralErrorMessage = this.constants.CAMPAIGN_SHOULD_NOT_GREATER_THAN_40;
			return false;
		} else {
			this.referralErrorMessage = ""
		}
	}

	/**
	 * @description: used to set the selected campaign type
	 * @param data : selected tab
	 */
	handleCampaignType(data) {
		if (this.selectedCampaignType != data) {
			this.campaignName = '';
			this.referralErrorMessage = "";
		}
		this.selectedCampaignType = data;

	}
	/**
	 * @description: used to emit selected referal data
	 * @param tab 
	 * @param referralData 
	 * @param bannerName 
	 */
	handleMainTab(tab, referralData, bannerName) {
		console.log("changing tab data", tab)
		this.changeSelectedTab.emit(tab);
		referralData.bannerName = bannerName;
		this.selectedReferralData.emit(referralData);
	}

	ngOnDestroy(): void {
		this.closePopup();
	}

	/**
	 * @description: used to open campaign details table for mobile devices
	 * @param content1 
	 */
	openResponsiveTable(content1) {
		this.modalService.open(content1, { centered: true, windowClass: "resposive-popup" });
	}
}
