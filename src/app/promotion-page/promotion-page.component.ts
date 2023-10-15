import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AppService } from '../services/app.service';
import { LoaderService } from '../shared/services';
declare var $: any;
@Component({
  selector: 'app-promotion-page',
  templateUrl: './promotion-page.component.html',
  styleUrls: ['./promotion-page.component.css']
})
export class PromotionPageComponent implements OnInit {

	/*****Variable*****/
	 pageId = null;
	 referralId = null;
	 pageHtml = null;

	constructor(
		public route: ActivatedRoute,
		private router:Router,
		 private appService:AppService,
		 private loaderService: LoaderService
		 ) { }

	ngOnInit(): void {
		this.route.params.subscribe((params) => {
			if (params['pageId']) {
			this.pageId = params['pageId'];
			this.referralId= params['referralId']
			this.getHtml();
			} else {
			this.router.navigate(['auth']);
			}
		})
	}

	getHtml(){
		let data = {
			pageId:this.pageId,
			pageName:this.pageId,
			referralId:this.referralId,
			clientUrl:environment.clientUrl+"auth/all-signup/"
		}
		this.loaderService.show();
		this.appService.getHtmlForLandingPage(data).subscribe(
			(response)=>{
		this.loaderService.hide();
				let cssForPage = response.cssForPage;
				if(response.cssLinks){
					response.cssLinks.forEach(element => {
						console.log("css elemnet links",element);
						var elem = document.createElement('link');
						elem.rel = ' stylesheet'
						elem.href= element;
						document.head.appendChild(elem);
					});
				}
				var styleSheet = document.createElement("style")
				styleSheet.innerText = cssForPage
				document.head.appendChild(styleSheet)
				this.pageHtml = response.page
				var contentDiv = document.getElementById("contentDiv");
				contentDiv.innerHTML = response.page;
			},
			(error)=>{
		this.loaderService.hide();
				console.log('Error occur', error);
				this.router.navigate(['auth']);
			}
		)
	}
}
