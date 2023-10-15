import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import {
  CommonApiService,
  LoaderService,
  FormValidatorService,
} from "src/app/shared/services";
import { AmountService } from "src/app/shared/services/amount.service";
import { AcceleratorService } from "../../accelerator/services/accelerator.service";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { environment } from "src/environments/environment";
import { WalletService } from "../services/wallet.service";
import { Constants } from "src/app/config/constant";
import { Messages } from "src/app/config/message";
import noWhitespaceValidator from "src/app/shared/services/no-white-space-validator.service";
import { element } from "protractor";
import * as moment from "moment";
declare var $: any;

@Component({
  selector: "app-new-withdraw",
  templateUrl: "./new-withdraw.component.html",
  styleUrls: ["./new-withdraw.component.css"],
})
export class NewWithdrawComponent implements OnInit {
  /*****EventEmmiter****/
  @ViewChild("content3", { static: true }) successPopUp: ElementRef;
  @ViewChild("content4", { static: true }) errorPopUp: ElementRef;
  @ViewChild("content2", { static: true }) withdrawConfirmPopUp: ElementRef;
  @ViewChild("commissionWithdrawalConfirmationModal", { static: true })
  commissionWithdrawConfirmPopUp: ElementRef;
  disableAddAmountButton: boolean = false;
  disableWithdrawProceedButton: boolean = false;
  /*********Variable*********/
  walletAmount: any;
  public gatewayData: any = {};
  coinName: any;
  public amountToAdd = 0;
  vestingScheduleDetails: any;
  selectedVestingId: any;
  modalReference: any;
  maxCommissionAmount: any = 0;
  tokenArray: any;
  technology: any;
  selectedWithdraw = null;
  public modalRef: NgbModalRef;
  tdWidth: any;
  containerWidth: any;
  cellPadding: any;
  disablesubmitCommissionWithdrawAmount: boolean = false;
  /*********Array*********/
  withdrawalsArray = [];
  depositArray = [];
  commissionWalletLogs = [];
  earningDebitTransactionsArray: any = [];
  earningCreditTransactionsArray: any = [];
  earningWithdrawalTransactionsArray: any = [];
  public tokensArray: any = [];
  public creditsArray: any = [];

  /*********Form*********/
  public withdrawForm: FormGroup;
  public withdrawCommissionForm: FormGroup;
  transactionsFilterForm: FormGroup;

  /*********Boolean*********/
  confirmWithdraw = false;
  confirmCommissionWithdrawal = false;
  kycApproved = false;
  tokenWithdrawModal = false;
  showDropDown = false;
  public gateResponse = false;
  buttonClicked = false;
  public isCashCouponScreen = false;
  isMobileScreen = false;
  showRightSlider = true;
  showDetails = true;

  /*********Sring*********/
  selectedTab = "";
  public errorMessage = "";
  public errorMessageAmount = "";
  public successMessage = "";
  public selectedPaymentMethod = "Select Token To Receive Funds";
  commissionChainName: any = "";
  selectedLog = "DEBIT";
  coinLogo = "";
  commissoinWithdrawalType: any = "";
  rejectionMessage: any = "";
  commissoinTokenId: any = "";
  contentHeader: any = "";

  /*********Constants*********/
  constants = Messages.CONST_MSG;
  coinNameConst = Constants.COIN_NAME;
  tabs = Constants.WITHDRAW_TABS;
  paymode = Constants.PAYMODE;
  usdWalletLogStatus = Constants.USD_WALLET_LOG_STATUS;
  walletLogType = Constants.WALLET_LOG_TYPE;
  public paymentModes = environment.depositPayModes;
  public withdrawPaymentModes = environment.withdrawPayModes;
  disableClaimButton:boolean=false;
  @ViewChild("details") el: ElementRef;

  constructor(
    private modalService: NgbModal,
    private loaderService: LoaderService,
    private acceleratorService: AcceleratorService,
    private amountService: AmountService,
    private sharedService: CommonApiService,
    public fb: FormBuilder,
    private validator: FormValidatorService,
    public toastrService: ToastrService,
    private walletService: WalletService
  ) {}

