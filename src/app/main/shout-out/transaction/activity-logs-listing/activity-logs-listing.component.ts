import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Messages } from 'src/app/config/message';
import { LoaderService } from 'src/app/shared/components/loader/loader.service';
import { ShoutOutService } from '../../service/shout-out.service';
declare var $: any;
@Component({
	selector: 'app-activity-logs-listing',
	templateUrl: './activity-logs-listing.component.html',
	styleUrls: ['./activity-logs-listing.component.css']
})
export class ActivityLogsListingComponent implements OnInit {

	// Decoretor
	@Input() getActivityList = false;
	// String
	camapignType: any = "";
	reportCampaignId: any = '';
	actionTimestampsId: any = '';
	// pagination variable
	totalCount = 0;
	currentPage = 1;
	rowsPerPage = 10;
	// Boolean
	viewIssue: boolean = false;
	showRightSlider = true;

	// Constant
	message = Messages
	
	// variable
	activityLogs: any;
	description: any;
	raisedIssueDetails: any;
	rejectReasonModal: any;
	transactionDetails: any;
	cancelReason: any;
	tdWidth = 0;
	containerWidth = 0;	
	cellPadding = 10;

	constructor(
		private modalService: NgbModal,
		private loaderService: LoaderService,
		private shoutOutService: ShoutOutService
	) { }

	ngOnInit(): void {	
		this.setStateToInitial();
	}

	/**
	 * @description: used to show scroll slider buttons for mobile devices
	 * @param event 
	 */
	onScroll(event) {
		if (event.target.offsetWidth + event.target.scrollLeft >= event.target.scrollWidth) {
			this.showRightSlider = false
		}
		if (event.target.offsetWidth + event.target.scrollLeft >= (event.target.scrollWidth - 2)) {
			this.showRightSlider = false
		}
		if(event.target.scrollLeft == 0){
			this.showRightSlider = true;
		}
	
	}

	/**
	 * @description: used to scroll to right side of activity logs table in mobile devices
	 */
	handleRightClick(){		
	  this.containerWidth = $(".myrestable").width();
	  console.log(this.containerWidth,'_______________________________')
	  this.cellPadding = 10;
	  console.log(this.containerWidth);
	  this.tdWidth = this.containerWidth/2;
	  console.log(this.tdWidth)
	
	  console.log(this.tdWidth);
	  $(".scroller").css("padding-right", this.tdWidth);
	  $(".scroller th, .scroller td").width(this.tdWidth - this.cellPadding*2);
	  $(".inner").css("margin-left", this.containerWidth/2);
	  console.log('ertyurtyui',this.tdWidth)
		event.preventDefault();
		$('.inner').animate({
		scrollLeft: "+=" + (this.tdWidth) + "px"
		}, "slow");
	
	} 
	/**
	 * @description: used to scroll to left side of activity logs table in mobile devices
	 */
	handleLeftClick(){
	  this.containerWidth = $(".myrestable").width();
	  console.log(this.containerWidth,'_______________________________')
	  this.cellPadding = 10;
	  console.log(this.containerWidth);
	  this.tdWidth = this.containerWidth/2;
	  console.log(this.tdWidth)
	
	  console.log(this.tdWidth);
	  $(".scroller").css("padding-right", this.tdWidth);
	  $(".scroller th, .scroller td").width(this.tdWidth - this.cellPadding*2);
	  $(".inner").css("margin-left", this.containerWidth/2);
	console.log('ertyurtyui',this.tdWidth)
	
	
		event.preventDefault();
		$('.inner').animate({
		scrollLeft: "-=" + (this.tdWidth) + "px"
		}, "slow");   
	}

	/**
	 * @description: used to call api on load 
	 */
	setStateToInitial() {
		this.getActivityLogs();
	}

