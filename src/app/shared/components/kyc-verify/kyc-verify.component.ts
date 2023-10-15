import { Component, OnInit } from '@angular/core';
import { SettingService } from 'src/app/main/settings/service/service.service';
import { LoaderService } from '../loader/loader.service';

@Component({
  selector: 'app-kyc-verify',
  templateUrl: './kyc-verify.component.html',
  styleUrls: ['./kyc-verify.component.css']
})
export class KycVerifyComponent implements OnInit {

  kycStatus: any;
  linkId: any;
  applicationId: any;
  kycReason:any = [];

  constructor(private service: SettingService, private loderService: LoaderService ) { }

  ngOnInit(): void {
  // Get the URL query string
  const queryString = window.location.search;

  // Parse the query string
  const urlParams = new URLSearchParams(queryString);

  // Get the values of "link" and "applicationId" query parameters
  const linkValue = urlParams.get("link");
  const applicationIdValue = urlParams.get("applicationId");
  this.linkId = linkValue
  this.applicationId = applicationIdValue
  // Use the values as needed
  console.log("link:", linkValue);
  console.log("applicationId:", applicationIdValue);
  this.getKycStatus();
  }

  getKycStatus() {
    let dataToSend = {
      link: this.linkId,
      applicationId: this.applicationId
    }
    this.loderService.show();
		this.service.getKycDetailsByLinkId(dataToSend).subscribe((response) => {
      this.loderService.hide();
			if (response.error) {
				console.log("getProfile Error : ", response);
			} else {
        console.log("get profile details status++++++++++",response);
        this.kycStatus = response?.data[response?.data?.length - 1]?.status;
        this.kycReason = response?.data[response?.data?.length - 1]?.kycResponse?.authentication?.warning
        console.log("data array",response?.data[response?.data?.length - 1]);
        console.log("kyc status",this.kycStatus);
        // this.kycStatus = response?.data?.KYCStatus
			}
		});
	}

}