  ngOnInit(): void {
    let width = window.screen.availWidth;
    if (width <= 667 && width >= 320) {
      this.isMobileScreen = true;
      this.showDetails = false;
    }
    this.selectedTab = this.tabs.WALLET;
    this.checkUserKyc();
    this.getTokensData();
    this.createTransactionFilterForm();
    this.createWithdrawForm();
    this.createCommissionWithdrawForm();

    // $('#details').on('click', function(){
    // 	console.log("click")

    // });
  }
  /**
   * @description: used to scroll in table for mobile devices
   * @param event
   */
  onScroll(event) {
    if (
      event.target.offsetWidth + event.target.scrollLeft >=
      event.target.scrollWidth
    ) {
      this.showRightSlider = false;
    }
    if (
      event.target.offsetWidth + event.target.scrollLeft >=
      event.target.scrollWidth - 2
    ) {
      this.showRightSlider = false;
    }
    if (event.target.scrollLeft == 0) {
      this.showRightSlider = true;
    }
  }
  /**
   * @description: used to scroll to right side of table for mobile devices
   */
  handleRightClick() {
    this.containerWidth = $(".myrestable").width();
    console.log(this.containerWidth, "_______________________________");
    this.cellPadding = 10;
    console.log(this.containerWidth);
    this.tdWidth = this.containerWidth / 2;
    console.log(this.tdWidth);

    console.log(this.tdWidth);
    $(".scroller").css("padding-right", this.tdWidth);
    $(".scroller th, .scroller td").width(this.tdWidth - this.cellPadding * 2);
    $(".inner").css("margin-left", this.containerWidth / 2);
    console.log("ertyurtyui", this.tdWidth);
    event.preventDefault();
    $(".inner").animate(
      {
        scrollLeft: "+=" + this.tdWidth + "px",
      },
      "slow"
    );
  }
  /**
   * @description: used to scroll to left side of table for mobile devices
   */
  handleLeftClick() {
    this.containerWidth = $(".myrestable").width();
    console.log(this.containerWidth, "_______________________________");
    this.cellPadding = 10;
    console.log(this.containerWidth);
    this.tdWidth = this.containerWidth / 2;
    console.log(this.tdWidth);

    console.log(this.tdWidth);
    $(".scroller").css("padding-right", this.tdWidth);
    $(".scroller th, .scroller td").width(this.tdWidth - this.cellPadding * 2);
    $(".inner").css("margin-left", this.containerWidth / 2);
    console.log("ertyurtyui", this.tdWidth);

    event.preventDefault();
    $(".inner").animate(
      {
        scrollLeft: "-=" + this.tdWidth + "px",
      },
      "slow"
    );
  }

  /**
   * @description: used to handle arrow rotation
   */
  handleArrowChange() {
    var angle = $("#image").data("angle") + 180 || 180;
    $("#image").css({ transform: "rotate(" + angle + "deg)" });
    $("#image").data("angle", angle);
  }
  /**
   * @description: used to create transaction filter form
   */
  createTransactionFilterForm() {
    this.transactionsFilterForm = this.fb.group({
      filterToken: [null], // Initial value for the filterToken form control
    });
  }

  /**
   * @description: used to create withdraw form
   */
  createWithdrawForm() {
    this.withdrawForm = this.fb.group({
      walletAddress: new FormControl("", [
        Validators.required,
        noWhitespaceValidator,
      ]),
      amount: new FormControl("", [Validators.required]),
    });
  }
  get walletAddress() {
    return this.withdrawForm.get("walletAddress");
  }
  get amount() {
    return this.withdrawForm.get("amount");
  }

  /**
   * @description: used to create withdraw commission form
   */
  createCommissionWithdrawForm() {
    this.withdrawCommissionForm = this.fb.group({
      commissionWalletAddress: new FormControl("", [
        Validators.required,
        noWhitespaceValidator,
      ]),
      commissionWalletAmount: new FormControl("", [Validators.required]),
    });
  }
  get commissionWalletAddress() {
    return this.withdrawCommissionForm.get("commissionWalletAddress");
  }
  get commissionWalletAmount() {
    return this.withdrawCommissionForm.get("commissionWalletAmount");
  }

  /**
   * @description: used to get wallet and commission wallet details
   */
  getWalletDetails() {
    if (this.selectedTab == this.tabs.WALLET) {
      // this.loaderService.show()
      this.walletService.getWallet().subscribe(
        (response) => {
          // this.loaderService.hide()
          if (response.error) {
            console.log("Error");
          } else {
            if (response?.data?.balance) {
              this.walletAmount = Number(
                response?.data?.balance?.$numberDecimal || response.data.balance
              );
            }
            if (response?.data?.token) {
              this.tokenArray = response?.data?.token;
            }
          }
        },
        (error) => {
          // this.loaderService.hide()
          console.log("Server Error : ", error);
        }
      );
    } else {
      // this.loaderService.show()

      this.walletService.getCommissionWallet().subscribe(
        (response) => {
          // this.loaderService.hide()
          if (response.error) {
            console.log("Error");
          } else {
            if (response?.data?.usd) {
              this.walletAmount = Number(
                response?.data?.usd?.$numberDecimal || response.data.usd
              );
            }
            if (response?.data?.token) {
				this.tokenArray = response?.data?.token;
            }
          }
        },
        (error) => {
          // this.loaderService.hide()
          console.log("Server Error : ", error);
        }
      );
    }
  }

