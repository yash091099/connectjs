import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { LoaderService } from "src/app/shared/services";
import { ReferService } from "../service/refer.service";
import { environment } from "src/environments/environment";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Constants } from "src/app/config/constant";
import { Messages } from "src/app/config/message";
declare var $: any;
@Component({
  selector: "app-refer-earn",
  templateUrl: "./refer-earn.component.html",
  styleUrls: ["./refer-earn.component.css"],
})
export class ReferEarnComponent implements OnInit {
  /****String***/
  referralLink = "";
  filterData = "";
  disableSaveButton:boolean=false;
  copy_link: string = Constants.copyData.COPY_LINK;
  referLinkModel: any = "";
  selectedCampaign: string = "PAGE";
  editReferLinkModel: any = "";
  userLinkUnavailableMsg = "";
  userLinkAvailableMsg = "";

  /****Variable***/
  public checkReferralLink: any;
  public selectedIndex: any;
  public campaignDetails: any;
  public isMobileScreen = false;

  /****Pagination***/
  totalCount = 0;
  rowsPerPage = 0;
  count = 0;
  currentPage = 1;
  totalBannerCount = 0;
  totalPageCount = 0;

  /****Array***/
  public linkCampaignArrays: any = [];
  public hideme = [];

  /***Constant***/
  constants = Messages.CONST_MSG;
  selectCampaignType = Constants.SELECT_CAMPAIGN_TYPE;

  /****EventEmitter***/
  @Output() getSelectedTabEvent = new EventEmitter<any>();

  constructor(
    private modalService: NgbModal,
    private loaderService: LoaderService,
    private referService: ReferService,
    public toasterService: ToastrService
  ) {}

  ngOnInit(): void {
    let width = window.screen.availWidth;
    if (width <= 667 && width >= 320) {
      this.isMobileScreen = true;
    }
    window.scroll(0, 0);
    this.getlinkCampaignData(this.selectedCampaign);
    this.getDefaultRefferalLink();
  }

  /**
   * @description: used to open edit referral modal
   * @param content : modal html content
   */
  openEditReferral(content) {
    this.editReferLinkModel = this.referLinkModel;
    this.modalService.open(content, {
      centered: true,
      windowClass: "referl-edit",
      size: "md",
    });
  }

  /**
   * @description: used to scroll to id element
   * @param id : id of element
   */
  scrollToId(id: string) {
    console.log("element id : ", id);
    this.referService.scrollToElementById(id);
  }

  /**
   * @description: used to set selected tab of banner and landing page
   * @param selectedTab : selected tab
   */
  handleTabChage(selectedTab) {
    console.log("data selected tab", selectedTab);
    this.hideme = [];
    // this.selectedTab = data;
    this.selectedCampaign = selectedTab;
    console.log("selected campaign", this.selectedCampaign);
    this.currentPage = 1;
    this.getlinkCampaignData(this.selectedCampaign);
  }

