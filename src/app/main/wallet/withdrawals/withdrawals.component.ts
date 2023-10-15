import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Constants } from 'src/app/config/constant';
import { Messages } from 'src/app/config/message';
import { LoaderService } from 'src/app/shared/services';
import { WalletService } from '../services/wallet.service';

@Component({
	selector: 'app-withdrawals',
	templateUrl: './withdrawals.component.html',
	styleUrls: ['./withdrawals.component.css']
})
export class WithdrawalsComponent implements OnInit {

	/******Pagination*****/
	currentPage = 1;
	totalCount = 0;
	rowsPerPage = 10;

	/******Array*****/
	withdrawalsArray = [];

	/*********Variable********/
	rejectionMessage: any

	/*********Constant********/
	constants = Messages.CONST_MSG
	walletStatus = Constants.USD_WALLET_LOG_STATUS

	constructor( 
		private pageConfig: NgbPaginationConfig, 
		private walletService: WalletService, 
		private toasterService: ToastrService,
		private loaderService: LoaderService,
		private modalService: NgbModal
		) {
		pageConfig.boundaryLinks = true;
	}
	ngOnInit(): void {
		this.getData();
	}

	/**
	 * @description: on change function of pagination
	 * @param page 
	 */
	pageChanged(page) {
		this.currentPage = page;
		this.getData();
	}

	/**
	 * @description: used to get withdrawals listing
	 */
	getData() {
		let data = {
			currentPage: this.currentPage
		}
		this.loaderService.show();
		this.walletService.getWithDrawal(data).subscribe(response => {
			this.loaderService.hide();
			if (response.errro) {
				console.log('Error');
			} else {
				this.withdrawalsArray = response.data.data;
				this.totalCount = response.data.count;
				this.rowsPerPage = response.data.limit;
			}
		}, error => {
			this.loaderService.hide();
			console.log('Server Error ', error);
		});
	}

	/**
	 * @description: used to copy data
	 * @param text 
	 */
	cpyToClipboard(text) {
		document.addEventListener('copy', (e: ClipboardEvent) => {
			e.clipboardData.setData('text/plain', (text));
			e.preventDefault();
			document.removeEventListener('copy', null);
		});
		document.execCommand('copy');
		this.toasterService.success(this.constants.COPIED_TO_CLIPBOARD, this.constants.SUCCESS, { timeOut: 3000 });
	}

	/**
	 * @description: used to view rejection reason popup
	 * @param content 
	 * @param reason 
	 */
	showRejectionReason(content, reason) {
		this.rejectionMessage = reason
		this.modalService.open(content, { centered: true, size: 'md', windowClass: 'seminor-login-modal-body' });
	}
	
	/**
	 * @description: used to close modal and reset variable
	 */
	closeAllPopup() {
		this.rejectionMessage = null
		this.modalService.dismissAll()
	}
}
