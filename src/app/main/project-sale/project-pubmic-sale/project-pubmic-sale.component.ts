import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/shared/services';
import { ToastrService } from 'ngx-toastr';
import { AcceleratorService } from '../../accelerator/services/accelerator.service';
@Component({
  selector: 'app-project-pubmic-sale',
  templateUrl: './project-pubmic-sale.component.html',
  styleUrls: ['./project-pubmic-sale.component.css']
})
export class ProjectPubmicSaleComponent implements OnInit {
  /** Array */
  pastStartUpArray:any=[]
  ongoingStartUpArray:any=[]
  upcomingStartUpArray: any = []
  /** Boolean */
  onGoingToggleTab: boolean = false;
  upComingToggleTab: boolean = false;
  pastToggleTab: boolean = false;
  loadingData: boolean = false;
  isMobileScreen = false;

  constructor(private toastrService: ToastrService,
		private loaderService: LoaderService,
		private acceleratorService: AcceleratorService) { }

  ngOnInit(): void {
    let width = window.screen.availWidth;
		if(width <= 667 && width >= 320){
			this.isMobileScreen = true;
		} 
    console.log("mobile screen",this.isMobileScreen);
    this.getStartupDataAccordingToStatus()
  }

  /**
   * @description: used to get past,upcoming and ongoing startup listing
   */

  getStartupDataAccordingToStatus() {
    this.loadingData=true
    // this.loaderService.show();
		this.acceleratorService.getStartupDataAccordingToStatus().subscribe(response => {
			this.loaderService.hide();
			if (response.error) {
				console.log('Error');
      } else {
        response.data = JSON.parse(atob(response.data))     
        this.pastStartUpArray = response?.data?.closedStartups;
        this.upcomingStartUpArray =response?.data?.upcomingStartups;
        this.ongoingStartUpArray = response?.data?.ongoingStartups;
        console.log(response.data, '++++++++++++++++++++++++++++++++++')
        console.log("past startups-------",this.pastStartUpArray);
        // this.pastStartUpArray = this.pastStartUpArray.slice(0, 2);
        // console.log("first two past array====",this.pastStartUpArray)

          this.loadingData=false
			}
		}, error => {
      this.loadingData=false
			this.loaderService.hide();
			this.toastrService.error(error.error.message, '', {
				timeOut: 3000,
			});
		});
  }

  /**
   * @description: used to set toggle on ongoing,upcoming and past tab
   * @param tab : selected tab
   */
  onClick(tab) {
    if (tab === 'ongoing') {
      this.onGoingToggleTab=!this.onGoingToggleTab
      console.log(tab,'--------------------')
    }
    
    if (tab === 'upcoming') {
      this.upComingToggleTab=!this.upComingToggleTab
      console.log(tab,'--------------------')
      
    }
    if (tab === 'past') {
      this.pastToggleTab=!this.pastToggleTab
      console.log(tab,'--------------------')
      
    }   
    console.log("past toggle tab",this.pastToggleTab);
  }
}
