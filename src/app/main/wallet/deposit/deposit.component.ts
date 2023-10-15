import { Component, OnInit } from '@angular/core';
import { WalletService } from '../services/wallet.service';
import { NgbModal, NgbModalRef, NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
import { AmountService } from 'src/app/shared/services/amount.service';
import { ToastrService } from "ngx-toastr";
import { LoaderService } from 'src/app/shared/services';
import { Messages } from 'src/app/config/message';
import { Constants } from 'src/app/config/constant';

@Component({
	selector: 'app-deposit',
	templateUrl: './deposit.component.html',
	styleUrls: ['./deposit.component.css'],
	providers: [NgbPaginationConfig]
})
export class DepositComponent implements OnInit {

	/*********Array*********/
	depositArray = [];

	/*********Pagination*********/
	currentPage = 1;
	totalCount = 0;
	rowsPerPage = 10;

	/*********Variable*********/
	gatewayData = null;
	modalRef: NgbModalRef;

	/*********Constants*********/
	constants = Messages.CONST_MSG
	paymode = Constants.PAYMODE
	walletStatus = Constants.USD_WALLET_LOG_STATUS

	constructor(
		private pageConfig: NgbPaginationConfig,
		private toasterService: ToastrService,
		private walletService: WalletService,
		private amount: AmountService,
		private modalService: NgbModal,
		private loaderService: LoaderService
	) {
		pageConfig.boundaryLinks = true;
	}

	ngOnInit(): void {
		this.getDeposit();
		this.setObservable();
	}

	/**
	 * @description: used to set payment observable
	 */
	setObservable() {
		this.amount.getPayment().subscribe(response => {
			if (response == 'Y') {
				this.amount.setPayment('N');
				this.ngOnInit();
			}
		})
	}

	/**
	 * @description: used to get the deposit listing
	 */
	getDeposit() {
		let data = {
			currentPage: this.currentPage
		}
		this.loaderService.show();
		this.walletService.getDeposit(data).subscribe(response => {
			this.loaderService.hide();
			if (response?.errro) {
				console.log('Error');
			} else {
				this.depositArray = response?.data?.transactions;
				this.totalCount = response?.data?.transactionCount;
				this.rowsPerPage = response?.data?.pageLimit;
			}
		}, error => {
			this.loaderService.hide();
			console.log('Server Error ', error);
		});
	}
	/**
	 * @description: on change function of pagination
	 * @param page: selected page 
	 */
	pageChanged(page) {
		this.currentPage = page;
		this.getDeposit();
	}

	/**
	 * @description: used to open view invoice popup
	 * @param content 
	 * @param gatewayData 
	 */
	showInvoicePopup(content, gatewayData) {
		console.log(gatewayData);
		this.gatewayData = gatewayData
		this.modalRef = this.modalService.open(content, { centered: true, size: 'md', ariaLabelledBy: 'modal-basic-title' });
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
	 * @description: used to close modal
	 */
	closeAllPopup() {
		this.modalService.dismissAll();
	}
}