  /**
   * @description: used to paste wallet address
   */
  pasteWalletAddress() {
    navigator.clipboard
      .readText()
      .then((text) => {
        this.walletAddress.patchValue(text.trim());
        console.log("Wallet address pasted successfully!");
      })
      .catch((error) => {
        console.error("Failed to read clipboard:", error);
      });
  }
    /**
   * @description: used to paste wallet address
   */
	pasteCommissionWalletAddress() {
		navigator.clipboard
		  .readText()
		  .then((text) => {
			this.commissionWalletAddress.patchValue(text.trim());
			console.log("Wallet address pasted successfully!");
		  })
		  .catch((error) => {
			console.error("Failed to read clipboard:", error);
		  });
	  }
  walletDetailsLoading: boolean = true;
  /**
   * @description: used to get the wallet and commision token data
   */
  getTokensData() {
    this.walletDetailsLoading = true;
    this.tokenArray = [];
    if (this.selectedTab === this.tabs.WALLET) {
      // //this.loaderService.show();
      this.walletService.getTokensDataForMainWallet().subscribe(
        (res) => {
          // this.loaderService.hide()
          if (res.error) {
            console.log(res?.message);
          } else {
            this.tokensArray = res?.data || [];
            this.transactionsFilterForm.patchValue({
              filterToken: this.tokensArray[0],
            });
            this.selectLog(this.selectedLog);
            this.getWalletDetails();
            console.log(
              this.tokensArray,
              "-----------------------------------tokens array "
            );
            this.walletDetailsLoading = false;
          }
        },
        (error) => {
          this.walletDetailsLoading = false;

          // this.loaderService.hide();
          console.log(error);
        }
      );
    } else if (this.selectedTab === this.tabs.COMMISSION) {
      // //this.loaderService.show();
      this.walletService.getTokensData().subscribe(
        (res) => {
          // this.loaderService.hide()
          if (res.error) {
            console.log(res?.message);
          } else {
            this.tokensArray = res?.data || [];

            this.transactionsFilterForm.patchValue({
              filterToken: this.tokensArray[0],
            });
            this.selectLog(this.selectedLog);

            this.getWalletDetails();

            console.log(
              this.tokensArray,
              "-----------------------------------tokens array "
            );
            this.walletDetailsLoading = false;
          }
        },
        (error) => {
          // this.loaderService.hide();
          console.log(error);
          this.walletDetailsLoading = false;
        }
      );
    } else {
      return;
    }
  }
  /**
   * @description: used to get vesting schedule data
   * @param symbol: token symbol
   * @param logo : token logo
   * @param content : html content modal
   */
  getVestingSchedule(symbol, logo, content?) {
    this.coinLogo = logo;
    this.coinName = symbol;
    this.vestingScheduleDetails = {};
    let dataToSend = {
      symbol: symbol,
    };
    this.loaderService.show();
    this.disableClaimButton = true;
    this.walletService.getVestingSchedule(dataToSend).subscribe(
      (res) => {
        this.loaderService.hide();
        if (res.error) {
          console.log(res?.message);
          this.disableClaimButton = false;

          this.toastrService.warning(
            res?.message || this.constants.SOMETHING_UNUSUAL_HAPPEN
          );
        } else {
          this.vestingScheduleDetails = res?.data || [];

          this.vestingScheduleDetails.forEach((item, i) => {
            this.vestingScheduleDetails[i].details = item?.details?.sort(
              (a, b) => Number(a.order) - Number(b.order)
            );
          });
          console.log(this.vestingScheduleDetails);
          if (content && this.vestingScheduleDetails?.length) {
            this.releaseSchedule(content);
          } else {
            this.toastrService.error(this.constants.NO_CLAIMING_SCHEDULE_FOUND);
          }
        }
      },
      (error) => {
        this.disableClaimButton = false;

        this.loaderService.hide();
        this.toastrService.warning(
          error?.error?.message || this.constants.SOMETHING_UNUSUAL_HAPPEN
        );
        console.log(error);
      }
    );
  }
  /**
   * @description: used to open withdraw token
   * @param content : html content modal
   * @param id : schedule id
   * @param symbol: schedule symbol
   * @param chain : schedule chain
   */
  openWithdrawToken(content, id, symbol, chain) {
    console.log(chain, "---------------chain name ");
    this.technology = this.sharedService.getChainDetails(chain);
    console.log(this.technology);
    this.selectedVestingId = id;
    this.tokenWithdrawModal = true;
    this.coinName = symbol;
    this.amount.clearValidators();
    this.amount.updateValueAndValidity();
    this.withdrawRequest(content);
  }
  /**
   * @description: used to submit withdraw amount
   */
  submitWithdrawAmount() {
    if (this.tokenWithdrawModal) {
      this.claimToken();
    } else {
      if (this.withdrawForm.invalid) {
        this.validator.markControlsTouched(this.withdrawForm);
        return;
      }
      if (this.errorMessageAmount) {
        return;
      }
      let value = this.withdrawForm.value;
      value.userConsent = this.confirmWithdraw;
      if (Number(value.amount) < Constants.MIN_WITHDRAW_AMOUNT) {
        this.toastrService.clear();
        this.toastrService.error(
          this.constants.MINIMUM_AMOUNT_WIDHRAWAL +
            " " +
            Constants.MIN_WITHDRAW_AMOUNT
        );
        return;
      }
      if (Number(value.amount) > Number(this.walletAmount)) {
        this.toastrService.clear();
        this.toastrService.error(this.constants.INSUFFICIENT_FUND);
        return;
      }
      if (this.coinName == this.coinNameConst.BTC) {
        value.token = environment.bitcoinBlockIO;
        value.paymode = "bitcoinBlockIO";
      } else if (this.coinName == this.coinNameConst.LTC) {
        value.token = environment.litecoinBlockIO;
        value.paymode = "litecoinBlockIO";
      } else if (this.coinName == this.coinNameConst.ETH) {
        value.token = environment.etheriumBlockIO;
        value.paymode = "etheriumBlockIO";
      } else if (this.coinName == this.coinNameConst.USDT) {
        value.token = environment.tetherBlockIO;
        value.paymode = "tetherBlockIO";
      } else if (this.coinName == this.coinNameConst.BUSD) {
        value.token = environment.BUSD;
        value.paymode = "BUSD";
      } else if (this.coinName == this.coinNameConst.USDC) {
        value.token = environment.USDC;
        value.paymode = "USDC";
      } else if (this.coinName == this.coinNameConst.LTCT) {
        value.token = environment.litecoinBlockIO;
        value.paymode = "litecoinBlockIO";
      } else if (this.coinName == this.coinNameConst.USDTERC) {
        value.token = environment.etherBlockIOERC;
        value.paymode = "USDT(USDT.ERC20)";
      } else if (this.coinName == this.coinNameConst.USDTTRC) {
        value.token = environment.tetherBlockIOTRC;
        value.paymode = "USDT(USDT.TRC20)";
      } else if (this.coinName == this.coinNameConst.USDCERC) {
        value.token = environment.etherBlockIODC;
        value.paymode = "USDC(USDC.ERC20)";
      } else {
        value.token = this.coinName;
        value.paymode = this.coinName;
      }
      if (!value.paymode) {
        this.toastrService.clear();
        this.toastrService.info(this.constants.PAYMODE_BLANK);
        return;
      }
      value.withdrawalType = "USD";
      this.loaderService.show();
      this.disableWithdrawProceedButton = true;
      this.sharedService.withdrawAmount(value).subscribe(
        (res) => {
          this.loaderService.hide();
          if (res.error) {
            this.disableWithdrawProceedButton = false;

            this.toastrService.clear();
            this.toastrService.info(res?.message);
          } else {
            this.disableWithdrawProceedButton = false;

            this.amountService.handlefetchWalletAmount(true);
            this.closePopup();
            this.confirmPoup(this.successPopUp);
            setTimeout(() => {
              this.closePopup();
            }, 3000);
            this.getWalletDetails();
          }
        },
        (error) => {
          this.disableWithdrawProceedButton = false;

          this.loaderService.hide();
          this.toastrService.error(
            error.error.message || this.constants.SOMETHING_WENT_WRONG
          );
          console.log(error);
        }
      );
    }
  }