  /**
   * @description: used to get campaign listing
   */
  getlinkCampaignData(type, checkBannerData?) {
    this.loadingRefferalTableData = true;
    let dataToSend: any = {
      type: type,
    };
    if (this.filterData) {
      dataToSend.filterData = this.filterData;
    }
    if (this.currentPage) {
      dataToSend.currentPage = this.currentPage;
    }
    // this.loaderService.show();
    this.referService.getlinkCampaignData(dataToSend).subscribe(
      (res) => {
        this.loaderService.hide();
        if (res?.error) {
          this.loaderService.hide();
        } else {
          if (!checkBannerData) {
            this.linkCampaignArrays = res?.data?.campaignDetails || [];
          }
          if (type == this.selectCampaignType.PAGE) {
            this.totalPageCount = res?.data?.totalCount;
          } else {
            this.totalBannerCount = res?.data?.totalCount;
          }
          console.log(
            "link campaign arr=======>>>>>>>>>",
            this.linkCampaignArrays,
            type
          );
          if (this.linkCampaignArrays.length == 0 && this.count < 1) {
            this.getlinkCampaignData("BANNER", true);
            this.count = this.count + 1;
            // this.selectedCampaign = 'BANNER';
          }
          this.totalCount = res.data?.totalCount;
          this.rowsPerPage = res.data?.rowsPerPage;
          this.loadingRefferalTableData = false;
        }
      },
      (error) => {
        this.loadingRefferalTableData = false;
        this.loaderService.hide();
        console.log(error);
      }
    );
  }
  loadingDefaultRefferalLink: boolean = true;
  /**
   * @description: used to get referral link data
   */
  getDefaultRefferalLink() {
    this.loadingDefaultRefferalLink = true;
    // this.loaderService.show();
    this.referService.getRefferalLink().subscribe(
      (res) => {
        this.loaderService.hide();
        if (res?.error) {
          this.loaderService.hide();
          console.log(res?.message);
        } else {
          this.referralLink = res?.data?.memberId;
          this.referLinkModel = this.referralLink;
          this.loadingDefaultRefferalLink = false;
        }
      },
      (error) => {
        this.loadingDefaultRefferalLink = false;
        this.loaderService.hide();
        console.log(error);
      }
    );
  }

  /**
   * @description: used to copy data
   */
  copyToClipboard() {
    if (this.referLinkModel) {
      this.copy_link = Constants.copyData.COPIED;

      setTimeout(() => {
        this.copy_link = Constants.copyData.COPY_LINK;
      }, 5000);

      let link: any =
        environment.clientUrl + "auth/all-signup/" + this.referLinkModel;
      navigator.clipboard.writeText(link).then(
        () => {
          console.error(" copy data: ", this.referLinkModel);
        },
        (err) => {
          console.error("Could not copy data: ", err);
        }
      );
    }
  }

  /**
   * @description: change function of pagination
   * @param pageNumber : selected page number
   */
  pageChanged(pageNumber) {
    this.currentPage = pageNumber;
    this.getlinkCampaignData(this.selectedCampaign);
  }

  /**
   * @description: used to check referral link is available or not
   * @param event
   */
  referralLinkCheck(event) {
    console.log(event.target.value);

    this.checkReferralLink = event.target.value;
    this.userLinkUnavailableMsg = "";
    this.userLinkAvailableMsg = "";

    let dataToSend = {
      memberId: event.target.value,
    };
    // this.loaderService.show();
    this.referService.checkReferralLink(dataToSend).subscribe(
      (res) => {
        this.loaderService.hide();
        if (res?.error) {
          this.loaderService.hide();
        } else {
          this.userLinkAvailableMsg =
            res?.message || this.constants.REFER_LINK_AVAILABLE;
          this.userLinkUnavailableMsg = "";
        }
      },
      (error) => {
        this.loaderService.hide();
        this.userLinkUnavailableMsg =
          error?.error?.message || this.constants.REFERRAL_LINK_NOT_AVAILABLE;
        this.userLinkAvailableMsg = "";
      }
    );
  }

  /**
   * @description: used to update referral link
   * @param data : referral link
   * @returns
   */
  updateReferralLink(data) {
    console.log(this.referralLink, "referralLink link");
    if (data == this.referralLink) {
      this.toasterService.success(this.constants.REFERRAL_LINK_UPDATED);
      this.referLinkModel = data;
      this.referralLink = data;
      this.modalService.dismissAll();
      this.userLinkAvailableMsg = "";
      this.userLinkUnavailableMsg = "";
      return;
    }

    let dataToSend = {
      memberId: data,
    };
    this.loaderService.show();
    this.disableSaveButton = true;
    this.referService.updatedReferralLink(dataToSend).subscribe(
      (res) => {
        this.loaderService.hide();
        if (res?.error) {
          this.loaderService.hide();
          console.log(res?.message);
          this.disableSaveButton = false;
        } else {
          this.toasterService.success(this.constants.REFERRAL_LINK_UPDATED);
          this.referLinkModel = dataToSend?.memberId;
          this.referralLink = dataToSend?.memberId;
          this.modalService.dismissAll();
          this.userLinkAvailableMsg = "";
          this.userLinkUnavailableMsg = "";
          this.disableSaveButton = false;
        }
      },
      (error) => {
        this.toasterService.error(error.error.message);
        this.userLinkAvailableMsg = "";
        this.userLinkUnavailableMsg = "";
        this.loaderService.hide();
        this.disableSaveButton = false;
      }
    );
  }

