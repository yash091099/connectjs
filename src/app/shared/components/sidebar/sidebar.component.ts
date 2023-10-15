import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UpdateReferralTabStatusService } from 'src/app/main/refer/service/update-referral-tab-status.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonApiService } from '../../services';
import { AcceleratorService } from 'src/app/main/accelerator/services/accelerator.service';
import { AmountService } from '../../services/amount.service';
import { SettingService } from 'src/app/main/settings/service/service.service';
import { ToastrService } from 'ngx-toastr';
import { Messages } from 'src/app/config/message';
declare var $: any;
@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit, OnDestroy {
    /**Variable */
	showMenu = '';	
	public user = null;
	selectedStatusTab:any = null;
	/**Subscription */
	public subscription: Subscription;
	/** Event emitter */
	@Input() isLoggedIn;
	public kycApproved = false;
	showProfileVerify = false;
	walletAddress:any;
	constants = Messages.CONST_MSG

	constructor(
		private router: Router,
		private referralTabStatusService: UpdateReferralTabStatusService,
		private modalService: NgbModal,
		private sharedService: CommonApiService,
		private acceleratorService: AcceleratorService,
		public amountService: AmountService,
		public service:SettingService,
		public toastrService: ToastrService
	) { }

	ngOnInit() {
		
		this.service.data$.subscribe((newData) => {
			this.getWalletAddress();
			console.log(newData,'✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎___________++✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎');
		  });
		this.getWalletAddress()
		const hasCollapsible = document.querySelectorAll(".has-collapsible");
		$(document).ready(function(){
			//jquery for toggle sub menus
			$('.sub-btn').click(function(){
				console.log("calling sub-btn")

			//   $(this).next('.sub-menu').slideToggle();
			  $(this).find('.dropdown').toggleClass('rotate');
			});

			// jquery for expand and collapse the sidebar
			$('.menu-btn').click(function(){
				console.log("calling menu-btn")

			  $('.side-bar').addClass('active');
			  $('.menu-btn').css("visibility", "hidden");
			});
	   
			$('.close-btn').click(function(){
				console.log("calling close-btn")
			  $('.side-bar').removeClass('active');
			  $('.menu-btn').css("visibility", "visible");
			});
			hasCollapsible.forEach(function (collapsible) {
				collapsible.addEventListener("click", function () {
					collapsible.classList.toggle("active");
			
					// Close Other Collapsible
					hasCollapsible.forEach(function (otherCollapsible) {
						if (otherCollapsible !== collapsible) {
							otherCollapsible.classList.remove("active");
						}
					});
				});
			});

		  });
		  this.referralTabStatusService.currentReferralTabStatus.subscribe(msg => {
			console.log("selected tab msg",msg);
			this.selectedStatusTab = msg || null
		  });
		  console.log("selected status tab",this.selectedStatusTab);
		  this.sharedService.isUserLoggedIn();
		  this.sharedService.getLogin().subscribe(
			  (res) => {
				  this.isLoggedIn = res;
			  },
			  (err) => {
				  console.log("Error occured while calling observable", err);
			  }
		  );
		  if (this.isLoggedIn) {
			  let userDetails = this.sharedService.getCurrentUser();
			  this.user = userDetails
			  this.showProfileVerify = userDetails?.emailVerified
			  
		  }
		  this.amountService.getProfileVerify().subscribe((res) => {
			this.showProfileVerify = res
		})
		  this.checkUserKyc()
	}

	 getWalletAddress(){
		// this..show();
		this.service.getWalletAddress().subscribe(response => {
			// this.loaderService.hide();
			if (response.error) {
				console.log('Error : ', response.error);
			} else {
				this.walletAddress=response?.data[0]?.walletAddress||[];
				console.log('sidebar is calling ✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎')
			}
		}, (error) => {
			this.toastrService.clear();
			this.toastrService.error(this.constants.SOMETHING_WENT_WRONG, this.constants.ERROR, {
				timeOut: 3000,
			});
			console.log("Server Error : ", error);
		});
	}

	ngOnDestroy() {
		this.subscription?.unsubscribe();
	}

	/**
	 * @description: used to reset referral active tab
	 */
	resetReferralActive() {	
		this.selectedStatusTab = '';
	}

	/**
	 * @description: on select method of referral tab
	 * @param tab 
	 * @param $event 
	 */
	onReferralTabClick(tab, $event){
		this.selectedStatusTab = tab;
		$event.stopPropagation();
	}

	/**
	 * @description: used to open logout modal
	 * @param content: html content popup 
	 */
	openLogOutModal(content) {
		this.modalService.open(content, { centered: true, size: 'md', backdrop: 'static', keyboard: false, windowClass: 'delete-popup' });
	}

	/**
	 * @description: used to logout from this device or all devices
	 * @param thisDevice 
	 */
	logout(thisDevice) {
		this.closeLogOutModal();
		this.isLoggedIn = false;
		let dataToSend = {
			token: window.localStorage.getItem('token'),
			userId: this.user._id,
			logoutSpecific: thisDevice
		}
		this.sharedService.logOutApi(dataToSend).subscribe((response) => {
		}, (error) => {
			console.log(error);
		});
		this.sharedService.logout();
	}

	/**
	 * @description: used to navigate to the refer and earn
	 */
	onClickOfReferEarn() {
		console.log('onclick')
		this.selectedStatusTab = 'refer-earn';
		this.router.navigate(['/refer'])
		
	}
	/**
	 * @description: used to close log out modal
	 */
	closeLogOutModal() {
		this.modalService.dismissAll()
	}
	preventCollaps($event){
		$event.stopPropagation();
	}
   
		/**
	 * @description: used to check user kyc is approved or not
	 */
		checkUserKyc() {
			this.acceleratorService.checkUserKyc().subscribe(response => {
				if (response) {
					this.kycApproved = true;
				}
			}, error => {
				console.log("Server Error", error);
			})
		}
		// connectWallet(walletConnectPopup) {
		// 	this.modalService.open(walletConnectPopup, { centered: true, size: 'md', windowClass:"wallet-connect-popup", backdrop: 'static', keyboard: false, ariaLabelledBy: 'modal-basic-title' });
		// }	
		connectWallet() {
		
			this.router.navigate(['settings/wallet'])
			// this.modalService.open(walletConnectPopup, { centered: true, size: 'md', windowClass:"wallet-connect-popup", backdrop: 'static', keyboard: false, ariaLabelledBy: 'modal-basic-title' });
		}
		closePopup() {
			this.modalService.dismissAll();
		}		
}  