  /**
   * @description: used to claim token
   */
  claimToken() {
    let DTS = {
      claimingScheduleId: this.selectedVestingId,
      walletAddress: this.walletAddress.value,
    };
    //this.loaderService.show();
    this.disableWithdrawProceedButton = true;

    this.walletService.claimToken(DTS).subscribe(
      (res) => {
        this.loaderService.hide();
        if (res.error) {
          this.toastrService.clear();
          this.toastrService.info(res?.message);
          this.disableWithdrawProceedButton = false;
        } else {
          this.amountService.handlefetchWalletAmount(true);
          this.closePopup();
          this.confirmPoup(this.successPopUp);
          setTimeout(() => {
            this.closePopup();
          }, 3000);
          this.getWalletDetails();
          this.disableWithdrawProceedButton = false;
        }
      },
      (error) => {
        this.loaderService.hide();
        this.toastrService.error(
          error.error.message || this.constants.SOMETHING_WENT_WRONG
        );
        console.log(error);
        this.disableWithdrawProceedButton = false;
      }
    );
  }

  /**
   * @description: used to submit commission amount
   */
  submitCommissionWithdrawAmount() {
    let DTS = {
      userConsent: this.confirmCommissionWithdrawal,
      amount: this.withdrawCommissionForm.value.commissionWalletAmount,
      walletAddress: this.withdrawCommissionForm.value.commissionWalletAddress,
      tokenId: this.commissoinTokenId,
      withdrawalType: this.commissoinWithdrawalType,
    };
    console.log(DTS, "------------------------data to send ");
    this.loaderService.show();
    this.disablesubmitCommissionWithdrawAmount = true;
    this.walletService.commissionAmountWithdrawal(DTS).subscribe(
      (res) => {
        this.loaderService.hide();
        if (res.error) {
          this.toastrService.clear();
          this.toastrService.info(res?.message);
          this.disablesubmitCommissionWithdrawAmount = false;
        } else {
          this.disablesubmitCommissionWithdrawAmount = false;

          this.closePopup();
          this.confirmPoup(this.successPopUp);
          setTimeout(() => {
            this.closePopup();
          }, 3000);
          this.getWalletDetails();
        }
      },
      (error) => {
        this.disablesubmitCommissionWithdrawAmount = false;

        this.loaderService.hide();
        this.toastrService.error(
          error.error.message || this.constants.SOMETHING_WENT_WRONG
        );
        console.log(error);
      }
    );
  }

  /**
   * @description: used to close modal and reset variables
   */
  closePopup() {
	this.disableClaimButton=false;
    this.selectedPaymentMethod = "Select Token To Receive Funds";
    this.showDropDown = false;
    this.coinLogo = "";
    this.tokenWithdrawModal = false;
    this.errorMessage = null;
    this.coinName = null;
    this.confirmWithdraw = false;
    this.maxCommissionAmount = 0;
    this.withdrawForm.reset();
    this.withdrawCommissionForm.reset();
    this.modalService.dismissAll();
  }