	/**
	 * @description: used to get activity logs listing
	 */
	getActivityLogs() {
		this.loaderService.show();
		let dataToSend: any = { currentPage: this.currentPage };
		this.shoutOutService.getActivityLogs(dataToSend).subscribe((res) => {
			this.loaderService.hide();
			if (res?.error) {
				console.log(res?.message);
			} else {
				this.activityLogs = res?.data?.activityLogs;
				this.activityLogs?.forEach((item, i) => {
					if (item?.complaints?.length) {
						let complaints = item?.complaints?.filter((item) => !item?.isResolved);
						this.activityLogs[i].raiseComplaint = complaints?.length ? false : true
					} else {
						this.activityLogs[i].raiseComplaint = true
					}
				})
				this.rowsPerPage = res?.data?.pageLimit;
				this.totalCount = res?.data?.count;
			}
		}, (error) => {
			this.loaderService.hide();
		})
	}

	/**
	 * @description: on change function of pagination
	 * @param pageNumber: selected page number 
	 */
	pageChanged(pageNumber) {
		this.currentPage = pageNumber;
		const top = document.getElementById('top');
		top.scrollIntoView(true);
		this.getActivityLogs();
	}

	/**
	 * @description: used to view report issue modal and set variables
	 * @param type : selected log data
	 * @param reportIssuesModal: report issue html content modal 
	 */
	redirectToRaiseIssuePage(type, reportIssuesModal) {
		this.redirectToViewIssuePage(type)
		this.camapignType = type?.shoutoutCampaignId?.type?.category + '-' + type?.shoutoutCampaignId?.type?.type
		this.reportCampaignId = type?._id
		this.actionTimestampsId = type?.actionTimestamps?._id;
		this.modalService
			.open(reportIssuesModal, {
				ariaLabelledBy: "modal-basic-title",
				centered: true,
				size: "lg",
				windowClass: "desctption-popup",
			})
	}

	/**
	 * @description: used to toggle view issue or report issue
	 */
	toggleCampaignTitle(){
		this.viewIssue=!this.viewIssue;
	}

	/**
	 * @description: used to open modal to view raised issues and set variables
	 * @param type : selected log data
	 * @param content: view issue html content modal 
	 */
	redirectToViewIssuePage(type, content?) {
		this.camapignType = type?.shoutoutCampaignId?.type?.category + '-' + type?.shoutoutCampaignId?.type?.type
		this.raisedIssueDetails = type?.complaints
		this.modalService
			.open(content, {
				ariaLabelledBy: "modal-basic-title",
				centered: true,
				size: "lg",
				windowClass: 'desctption-popup',
			})
	}

	/**
	 * @description: used to call activity logs api
	 * @param val 
	 */
	getLogs(val) {
		if (val) {
			this.getActivityLogs();
		}
	}

	/**
	 * @description: used to open description modal
	 * @param content : html content modal
	 * @param item : selected description data
	 */
	openDesctiption(content, item) {
		this.description = item;
		console.log(this.description);
		this.modalService
			.open(content, {
				ariaLabelledBy: "modal-basic-title",
				centered: true,
				windowClass: "desctption-popup",
				size: "md",
			})
	}

	/**
	 * @description: used to close modal and reset variables
	 */
	closeModal() {
		this.description = null;
		this.transactionDetails = null;
		this.modalService.dismissAll();
	}

	/**
	 * @description: used to open transaction modal
	 * @param value : selected log
	 * @param content : html content modal
	 */
	openTransactionModal(value, content) {
		this.camapignType = value?.shoutoutCampaignId?.type?.category + '-' + value?.shoutoutCampaignId?.type?.type;
		this.transactionDetails = value?.transactionDetails
		this.modalService.open(content, {
			ariaLabelledBy: "modal-basic-title",
			centered: true,
			windowClass: "desctption-popup",
			size: "lg",
		});
	}

	/**
	 * @description: used to view rejected reason modal
	 * @param content : html content modal
	 * @param value: selected reason 
	 */
	openReasonModal(content, value) {
		console.log(value)
		this.cancelReason = value
		this.rejectReasonModal = this.modalService.open(content, {
			ariaLabelledBy: "modal-basic-title",
			centered: true,
			windowClass: "desctption-popup",
			size: "md",
		});
	}

	/**
	 * @description: used to close reason modal and reset variables
	 */
	closeReasonModal() {
		this.rejectReasonModal.close();
		this.cancelReason = null
	}

}
