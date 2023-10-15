import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LoaderService } from 'src/app/shared/services';
import { ToastrService } from 'ngx-toastr';
import { AcceleratorService } from '../services/accelerator.service';
import { StartupService } from '../../startup/startup.service';
import { Constants } from 'src/app/config/constant';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  /** Array */
  defaultStartups: any = []
  upcomingStartUpArray:any=[]
  StartUpArray:any=[]
  pastStartUpArray:any=[]
  ongoingStartUpArray:any=[]
  /** String */
  selectedTab = 'ongoing';
  /** Boolean */
  showIframe: boolean = false;
  loadingDefaultStartupData: boolean = true;
  isMobileScreen: boolean = false;
  /** Variable */
	public safeURL: SafeResourceUrl;
  /** Constant */
  startupRoundStatus = Constants.STARTUP_ROUND_STATUS
loadingStatusDataAccordingToStatus:boolean=true
  constructor(private router: Router, private _sanitizer: DomSanitizer,
  	private toastrService: ToastrService,
    private loaderService: LoaderService,
		private acceleratorService: AcceleratorService,
		private startupService:StartupService) {

		// this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/watch?v=qIU767-NIho');
   }

  ngOnInit(): void {    
    let width = window.screen.availWidth;
		if(width <= 667 && width >= 320){
			this.isMobileScreen = true;
		}   
    this.fetchStartUps();
    this.getDefaultStartups();
    this.getStartupDataAccordingToStatus();
  }

  /**
   * @description: used to get items per slide value in corousel
   * @returns items per slide value
   */
  getItemPerSlides() {
    if (window.innerWidth < 546) {
      return 1;
    } else {
      return 4;
    }
  }

  /**
   * @description: used to get startups listing
   */
  fetchStartUps() {
    this.loadingDefaultStartupData=true
		// this.loaderService.show();
		this.startupService.fetchStartUps().subscribe(response => {
			this.loaderService.hide();
			response.data = JSON.parse(atob(response.data))
			this.StartUpArray = response.data;
			console.log(this.StartUpArray, "____________________")
      this.loadingDefaultStartupData=false
			
		}, error => {
      this.loadingDefaultStartupData=false
			this.loaderService.hide();
			console.log('Server Error : ', error);
		});
  }

  /**
   * @description: used to get startups by id
   * @param id: startup id 
   */
  getDefaultStartups(id?) {
    this.loadingDefaultStartupData=true
      this.safeURL=''
      this.defaultStartups=[]
    let DTS:any={}
    if (id) {
       DTS = {
        id:id
      }
    }
    // this.loaderService .show();
		this.acceleratorService.fetchDefaultStartups(DTS).subscribe(response => {
			this.loaderService.hide();
			if (response.error) {
				console.log('Error');
			} else {
        response.data = JSON.parse(atob(response.data))
        let defaultStartups = response.data;
      
     
        let ongoingObject = defaultStartups?.find(el => el?.rounds?.status === this.startupRoundStatus.ONGOING);
        if (ongoingObject) {
          
          this.defaultStartups = [ongoingObject];

          let ytLink = this.defaultStartups[0]?.ytlink;
          let videoId = ytLink?.split('v=')[1];
          let afterRemovingNewPart = videoId?.split('&ab')[0]
          let embedUrl = 'https://www.youtube.com/embed' + `/${afterRemovingNewPart}` + `?controls=0&showinfo=1&autohide=1`;
          console.log("embed url ongoing",defaultStartups);
        this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
          
          
          return;
        }
        let upcomingObject = defaultStartups?.find(el => el?.rounds?.status === this.startupRoundStatus.UPCOMING);
        if (upcomingObject) {
          this.defaultStartups = [upcomingObject];
          let ytLink = this.defaultStartups[0]?.ytlink;
          let videoId = ytLink?.split('v=')[1];
          let afterRemovingNewPart = videoId?.split('&ab')[0]
          let embedUrl = 'https://www.youtube.com/embed' + `/${afterRemovingNewPart}` + `?controls=0&showinfo=1&autohide=1`;
          console.log("embed url ongoing",defaultStartups);

        this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
          
          
          return;
        }
        let closedObject = defaultStartups?.find(el => el?.rounds?.status === this.startupRoundStatus.CLOSED);
        if (closedObject) {
          this.defaultStartups = [closedObject];
          let ytLink = this.defaultStartups[0]?.ytlink;
          let videoId = ytLink?.split('v=')[1];
          let afterRemovingNewPart = videoId?.split('&ab')[0]
          let embedUrl = 'https://www.youtube.com/embed' + `/${afterRemovingNewPart}` + `?controls=0&showinfo=1&autohide=1&autoplay=1`;
          console.log("embed url ongoing",defaultStartups);

        this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
          
          
          return;

        }
        
        console.log(this.defaultStartups,'-----------------------------------')
        this.loadingDefaultStartupData=false
       
			}
		}, error => {
      this.loadingDefaultStartupData=false
			this.loaderService.hide();
			this.toastrService.error(error.error.message, '', 
      {
				timeOut: 3000,
			});
		});
  }

  /**
   * @description: used to get past,upcoming and ongoing startup listing
   */
  getStartupDataAccordingToStatus() {
    this.loadingStatusDataAccordingToStatus=true
    // this.loaderService.show();
		this.acceleratorService.getStartupDataAccordingToStatus().subscribe(response => {
			this.loaderService.hide();
			if (response.error) {
				console.log('Error');
      } else {
        response.data = JSON.parse(atob(response.data))
        this.pastStartUpArray = response?.data?.closedStartups;
        this.upcomingStartUpArray = response?.data?.upcomingStartups;
        this.ongoingStartUpArray = response?.data?.ongoingStartups;
        if (!this.ongoingStartUpArray?.length) {
          this.selectedTab = 'upcoming';
        }
        if (!this.upcomingStartUpArray?.length) {
          this.selectedTab = 'past';
        }
        
        console.log(response.data, '++++++++++++++++++++++++++++++++++')
        this.loadingStatusDataAccordingToStatus=false
			}
		}, error => {
      this.loadingStatusDataAccordingToStatus=false
			this.loaderService.hide();
			this.toastrService.error(error.error.message, '', {
				timeOut: 3000,
			});
		});
  }

  /**
   * @description: used to set the selected tab value
   * @param tab : selected tab
   */
  handleTabChage(tab){
    this.selectedTab = tab;
  }

  /**
   * @description: used to navigate to project sale component
   */
  goToPublicSale(){
    this.router.navigate(['/project-sale'])
  }

  /**
   * @description: used to redirect to startup details
   * @param id : startup id
   * @param roundId : round id
   */
  redirectToStartup(id,roundId) {
    this.router.navigate([`startup/details/${id}/${roundId}`]);    
  }

  onClickOfParticipate(paramsStartupId,paramsRoundId){
    this.router.navigate([`startup/participations/${paramsStartupId}/${paramsRoundId}`]);  
  }

  /**
   * @description: used to format date 
   * @param dateString: date 
   * @returns formatted date
   */
   formatDate(dateString) {
    // Create an array of month names
    var monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    // Create a new Date object from the input string
    var date = new Date(dateString);
  
    // Extract the day, month, and year from the date object
    var day = date.getDate().toString().padStart(2, '0');
    var month = monthNames[date.getMonth()];
    var year = date.getFullYear();
  
    // Format the date as "DD/Month/YYYY"
    var formattedDate = day + "/" + month + "/" + year;
  
    // Return the formatted date
    return formattedDate;
  }
    
  /**
   * @description: used to show iframe
   */
  onClickOfPlayButton() {
    console.log('-------------------------------');
    this.showIframe = !this.showIframe;
  }
}