  /**
   * @description: used to open confirmation popup for withdrawing commision wallet
   */
  openConfirmPopUpForCommissionWallet() {
    if (this.withdrawCommissionForm.invalid) {
      this.validator.markControlsTouched(this.withdrawCommissionForm);
      return;
    }
    this.confirmCommissionWithdrawal = false;
    this.modalService.dismissAll();
    this.withdrawConfirm(this.commissionWithdrawConfirmPopUp);
  }

  /**
   * @description: used to open confirm popup
   */
  openConfirmPopUp() {
    if (this.withdrawForm.invalid) {
      this.validator.markControlsTouched(this.withdrawForm);
      if (!this.coinName) {
        this.errorMessage = this.constants.PLEASE_SELECT_PAYMENT_METHOD;
        return;
      }
      return;
    } else if (!this.coinName) {
      this.errorMessage = this.constants.PLEASE_SELECT_PAYMENT_METHOD;
      return;
    }
    console.log(this.coinName);
    let value = this.withdrawForm.value;
    if (!this.tokenWithdrawModal) {
      if (Number(value.amount) < Constants.MIN_WITHDRAW_AMOUNT) {
        this.toastrService.clear();
        this.toastrService.error(
          this.constants.MINIMUM_AMOUNT_WIDHRAWAL +
            " " +
            Constants.MIN_WITHDRAW_AMOUNT
        );
        return;
      }
      if (Number(value.amount) > Number(this.walletAmount)) {
        this.toastrService.clear();
        this.toastrService.error(this.constants.INSUFFICIENT_FUND);
        return;
      }
    }
    this.confirmWithdraw = false;
    this.modalService.dismissAll();
    this.withdrawConfirm(this.withdrawConfirmPopUp);
  }

  /**
   * @description: used to reset error message
   * @param value
   * @param data
   */
  resetErrorMessage(value, data?) {
    console.log(data);
    this.showDropDown = true;
    this.coinName = value;
    this.errorMessage = null;
    if (data) {
      this.coinLogo = data?.image;
      this.selectedPaymentMethod = `${data?.name} (${data?.subName})`;
    } else {
      this.selectedPaymentMethod = `${this.paymentModes[value].name} (${this.paymentModes[value].subName})`;
    }
  }

  /**
   * @description: used to handle of confirm commission withdrawal
   * @param item
   */
  handleConfirmation(item) {
    if (item) {
      this.confirmCommissionWithdrawal = !this.confirmCommissionWithdrawal;
    } else {
      this.confirmWithdraw = !this.confirmWithdraw;
    }
  }

  /**
   * @description: used to open release schedule popup
   * @param content
   */
  releaseSchedule(content) {
    this.modalService.open(content, {
      centered: true,
      size: "md",
      windowClass: "release-token-popup",backdrop:'static'
    });
  }
  /**
   * @description: used to check whether kyc is approved or not
   */
  checkUserKyc() {
    this.loaderService.show();
    this.acceleratorService.checkUserKyc().subscribe(
      (response) => {
        this.loaderService.hide();
        if (response) {
          this.kycApproved = true;
        }
      },
      (error) => {
        this.loaderService.hide();
        console.log("Server Error", error);
      }
    );
  }

  /**
   * @description: used to withdraw request
   * @param content
   * @param item
   */
  withdrawRequest(content, item?) {
    this.errorMessage = "";
    if (!item) {
      this.contentHeader = "Token Withdraw Request";
    } else {
      this.contentHeader = "Fund Withdraw Request";
    }
    this.withdrawCommissionForm.reset();
    if (item) {
      this.maxCommissionAmount = item?.quantity || item;
      this.commissionChainName = item?.chain || "USD";
      this.commissoinWithdrawalType = item?.symbol || "USD";
      this.commissoinTokenId =
        item?._id || JSON.parse(localStorage.getItem("_u"))?._id;
      console.log(this.maxCommissionAmount, "------------------------");
      console.log(item, "------------------------");
      this.commissionWalletAmount.setValidators([
        Validators.max(this.maxCommissionAmount),
        Validators.min(5),
      ]);
      this.commissionWalletAmount.updateValueAndValidity();
    } else {
      this.commissionWalletAmount.clearValidators();
      this.commissionWalletAmount.updateValueAndValidity();
    }
    this.modalReference = this.modalService.open(content, {
      centered: true,
      size: "md",
      backdrop: "static",
      windowClass: "withdrawl-popup",
    });
  }
  /**
   * @description: used to open withdraw confirm popup
   * @param content2
   */
  withdrawConfirm(content2) {
    this.modalService.open(content2, {
      centered: true,
      size: "md",
      windowClass: "withdrawl-popup",
    });
  }
  /**
   * @description: open confirm popup
   * @param content3
   */
  confirmPoup(content3) {
    this.modalService.open(content3, { centered: true, size: "sm" });
  }

