import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StartupService } from '../startup.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LoaderService } from 'src/app/shared/components/loader/loader.service';
import { Constants } from 'src/app/config/constant';
@Component({
  selector: 'app-startup-details',
  templateUrl: './startup-details.component.html',
  styleUrls: ['./startup-details.component.css']
})
export class StartupDetailsComponent implements OnInit {
  /** Array */
  StartUpArray:any=[]
  /** Object */
  projectDetails:any={}
  /** Variable */
  startupFilter: any
  public safeURL: SafeResourceUrl;
  /** Boolean */
  showIframe:boolean=false
  /** Constant */
  startupRoundStatus = Constants.STARTUP_ROUND_STATUS

  constructor(
	  	public router: Router,
	  	public route: ActivatedRoute,
		private _sanitizer: DomSanitizer,
		private loaderService: LoaderService,
		private startupService: StartupService,
    ) {}

	ngOnInit(): void {
		this.fetchStartUps();
		this.route.params.subscribe((params) => {
			console.log(params, "params");
			if (params?.id && params?.roundId) {
			  this.fetchProjects(params?.id,params?.roundId)			
			}		  
		})		
  }

  /**
   * @description: used to navigate to startup participation details
   * @param paramsStartupId: startup id 
   * @param paramsRoundId: round id 
   */
  onClickOfParticipate(paramsStartupId,paramsRoundId){
    this.router.navigate([`startup/participations/${paramsStartupId}/${paramsRoundId}`]); 
  }
  /**
   * @description: used to get the startup array listing
   */
  fetchStartUps() {
		this.loaderService.show();
		this.startupService.fetchStartUps().subscribe(response => {
			this.loaderService.hide();
			response.data = JSON.parse(atob(response.data))
			this.StartUpArray = response.data;
		}, error => {
			this.loaderService.hide();
			console.log('Server Error : ', error);
		});
  }

  /**
   * @description: used to navigate to home
   */
  goBackToHome(){
	this.router.navigate(['/launchpad/home']);
  }

   /**
	* @description: used to get the project details for upcoming,ongoing and closed rounds
	* @param id : startup id
	* @param roundId : round id
	*/
	fetchProjects(id, roundId?) {
		let DTS: any = {
			id: id
		}
		if (roundId) {
			DTS.roundId=roundId 
		}
		
		this.loaderService.show();
		this.startupService.fetchProjects(DTS).subscribe(response => {
			this.loaderService.hide();
			if (response.error) {
				console.log('Error');
			} else {
				if (!roundId) {
					response.data = JSON.parse(atob(response.data))
					let projectDetails = response.data;
				 
					let ongoingObject = projectDetails?.find(el => el?.rounds?.status === this.startupRoundStatus.ONGOING);
					if (ongoingObject) {					  
						this.projectDetails = ongoingObject;
						let ytLink = this.projectDetails?.ytlink;
          				let videoId = ytLink?.split('v=')[1];
         				let afterRemovingNewPart = videoId?.split('&ab')[0]
          				let embedUrl = 'https://www.youtube.com/embed' + `/${afterRemovingNewPart}` + `?controls=0&showinfo=1&autohide=1&autoplay=1`;
        				this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl(embedUrl);          
					  	return;
					}
					let upcomingObject = projectDetails?.find(el => el?.rounds?.status === this.startupRoundStatus.UPCOMING);
					if (upcomingObject) {
						this.projectDetails = upcomingObject;
						let ytLink = this.projectDetails?.ytlink;
						let videoId = ytLink?.split('v=')[1];
						let afterRemovingNewPart = videoId?.split('&ab')[0]
						let embedUrl = 'https://www.youtube.com/embed' + `/${afterRemovingNewPart}` + `?controls=0&showinfo=1&autohide=1&autoplay=1`;
			  
						this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
						return;
					}
					let closedObject = projectDetails?.find(el => el?.rounds?.status === this.startupRoundStatus.CLOSED);
					if (closedObject) {
						this.projectDetails = closedObject;
						let ytLink = this.projectDetails?.ytlink;
						let videoId = ytLink?.split('v=')[1];
						let afterRemovingNewPart = videoId?.split('&ab')[0]
						let embedUrl = 'https://www.youtube.com/embed' + `/${afterRemovingNewPart}` + `?controls=0&showinfo=1&autohide=1&autoplay=1`;
			  
						this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
						return;
			
					}
					console.log(projectDetails,'------------------------projectDetails')

				} else {
					
					response.data = JSON.parse(atob(response.data));
					this.projectDetails = response.data[0];
					let ytLink = this.projectDetails?.ytlink;
					let videoId = ytLink?.split('v=')[1];
					let afterRemovingNewPart = videoId?.split('&ab')[0]
					let embedUrl = 'https://www.youtube.com/embed' + `/${afterRemovingNewPart}` + `?controls=0&showinfo=1&autohide=1&autoplay=1`;
		  
				  	this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
					console.log(response?.data,'--------------------------------')
				}
				
			}      
			
		}, error => {
			this.loaderService.hide();
		});
  }

   /**
	* @description: used to show/hide iframe
	*/
	onClickOfPlayButton() {
		console.log('-------------------------------');
		this.showIframe = !this.showIframe;
	}

   /**
	* @description: used to convert token supply value
	* @param n : token supply value
	*/
   convert(n) {
	var sign = +n < 0 ? "-" : "",
	  toStr = n?.toString();
	if (!/e/i?.test(toStr)) {
	  return n;
	}
	if(n){
	var [lead, decimal, pow] = n?.toString()
	  ?.replace(/^-/, "")
	  ?.replace(/^([0-9]+)(e.*)/, "$1.$2")
	  ?.split(/e|\./);
	return +pow < 0 ?
	  sign + "0." + "0"?.repeat(Math?.max(Math.abs(pow) - 1 || 0, 0)) + lead + decimal :
	  sign + lead + (+pow >= decimal?.length ? (decimal + "0"?.repeat(Math?.max(+pow - decimal?.length || 0, 0))) : (decimal?.slice(0, +pow) + "." + decimal?.slice(+pow)))
	}
  }
  

}
