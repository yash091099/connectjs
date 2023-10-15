import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Constants } from 'src/app/config/constant';
import { environment } from "src/environments/environment";
@Component({
  selector: 'app-referral-banner',
  templateUrl: './referral-banner.component.html',
  styleUrls: ['./referral-banner.component.css']
})
export class ReferralBannerComponent implements OnInit {

  /** Event Emitter */
  @Input() selectedReferralData;
  @Output() getSelectedTabEvent = new EventEmitter<any>();
  /** Variable */
  bannerCode:any;
	selectedBannerLink: any;
  /** Constant */
  copiedReferLink = Constants.copyData.COPIED
  copy_link = Constants.copyData.COPY_BANNER_Code
  /** Boolean */
  isImageExpand = false;
  isCopied=false;

  constructor() { }

  ngOnInit(): void {
    this.bannerCode = `<div><a href="${environment.clientUrl}auth/all-signup/${this.selectedReferralData?.memberId}" target="_blank"><img src="${this.selectedReferralData?.promotion?.bannerImage}" alt="Compnay" height="${this.selectedReferralData?.promotion?.bannerHeight}" width="${this.selectedReferralData?.promotion?.bannerWidth}" /></a></div>`
  }

  /**
   * @description: used to copy data 
   * @param data: banner code 
   * @param id: member id 
   */
  copyToClipboard(data, id) {
    console.log("data",data,id);
		this.selectedBannerLink = id
    this.isCopied=true;
		console.log(this.selectedReferralData?.memberId, "memeber ID")
		if (this.selectedReferralData?.memberId) {
			data = data.replace('SPONSOR_ID', this.selectedReferralData?.memberId)
		}
		if (data) {
			setTimeout(() => {
				this.selectedBannerLink = null
        this.isCopied=false;
			}, 3000);
			navigator.clipboard.writeText(data).then(() => {
				console.error(' copy data: ', data);
			}, (err) => {
				console.error('Could not copy data: ', err);

			});
		}
	}

  /**
   * @description: used to show image expandable
   */
  onExpandImageClick(){
    this.isImageExpand = true;
  }

  /**
   * @description: used to get back to banner
   */
  goBackToBanner(){
    this.isImageExpand = false;
  }

  /**
   * @description: used to emit selected tab to go back
   */
  getSelectedTab() {
		let data: any = {
			value: 'referral-campaigns',
			campaignType: 'BANNER'
		}
		// localStorage.setItem("previousTab", "refer-earn");
		this.getSelectedTabEvent.emit(data);
	}
}