  /**
   * @description: used to open confirm error popup
   * @param content4
   */
  confirmErrorPoup(content4) {
    this.modalService.open(content4, { centered: true, size: "sm" });
  }

  /**
   * @description: used to go to transactions
   * @param data
   * @param schedule
   */
  goToTransactions(data?, schedule?) {
    console.log(schedule);
    console.log(schedule?.symbol);
    if (schedule?.symbol) {
      this.transactionsFilterForm?.patchValue({
        filterToken: schedule?.symbol,
      });

      this.selectedLog = "PURCHASE";
      this.selectLog(this.selectedLog);
    }
    this.selectedLog = "PURCHASE";
    this.modalService.dismissAll();
  }

  /**
   * @description: keydown function to set validation for number field
   * @param $event
   * @returns
   */
  checkInputValue($event) {
    if (
      !(
        ($event.keyCode > 95 && $event.keyCode < 106) ||
        ($event.keyCode > 47 && $event.keyCode < 58) ||
        $event.keyCode == 8 ||
        $event.keyCode == 190
      )
    ) {
      return false;
    }
  }

  /**
   * @description: used to check whether claim started or not
   * @param date
   * @returns claim started or not
   */
  claimStarted(date) {
    let presentTime = new Date().getTime();
    let time = new Date(date).getTime();
    let started = false;
    if (presentTime >= time) {
      started = true;
    }
    return started;
  }

  /**
   * @description: used to close modal and reset variables
   */
  closePopupWithdraw() {
    this.coinName = null;
    this.maxCommissionAmount = 0;
    this.withdrawForm.reset();
    this.withdrawCommissionForm.reset();
    this.modalReference.close();
  }

  /**
   * @description: used to set selected tab
   * @param tab : selected tab
   */
  selectTab(tab) {
    if (this.selectedTab != tab) {
      this.tokenArray = [];
      this.selectedTab = tab;
      if (this.selectedTab === this.tabs.WALLET) {
        this.selectedLog = "DEBIT";
      } else {
        this.selectedLog = "EARNINGDEBIT";
      }
      this.showRightSlider = true;
      this.getWalletDetails();
      this.getTokensData();
    }
  }

  /**
   * @description: used to check fund amount validation
   * @returns error
   */
  checkFundAmount() {
    if (!this.amountToAdd) {
      this.error(this.constants.ENTER_AMOUNT);
    } else {
      if (this.amountToAdd < Constants.MIN_DEPOSIT_AMOUNT) {
        this.error(
          "Amount must be greater than or equal to " +
            Constants.MIN_DEPOSIT_AMOUNT
        );
        return;
      } else if (this.amountToAdd > 1000000000) {
        this.error(this.constants.MAX_LIMIT);
      } else {
        this.error("");
      }
    }
  }
  /**
   * @description: used to check withdraw amount validation
   * @returns error
   */
  checkWithdrawAmount() {
    console.log(this.amount.value);
    if (this.amount.value == 0) {
      this.errorMessageAmount = this.constants.ENTER_AMOUNT;
    } else if (this.amount.value) {
      if (this.amount.value < Constants.MIN_WITHDRAW_AMOUNT) {
        this.errorMessageAmount =
          "Amount must be greater than or equal to " +
          Constants.MIN_DEPOSIT_AMOUNT;
        return;
      } else if (this.amount.value > Number(this.walletAmount)) {
        this.errorMessageAmount = this.constants.MAX_LIMIT;
      } else {
        this.errorMessageAmount = null;
      }
    } else {
      this.errorMessageAmount = null;
    }
  }

  /**
   * @description: used to open add fund modal
   * @param content
   */
  openPopupOne(content) {
    this.isCashCouponScreen = false;
    this.gatewayData = {};
    this.gateResponse = false;
    this.amountToAdd = null;
    this.coinName = null;
    this.amountToAdd = null;
    this.modalRef = this.modalService.open(content, {
      centered: true,
      size: "md",
      windowClass: "withdrawl-popup",
      backdrop: "static",
      keyboard: false,
      ariaLabelledBy: "modal-basic-title",
    });
  }
  /**
   * @description: used to close qrcode popup
   * @param type
   */
  closePopupPayment(type) {
    this.buttonClicked = true;
    let message = "";
    if (type == 1) {
      message = this.constants.TRANSACTION_SUCCESSFULL;
      this.toastrService.success(message, this.constants.SUCCESS, {
        timeOut: 2000,
      });
    } else if (type == 2) {
      message = this.constants.INVOICE_SAVED;
      this.toastrService.success(message, this.constants.SUCCESS, {
        timeOut: 2000,
      });
    } else {
      message = this.constants.INVOICE_CANCELLED_AUTOMATICALLY;
      this.toastrService.clear();
      this.toastrService.error(message, this.constants.ERROR, {
        timeOut: 3000,
      });
    }
    this.showDropDown = false;
    this.selectedPaymentMethod = "Choose payment method";
    let that = this;
    setTimeout(function () {
      that.modalService.dismissAll();
      this.buttonClicked = false;
    }, 2000);
  }

