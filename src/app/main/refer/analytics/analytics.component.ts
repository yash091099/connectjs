import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { LoaderService } from "src/app/shared/services";
import { ReferService } from "../service/refer.service";
import { ToastrService } from "ngx-toastr";
import { Constants } from "src/app/config/constant";
import { Messages } from "src/app/config/message";
declare var $: any;
@Component({
	selector: "app-analytics",
	templateUrl: "./analytics.component.html",
	styleUrls: ["./analytics.component.css"],
})
export class AnalyticsComponent implements OnInit {

	// numbers
	totalCount = 0;
	currentPage = 1;
	rowsPerPage = 0;

	// arrays
	analyticsDataArray = [];
	loadingAnalyticsData:boolean=true;
	// strings
	selectedTab = Constants.ANALYTICS.ANATYTICS;

	//constants
	constants = Messages.CONST_MSG;

    // variable
	public containerWidth:any;
	public cellPadding:any;
	public tdWidth:any;
	public showRightSlider = true;
	public isMobileScreen = false;

	// event emmiter
	@Input() campaignId: any;
	@Output() lessDetails = new EventEmitter<any>();

	constructor(
		private loaderService: LoaderService,
		public toasterService: ToastrService,
		private referService: ReferService,
	) { }

	ngOnInit(): void {
		let width = window.screen.availWidth;
		if(width <= 667 && width >= 320){
			this.isMobileScreen = true;
		}
		window.scroll(0, 0);
		this.getAllAnalyticsData();
	}
	
	/**
	 * @description: used to add scroll functionality for mobile devices
	 * @param event 
	 */
	onScroll(event) {
		console.log("offset width",event.target.offsetWidth + event.target.scrollLeft)
		console.log("scroll width",event.target.scrollWidth);
		if (event.target.offsetWidth + event.target.scrollLeft >= event.target.scrollWidth) {
			this.showRightSlider = false
		  }
		if (event.target.offsetWidth + event.target.scrollLeft >= (event.target.scrollWidth - 2)) {
			this.showRightSlider = false
		}
		  if(event.target.scrollLeft == 0){
			this.showRightSlider = true;
		  }
		  console.log("show right slider",this.showRightSlider);
	
	  }
	/**
	 * @description: used to scroll analytics data to the right side
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
	 * @description: used to scroll analytics data to the left side
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
	 * @description: used to get analytics listing
	 */
	getAllAnalyticsData() {
		this.loadingAnalyticsData=true
		let dataToSend: any = {
			currentPage: this.currentPage,
		};
		if (this.campaignId) {
			dataToSend.campaignId = this.campaignId?._id;
		}
		// this.loaderService.show();
		this.referService.analyticsData(dataToSend).subscribe(
			(res) => {
				this.loaderService.hide();
				if (res?.error) {
					this.toasterService.error(res?.message || Messages.message.SOMETHING_WRONG);
				} else {
					this.analyticsDataArray = res.data?.campaignDetails || [];
					this.totalCount = res.data?.totalCount;
					this.rowsPerPage = res.data?.rowsPerPage;
					this.analyticsDataArray = this.analyticsDataArray?.map((item) => ({
						...item,
						earning: this.getEarning(item),
					}));
					this.loadingAnalyticsData=false
				}
			},
			(error) => {
				this.loadingAnalyticsData=false
				this.loaderService.hide();
			}
		);
	}

	/**
	 * @description: used to get statistics count
	 * @param user : user info
	 * @returns statistics count
	 */
	getEarning(user) {
		let count = 0;
		if (user?.joinedUsersDetails?.signup) {
			count += 1;
		}
		if (user?.joinedUsersDetails?.KYCStatus == Constants.ANALYTICS.APPROVED) {
			count += 1;
		}
		if (user?.allocatedToken) {
			count += 10;
		}
		return count;
	}

	/**
	 * @description: on change function of pagination
	 * @param pageNumber: changed page number value 
	 */
	pageChanged(pageNumber) {
		this.currentPage = pageNumber;
		this.getAllAnalyticsData();
	}

	/**
	 * @description: used to go back to previous page
	 */
	goBackToPrevPage() {
		this.lessDetails.emit(localStorage.getItem(Constants.ANALYTICS.PREVIOUS_TAB));
	}

	/**
	 * @description: used to export analytics data
	 */
	exportData() {
		let dataToSend: any = {}
		if (this.campaignId) {
			dataToSend.campaignId = this.campaignId?._id;
		}
		// this.loaderService.show();
		this.referService.downloadFile(dataToSend).subscribe(
			(response: any) => {
				this.loaderService.hide();
				if (response.error) {
					this.toasterService.error(response.message);
				} else {
					let link = document.createElement('a');
					link.href = (window as any).URL.createObjectURL(response);
					link.download = `Exported-analytics${new Date().getTime()}.xlsx`;
					link.click();
				}
			},
			(error) => {
				if (error.status == 404) {
					this.toasterService.error(Messages.message.RECORD_NOT_FOUND);
				}
				this.loaderService.hide();
			}
		);
	}
}
