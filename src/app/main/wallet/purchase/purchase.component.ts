import { Component, OnInit, OnDestroy } from '@angular/core';
import { WalletService } from '../services/wallet.service';
import { NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
import { AmountService } from 'src/app/shared/services/amount.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';
import { Messages } from 'src/app/config/message';
import { Constants } from 'src/app/config/constant';

@Component({
	selector: 'app-purchase',
	templateUrl: './purchase.component.html',
	styleUrls: ['./purchase.component.css'],
	providers: [NgbPaginationConfig]
})
export class PurchaseComponent implements OnInit, OnDestroy {
	/******Pagination*****/
	currentPage = 1;
	totalCount = 0;
	rowsPerPage = 10;

	/******Array*****/
	purchaseArray = [];

	/******Subscription*****/
	subscription: Subscription;

	/*********Constant********/
	constants = Messages.CONST_MSG
	paymode = Constants.PAYMODE
	walletStatus = Constants.USD_WALLET_LOG_STATUS

	constructor(
		private toasterService: ToastrService,
		private titleService: Title,
		private pageConfig: NgbPaginationConfig,
		private walletService: WalletService,
		private amount: AmountService,
		private router: Router
	) {
		pageConfig.boundaryLinks = true;
	}

	ngOnInit(): void {
		this.titleService.setTitle("Transactions");
		this.getPurchase();
		this.setObservable();
	}

	/**
	 * @description: used to set payment observable
	 */
	setObservable() {
		this.subscription = this.amount.getPayment().subscribe(response => {
			if (response == 'Y') {
				this.amount.setPayment('N');
				this.ngOnInit();
			}
		})
	}

	/**
	 * @description: used to get purchase listing
	 */
	getPurchase() {
		let data = {
			currentPage: this.currentPage
		}
		return this.walletService.getPurchase(data).subscribe(response => {
			if (response.error) {
				console.log('Error');
			} else {
				this.purchaseArray = response.data.transactions;
				this.totalCount = response.data.transactionCount;
				this.rowsPerPage = response.data.pageLimit;
			}
		}, error => {
			console.log('Server Error : ', error);
		})
	}

	/**
	 * @description: used to navigate to wallet invoice and send data
	 * @param data 
	 */
	sendDataToInvoice(data) {
		let userData = JSON.stringify(data);
		this.router.navigate(['/wallet/invoice'], { queryParams: { purchase: userData } });
	}

	/**
	 * @description: on change function of pagination
	 * @param value 
	 */
	pageChanged(value) {
		this.currentPage = value;
		this.getPurchase();
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

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

}