  error(message) {
    this.errorMessage = message;
    this.successMessage = "";
  }
  /**
   * @description: used to create fund transaction
   */
  createTransaction() {
    this.buttonClicked = false;
    if (this.amountToAdd) {
      if (this.amountToAdd < Constants.MIN_DEPOSIT_AMOUNT) {
        this.error(
          "Amount must be greater than or equal to " +
            Constants.MIN_DEPOSIT_AMOUNT
        );
        return;
      } else {
        this.error("");
      }
    } else {
      this.error(this.constants.ENTER_AMOUNT);
      return;
    }
    console.log(this.coinName);
    if (!this.coinName) {
      if (this.coinName != 0) {
        this.error(this.constants.SELECT_COIN);
        return;
      }
    } else {
      this.error("");
    }
    let dataToSend: any = {
      token: this.paymentModes[this.coinName].value,
      amount: this.amountToAdd,
      type: "deposit",
      paymode: this.paymentModes[this.coinName].name,
    };
    if (!dataToSend.paymode) {
      this.error("Paymode blank");
      return;
    }
    if (localStorage.getItem("interestFor")) {
      dataToSend.interestFor = localStorage.getItem("interestFor");
    }
    this.disableAddAmountButton = true;
    this.loaderService.show();
    this.sharedService.createTransaction(dataToSend).subscribe(
      (response) => {
        this.loaderService.hide();
        if (response.error) {
          console.error(response.message);
          this.disableAddAmountButton = false;

          this.error(response.message || this.constants.SOME_ERROR_OCCURED);
        } else {
          if (localStorage.getItem("interestFor")) {
            this.registerInterest(localStorage.getItem("interestFor"));
          }
          this.gateResponse = true;
          this.gatewayData = response.data;
          this.getWalletAmount();
          this.amountService.setPayment("Y");
          this.disableAddAmountButton = false;
        }
      },
      (error) => {
        this.disableAddAmountButton = false;

        this.loaderService.hide();
        console.error(error);
        this.error(error.error.message || this.constants.SERVER_ERROR);
        this.toastrService.clear();
        this.toastrService.error(error.error.message, this.constants.ERROR, {
          timeOut: 3000,
        });
      }
    );
  }

