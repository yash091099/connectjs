import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/shared/components/loader/loader.service';
import { ShoutOutService } from '../../service/shout-out.service';
import { Constants } from 'src/app/config/constant';
import { Messages } from 'src/app/config/message';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;
@Component({
	selector: 'app-transactions-listing',
	templateUrl: './transactions-listing.component.html',
	styleUrls: ['./transactions-listing.component.css']
})
export class TransactionsListingComponent implements OnInit {

	/****Array*****/
	completedCampaigns: any = [];
	/******Constants****/
	constant = Constants;
	message = Messages;
	/*********Pagination*********/
	currentPage = 1;
	totalCount = 0;
	rowsPerPage = 10;
	/*********Variable*********/
	description: any;
	msg:any='';
	tdWidth = 0;
	containerWidth = 0;	
	cellPadding = 10;
	showRightSlider = true;

	constructor(
		private loaderService: LoaderService,
		private shoutOutService: ShoutOutService,
		private modalService: NgbModal,
	) { }

	ngOnInit(): void {
		this.setStateToInitial();
	}

	/**
	 * @description: used to show slider on scroll of table in mobile devices
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
	 * @description: used to scroll to right side of transaction table for mobile devices
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
	 * @description: used to scroll to left side of transaction table for mobile devices
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
		this.getCompletedCampaigns()
	}

	/**
	 * @description: used to get completed campaign listing
	 */
	getCompletedCampaigns() {
		let dataToSend: any = { currentPage: this.currentPage }
		this.loaderService.show();
		this.shoutOutService.getCompletedCampaigns(dataToSend).subscribe((resp) => {
			this.loaderService.hide();
			if (resp.error) {
				console.log('Error');
			} else {
				this.completedCampaigns = resp?.data?.data;
				this.totalCount = resp.data?.count;
				this.rowsPerPage = resp.data?.pageLimit;
			}
		}, (err) => {
			this.loaderService.hide();
		});
	}

	/**
	 * @description: on change function of pagination
	 * @param pageNumber : selected page number
	 */
	pageChanged(pageNumber) {
		this.currentPage = pageNumber;
		const top = document.getElementById('top');
		top.scrollIntoView(true);
		this.getCompletedCampaigns();
	}

	/**
	 * @description: used to open description modal
	 * @param content : html content modal
	 * @param item : selected description
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
		this.description = ''
		this.modalService.dismissAll();
	}

	/**
	 * @description: used to open cancel reason modal
	 * @param msg : cancelled reason 
	 * @param content : modal html content
	 */
	showCancellationReason(msg,content){
		console.log(msg?.reason,'---------------msg')
		this.msg=msg?.reason;
		this.modalService
			.open(content, {
				ariaLabelledBy: "modal-basic-title",
				centered: true,
				windowClass: "desctption-popup",
				size: "md",
			})

	}

}