  /**
   * @description: used to filter campaign listing
   * @param data
   */
  filterCampaignList(data) {
    let dataToSend: any = {};
    this.currentPage = 1;
    if (data && data?.target?.value) {
      dataToSend = {
        selectedCampaign: this.selectedCampaign,
        filterData: data?.target?.value,
      };
      this.filterData = dataToSend?.filterData;
      this.getlinkCampaignData(this.selectedCampaign);
    } else {
      this.filterData = null;
      this.getlinkCampaignData(this.selectedCampaign);
    }
  }

  /**
   * @description: used to emit selected tab data
   * @param value : selected tab
   * @param valueFor : selected data
   */
  getSelectedTab(value, valueFor?) {
    let data: any = {
      value: value,
      valueFor: valueFor,
      campaignType: this.selectedCampaign,
    };
    localStorage.setItem("previousTab", "refer-earn");
    this.getSelectedTabEvent.emit(data);
  }

  /**
   * @description: used to create customized campaign
   * @param value
   * @param valueFor
   */
  CreateCustomizedCampaign(value, valueFor?) {
    let data = {
      value: value,
      valueFor: valueFor,
    };
    this.getSelectedTabEvent.emit(data);
  }
  loadingRefferalTableData: boolean = true;
  /**
   * @description: used to get referral details according to selected campaign id
   * @param id : campaign id
   * @param index : selected index
   */
  getReferralArrayDetails(id, index, content?) {
    this.loadingRefferalTableData = true;
    if (!content) {
      if (
        this.hideme[this.selectedIndex] &&
        (this.selectedIndex || this.selectedIndex == 0)
      ) {
        this.hideme[this.selectedIndex] = !this.hideme[this.selectedIndex];
      }
      this.hideme[index] = true;
      this.selectedIndex = index;
    }

    let dataToSend: any = {
      campaignId: id,
    };
    // this.loaderService.show();
    this.referService.getReferralArrayDetails(dataToSend).subscribe(
      (res) => {
        this.loaderService.hide();
        if (res?.error) {
          this.loaderService.hide();
          this.toasterService.error(
            res?.message || this.constants.SOMETHING_WENT_WRONG
          );
        } else {
          if (content) {
            this.openResponsiveTable(content, res.data);
          } else {
            this.linkCampaignArrays[index].details = res.data;
            this.loadingRefferalTableData = false;
          }
        }
      },
      (error) => {
        this.loadingRefferalTableData = false;
        this.loaderService.hide();
      }
    );
  }

  /**
   * @description: used to expand row up and down
   * @param i : selected index
   */
  hideDiv(i) {
    this.hideme[i] = !this.hideme[i];
    this.selectedIndex == null;
    console.log(this.hideme[i], this.selectedIndex);
  }

  /**
   * @description: used to close all modals and reset filters
   */
  closeModal() {
    this.campaignDetails = null;
    this.editReferLinkModel = null;
    this.userLinkAvailableMsg = "";
    this.userLinkUnavailableMsg = "";
    this.modalService.dismissAll();
  }
  /**
   * @description: used to open campaign details popup
   * @param content1
   * @param details
   */
  openResponsiveTable(content1, details) {
    console.log(details);
    this.campaignDetails = details;
    this.modalService.open(content1, {
      centered: true,
      windowClass: "resposive-popup",
    });
  }
}
