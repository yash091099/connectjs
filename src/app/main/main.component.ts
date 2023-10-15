import { Component, OnInit } from '@angular/core';
declare var $: any;
@Component({
	selector: 'app-main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

	/*****Boolean*****/
	isLoggedIn = false;

	constructor() { }

	ngOnInit(): void {

		$(document).ready(function () {
			$(window).on("resize", function (e) {
				checkScreenSize();
			});
		
			checkScreenSize();
			
			function checkScreenSize(){
				var newWindowWidth = $(window).width();
				if (newWindowWidth < 481) {
					$('.side-bar').removeClass('active');
				}
				else
				{
					$('.side-bar').addClass('active');
				}


				if (newWindowWidth < 481) {
					$('.hideMobileClick').click(function(){
						console.log ("=========================clik funnction work on mobile===================================")
			
						$('.side-bar').removeClass("active");
						$('#wrapper').removeClass("blur-body");
					  }
					  );
				}
				else
				{
					// $('.side-bar').addClass('active');
				}	


			}
          
			

		});


		$(document).ready(function () {
		$('.close-btn').click(function(){
			
			$('#wrapper').removeClass("margin-left-250");
		  });

		  $('.menu-btn').click(function(){
			
			$('#wrapper').addClass("blur-body");
		  });
		  $('.close-btn').click(function(){
			
			$('#wrapper').removeClass("blur-body");
		  });

		  $('.close-btn').click(function(){
			
			$('.footer').addClass("width-footer-100");
		  });

		});  
		
		
		if (localStorage.getItem('_u')) {
			this.isLoggedIn = true;
		}
		else {
			this.isLoggedIn = false;
		}
	}
}
