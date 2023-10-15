import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from 'src/app/shared/services';
import { AcceleratorService } from '../accelerator/services/accelerator.service';
declare var $: any;
@Component({
  selector: 'app-token-transaction',
  templateUrl: './token-transaction.component.html',
  styleUrls: ['./token-transaction.component.css']
})
export class TokenTransactionComponent implements OnInit {
  /** Array */
  public transactionArray = [];
  /** Variable */
  selectedTransaction: any
  public containerWidth:any;
	public cellPadding:any;
	public tdWidth:any;
  /** Boolean */
  isDeductionLess = false
  public showRightSlider = true;
  public isMobileScreen = false;
  //integer valriable
  public currnetPageTransaction = 1
  public totalCountTransaction = 0;
  public rowsPerPageTransaction = 10;
  
  constructor(
		private loaderService: LoaderService,
		private acceleratorService: AcceleratorService,
		private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
	
    this.fetchTokenTransaction();

  let width = window.screen.availWidth;
  if(width <= 667 && width >= 320){
    this.isMobileScreen = true;
  }
  
}
/**
 * @description: used to show scroll slider in transaction listing for mobile devices
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
 * @description: used to scroll to right side of table in mobile devices
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
 * @description: used to scroll to left side of table in mobile devices
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
transactionDataLoading:boolean=true
  /**
   * @description: used to fetch token transaction listing
   */
  fetchTokenTransaction() {
    this.transactionDataLoading=true;
		let data = {
			currentPage: this.currnetPageTransaction
		}
		// this.loaderService.show();
		this.acceleratorService.fetchTokenTransaction(data).subscribe(response => {
			this.loaderService.hide();
			this.transactionArray = response?.data?.transactions;
			this.rowsPerPageTransaction = response?.data?.pageLimit;
			this.totalCountTransaction = response?.data?.transactionCount;
    this.transactionDataLoading=false;

		}, error => {
			this.loaderService.hide();
    this.transactionDataLoading=false;

			console.log('Server Error : ', error);
		});
	}

 /**
  * @description: used to open invoice popup modal
  * @param content: html content popup 
  * @param data: selected transaction 
  */
  openInvoicePopup(content, data) {
		let amount = data?.tokenAmount?.$numberDecimal * 1 +
			data?.walletAmount?.$numberDecimal * 1 +
			data?.commissionAmount?.$numberDecimal * 1

		if (data?.commissionAmount?.$numberDecimal < amount * .15) {
			this.isDeductionLess = true
		} else {
			this.isDeductionLess = false
		}

		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "lg", windowClass: "invoice-popup" });
		this.selectedTransaction = data
	}

  /**
   * @description: on change function of pagination
   * @param page: selected page number 
   */
  pageChanged(page) {
		this.currnetPageTransaction = page;
		this.fetchTokenTransaction();
	}

}
