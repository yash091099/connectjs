import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from 'src/app/shared/components/loader/loader.service';
import { StartupService } from '../startup.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AcceleratorService } from '../../accelerator/services/accelerator.service';
import { ToastrService } from 'ngx-toastr';
import { AmountService } from 'src/app/shared/services/amount.service';
import { Location } from '@angular/common';
import { Messages } from 'src/app/config/message';
import { Constants } from 'src/app/config/constant';

@Component({
	selector: 'app-startup-participation-details',
	templateUrl: './startup-participation-details.component.html',
	styleUrls: ['./startup-participation-details.component.css']
})
export class StartupParticipationDetailsComponent implements OnInit {
	/** Object */
	projectDetails: any = {}
	disableBuyButton: boolean = false;
	/** Array */
	poolsArray: any = []
	/** Variable */
	defaultBannerImage: any = ''
	defaultBannerLink: any = ''
	poolName: string;
	numberOfTockens: any = 0;
	numberOfTokensToSend: any = 0;
	commissionAmount = 0;
	totalPurchaseAmount = 0;
	tokenSymbol: any = ''
	/** Boolean */
	useCommissionWallet = false;
	/** Form Group */
	purchaseTokensForm: FormGroup
	/** Constant */
	startupRoundStatus = Constants.STARTUP_ROUND_STATUS

	constructor(public route: ActivatedRoute,
		private modalService: NgbModal,
		private loaderService: LoaderService, private amountService: AmountService, private _location: Location,
		private startupService: StartupService, private fb: FormBuilder, private acceleratorService: AcceleratorService, private toastrService: ToastrService) { }


	ngOnInit(): void {
		this.createForm();
		this.getBanners();
		this.route.params.subscribe((params) => {
			console.log(params, "params");
			if (params?.id && params?.roundId) {
				this.fetchProjects(params?.id, params?.roundId)
			}
		})
	}
	/**
	 * @description: used to open purchase token modal
	 * @param content : html content modal
	 * @param symbol : project symbol
	 */
	open(content, symbol) {
		this.purchaseTokensForm.reset()
		this.numberOfTockens = 0
		this.numberOfTokensToSend = 0;
		this.tokenSymbol = symbol
		this.modalService.open(content, { centered: true, size: 'sm' })
	}

	/**
	 * @description: used to create purchase token form
	 */
	createForm() {
		this.purchaseTokensForm = this.fb.group({
			purchaseTokenAmount: ['', [Validators.required]]
		})
	}

	get purchaseTokenAmount() { return this.purchaseTokensForm.get('purchaseTokenAmount') }

	/**
	 * @description: used to get default banner image and link
	 */
	getBanners() {
		this.loaderService.show();
		this.startupService.getBanners().subscribe(response => {
			this.loaderService.hide();
			if (response.error) {
				console.log('Error');
			} else {
				console.log(response.data)
				this.defaultBannerImage = response?.data?.bannerImage
				this.defaultBannerLink = response?.data?.bannerLink
			}
		}, error => {
			this.loaderService.hide();
		});

	}

	/**
	 * @description: used to get the project details for upcoming,ongoing and closed round status
	 * @param id: startup id 
	 * @param roundId: round id 
	 */
	fetchProjects(id, roundId?) {
		let DTS: any = {
			id: id
		}
		if (roundId) {
			DTS.roundId = roundId
		}

		this.loaderService.show();
		this.startupService.fetchProjects(DTS).subscribe(response => {
			this.loaderService.hide();
			response.data = atob(response.data);
			if (response.error) {
				console.log('Error');
			} else {
				if (!roundId) {
					response.data = JSON.parse(atob(response.data))
					let projectDetails = response.data;

					let ongoingObject = projectDetails?.find(el => el?.rounds?.status === this.startupRoundStatus.ONGOING);
					if (ongoingObject) {

						this.projectDetails = ongoingObject;
						this.poolsArray = this.projectDetails.pools


						return;
					}
					let upcomingObject = projectDetails?.find(el => el?.rounds?.status === this.startupRoundStatus.UPCOMING);
					if (upcomingObject) {
						this.projectDetails = upcomingObject;
						this.poolsArray = this.projectDetails.pools

						return;
					}
					let closedObject = projectDetails?.find(el => el?.rounds?.status === this.startupRoundStatus.CLOSED);
					if (closedObject) {
						this.projectDetails = closedObject;
						this.poolsArray = this.projectDetails.pools

						return;

					}
					console.log(projectDetails, '------------------------projectDetails')

				} else {
					console.log(JSON.parse(response?.data), '--------!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!------------------------')
					response.data = JSON.parse((response?.data));
					this.projectDetails = response.data[0];
					this.poolsArray = this.projectDetails.pools

				}
			}
		}, error => {
			this.loaderService.hide();
		});

	}
	/**
	 * @description: used to get back
	 */
	goBackToHome() {
		this._location.back();
	}