  /**
   * @description: used to register user interest
   * @param token
   */
  registerInterest(token) {
    let dataToSend = {
      symbol: token,
      amount: this.amountToAdd,
    };
    this.sharedService.registerUserInterest(dataToSend).subscribe(
      (res) => {
        if (res.error) {
          console.log(res?.message);
        } else {
          this.amountService.setShowInterest(true);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
  /**
   * @description: used to get wallet amount
   */
  getWalletAmount() {
    this.walletService.getWallet().subscribe(
      (response) => {
        if (response.error) {
          console.log("Error");
        } else {
          this.amountService.setWalletConnection(response.data?.walletExist);
          if (response.data.balance) {
            this.amountService.setMessage(
              response.data.balance.$numberDecimal || response.data.balance
            );
          } else {
            this.walletAmount = null;
          }
        }
      },
      (error) => {
        console.log("Server Error : ", error);
      }
    );
  }

  /**
   * @description: used to call api according to selected log
   * @param data
   */
  selectLog(data?) {
    this.showRightSlider = true;
    if (data) {
      this.selectedLog = data;
      this.transactionsFilterForm.patchValue({
        filterToken: this.tokensArray[0],
      });
    }
    if (this.selectedLog == this.walletLogType.DEBIT) {
      this.getDeposit();
    } else if (this.selectedLog == this.walletLogType.PURCHASE) {
      this.getWithdrawl();
    } else if (this.selectedLog == this.walletLogType.CREDIT) {
      this.getCredit();
    } else if (this.selectedLog == this.walletLogType.EARNING_DEBIT) {
      this.getEarningDebitTransactions();
    } else if (this.selectedLog == this.walletLogType.EARNING_CREDIT) {
      this.getEarningCreditTransactions();

      console.log("---------------------------------------------------");
    } else if (this.selectedLog == this.walletLogType.COMMISSION_WALLET) {
      this.getEarningWithdrawalTransactions();

      console.log("---------------------------------------------------");
    } else {
      return;
    }
  }

  /**
   * @description: used to filter token
   */
  onFilterChange() {
    this.selectLog();
    console.log(this.transactionsFilterForm.value.filterToken);
  }
  loadingDepositeData: boolean = true;
  /**
   * @description: used to get deposit listing
   */
  getDeposit() {
    this.loadingDepositeData = true;
    let DTS: any = {};
    //this.loaderService.show();
    this.sharedService.getMainWalletDebit(DTS).subscribe(
      (response) => {
        this.loaderService.hide();
        if (response.error) {
          console.log("Error");
        } else {
          this.depositArray = response.data;
          this.loadingDepositeData = false;
        }
      },
      (error) => {
        this.loaderService.hide();
        this.loadingDepositeData = false;

        console.log("Server Error ", error);
      }
    );
  }
  /**
   * @description: used to copy data
   * @param text
   */
  cpyToClipboard(text) {
    document.addEventListener("copy", (e: ClipboardEvent) => {
      e.clipboardData.setData("text/plain", text);
      e.preventDefault();
      document.removeEventListener("copy", null);
    });
    document.execCommand("copy");
    this.toastrService.success(
      this.constants.COPIED_TO_CLIPBOARD,
      this.constants.SUCCESS,
      { timeOut: 3000 }
    );
  }

  loadingPurchaseTransactionData: boolean = true;
  /**
   * @description: used to get withdrawal listing
   */
  getWithdrawl() {
    this.loadingPurchaseTransactionData = true;
    let DTS: any = {};
    if (this.transactionsFilterForm?.value?.filterToken) {
      DTS.symbol = this.transactionsFilterForm?.value?.filterToken;
    }
    //this.loaderService.show();
    this.sharedService.getMainWalletWithDrawal(DTS).subscribe(
      (response) => {
        this.loaderService.hide();

        if (response.error) {
          console.log("Error");
        } else {
          this.withdrawalsArray = response?.data;
          this.loadingPurchaseTransactionData = false;
        }
      },
      (error) => {
        // this.loaderService.hide();
        this.loadingPurchaseTransactionData = false;

        console.log("Server Error ", error);
      }
    );
  }
  loadingCreditData: boolean = true;
  /**
   * @description: used to get credit listing
   */
  getCredit() {
    this.loadingCreditData = true;
    let DTS: any = {};

    //this.loaderService.show();
    this.sharedService.getMainCredits(DTS).subscribe(
      (response) => {
        // this.loaderService.hide();

        if (response.error) {
          console.log("Error");
        } else {
          this.creditsArray = response?.data;
          console.log(
            this.creditsArray,
            "----------------------------------------creditsArray"
          );
          this.loadingCreditData = false;
        }
      },
      (error) => {
        this.loadingCreditData = false;

        // this.loaderService.hide();
        console.log("Server Error ", error);
      }
    );
  }
  loadingEarningDebitData: boolean = true;
  /**
   * @description: used to get earning debit transaction
   */
  getEarningDebitTransactions() {
    this.loadingEarningDebitData = true;
    let DTS: any = {};
    //this.loaderService.show();
    this.sharedService.getEarningDebitTransactions(DTS).subscribe(
      (response) => {
        // this.loaderService.hide();

        if (response.error) {
          console.log("Error");
        } else {
          this.earningDebitTransactionsArray = response?.data;
          this.loadingEarningDebitData = false;
        }
      },
      (error) => {
        this.loadingEarningDebitData = false;

        // this.loaderService.hide();
        console.log("Server Error ", error);
      }
    );
  }
  loadingearningCreditData: boolean = true;
  /**
   * @description: used to get earning credit transactions
   */
  getEarningCreditTransactions() {
    this.loadingearningCreditData = true;
    let DTS: any = {};
    //this.loaderService.show();
    this.sharedService.getEarningCreditTransactions(DTS).subscribe(
      (response) => {
        // this.loaderService.hide();

        if (response.error) {
          console.log("Error");
        } else {
          this.earningCreditTransactionsArray = response?.data;
          this.loadingearningCreditData = false;
        }
      },
      (error) => {
        // this.loaderService.hide();
        this.loadingearningCreditData = false;

        console.log("Server Error ", error);
      }
    );
  }
  loadingearningWithdrawalData: boolean = true;

  /**
   * @description: used to get earning withdrawal transactions
   */
  getEarningWithdrawalTransactions() {
    this.loadingearningWithdrawalData = true;

    let DTS: any = {};
    if (this.transactionsFilterForm?.value?.filterToken) {
      DTS.symbol = this.transactionsFilterForm?.value?.filterToken;
    }
    DTS.walletType = "COMMISSION_WALLET";
    //this.loaderService.show();
    this.sharedService.getEarningWithdrawalTransactions(DTS).subscribe(
      (response) => {
        // this.loaderService.hide();

        if (response.error) {
          console.log("Error");
        } else {
          console.log(response, "---------");
          this.earningWithdrawalTransactionsArray = response?.data;
          this.loadingearningWithdrawalData = false;
          console.log(
            this.earningWithdrawalTransactionsArray,
            "-------------------------earningWithdrawalTransactionsArray"
          );
        }
      },
      (error) => {
        // this.loaderService.hide();
        this.loadingearningWithdrawalData = false;

        console.log("Server Error ", error);
      }
    );
  }
  /**
   * @description: used to open view rejection reason popup
   * @param content
   * @param reason
   */
  showRejectionReason(content, reason) {
    this.rejectionMessage = reason;
    this.modalService.open(content, {
      centered: true,
      size: "md",
      windowClass: "withdrawl-popup",
    });
  }
  /**
   * @description: used to show/hide dropdown
   */
  handleDropDown() {
    this.showDropDown = !this.showDropDown;
  }
  ordinal_suffix_of(i) {
    var j = i % 10,
      k = i % 100;
    if (j == 1 && k != 11) {
      return i + "st";
    }
    if (j == 2 && k != 12) {
      return i + "nd";
    }
    if (j == 3 && k != 13) {
      return i + "rd";
    }
    return i + "th";
  }
  convertUTCtoCustomFormat(date){
    // return new Date(date).toUTCString();
    return moment?.utc(date)?.format('MMMM Do YYYY, h:mm:ss a');

  }
}