	/**
	 * @description: on keydown function of purchase token amount
	 * @param $event 
	 */
	checkInputValue($event) {
		if (!(($event.keyCode > 95 && $event.keyCode < 106) ||
			($event.keyCode > 47 && $event.keyCode < 58) ||
			$event.keyCode == 8 || $event.keyCode == 190)) {
			return false;
		}
	}

	/**
	 * @description: used to get the purchase amount and commission amount
	 */
	purchaseButtonEnable() {
		this.poolName = 'Pool'

		if (this.purchaseTokenAmount.invalid) {
			this.numberOfTockens = null;
			return;
		}


		for (let i = 0; i < this.poolsArray.length; i++) {
			const item = this.poolsArray[i];

			if (
				item?.minLimit?.$numberDecimal <= this.purchaseTokenAmount?.value &&
				this.purchaseTokenAmount?.value <= item?.maxLimit?.$numberDecimal
			) {
				this.poolName = item?.name;
				break;
			}
		}



		this.getCommissionAmount()
		this.totalPurchaseAmount = this.purchaseTokenAmount.value;


		this.numberOfTockens = (Number(this.purchaseTokenAmount.value) / Number(this.projectDetails?.rounds?.sellingAmount.$numberDecimal)).toFixed(8);
		this.numberOfTokensToSend = Number(this.purchaseTokenAmount.value) / Number(this.projectDetails?.rounds?.sellingAmount.$numberDecimal);
	}

	/**
	 * @description: used to get the commision amount
	 */
	getCommissionAmount() {
		let data = {
			tokenSymbol: this.projectDetails?.symbol,
			tokenAmount: this.purchaseTokenAmount.value || 0
		}
		this.acceleratorService.getCommissionAmount(data).subscribe(response => {
			if (response.error) {
				console.log('Error', response.error);

			} else {
				console.log('Success', response);
				this.commissionAmount = response?.data || 0;
				if (this.useCommissionWallet) {
					if (this.purchaseTokenAmount.value) {
						this.totalPurchaseAmount = (Number(this.purchaseTokenAmount.value) - Number(this.commissionAmount));
					}
				}
				else {
					this.totalPurchaseAmount = this.purchaseTokenAmount.value;
				}
			}
		}, (error) => {
			console.log('Error', error);
		});
	}
	/**
	 * @description: used to check commision wallet to be used or not
	 */
	useCommissionWalletOrNot(e) {
		this.useCommissionWallet = !this.useCommissionWallet;
		if (this.useCommissionWallet) {
			this.totalPurchaseAmount = (Number(this.totalPurchaseAmount) - Number(this.commissionAmount))
		}
		else {
			this.totalPurchaseAmount = this.purchaseTokenAmount.value;
		}
	}

	/**
	 * @description: used to close purchase popup and reset variables
	 */
	closePurchasePopUp() {
		this.useCommissionWallet = false;
		this.purchaseTokensForm.reset();
		this.totalPurchaseAmount = 0;
		this.numberOfTockens = null;
		this.commissionAmount = 0;
		this.modalService.dismissAll();
	}

	/**
	 * @description: used to buy the token
	 * @param docuSignLocation 
	 */
	buyToken(docuSignLocation = null) {
		if (this.purchaseTokensForm.invalid) {
			this.purchaseTokensForm.markAllAsTouched();
			return;
		}
		let dataToSend: any = {
			token: 'USD',
			quantity: this.numberOfTokensToSend,
			paymode: "wallet",
			roundId: this.projectDetails?.rounds._id,
			startupId: this.projectDetails._id,
			useCommissionWallet: this.useCommissionWallet,
			tokenSymbol: this.projectDetails.symbol,
			tokenAmount: this.purchaseTokenAmount.value
		};
		if (docuSignLocation) {
			dataToSend.docuSign = docuSignLocation
		}
		console.log(dataToSend);
		this.disableBuyButton = true;
		this.loaderService.show();
		this.acceleratorService.createTransaction(dataToSend).subscribe(
			(response) => {
				this.loaderService.hide();
				if (response.error) {
					this.disableBuyButton = false;

					this.toastrService.error(response.message);
					this.modalService.dismissAll();
				} else {
					this.disableBuyButton = false;

					this.toastrService.success(Messages.CONST_MSG.PURCHASED_SUCCESSFULLY, '', {
						timeOut: 3000,
					});

					this.fetchProjects(this.projectDetails._id, this.projectDetails?.rounds?._id);
					this.amountService.handlefetchWalletAmount(true)

					this.modalService.dismissAll();

				}
			},
			(error) => {
				this.disableBuyButton = false;

				console.log("qwertyuio", error.error.message);
				this.loaderService.hide();
				this.modalService.dismissAll();

				console.error(error);
				this.toastrService.error(error.error.message, '', {
					timeOut: 3000,
				});
			}
		);
	}


}
