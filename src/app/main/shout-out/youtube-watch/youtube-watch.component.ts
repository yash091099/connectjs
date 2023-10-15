import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Messages } from 'src/app/config/message';
import { ShoutOutService } from '../service/shout-out.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-youtube-watch',
	templateUrl: './youtube-watch.component.html',
	styleUrls: ['./youtube-watch.component.css']
})
export class YoutubeWatchComponent implements OnInit {
	/*****variale****/
	public videoId: any;
	timeLeftSecond: any = 10;
	public reward = 0;
	public symbol = '';
	public player: any;
	public campignId: any;
	public taskActionStampId: any;
	public totalDuration:any;
	public totalHours:any = 0;
	public totalMin:any = 0;
	public totalSec:any = 0;
	public interval:any;
	public setTimetInterval:any;
	public startTimerforYT = false;
	public hideTime = false;

	/*****Array***/
	public video: any = [];

	/*********Video Player*********/
	public i = 1;
	public grantReward: boolean = false;
	public showCounter: boolean = true;
	/*********Constants*********/
	message = Messages.CONST_MSG

	@ViewChild("waitingModal", { static: true }) waitingModal: ElementRef;

	constructor(
		public toasterService: ToastrService,
		public router: Router,
		private route: ActivatedRoute,
		private modalService: NgbModal,
		private shoutOutService: ShoutOutService
	) { }

	init() {
		if (window['YT']) {
			this.startVideo();
			return;
		}
		var tag = document.createElement('script');
		tag.src = 'https://www.youtube.com/iframe_api';
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		window['onYouTubeIframeAPIReady'] = () => this.startVideo();

	}

	ngOnInit() {
		this.route.queryParams.subscribe((params: any) => {
			console.log(params)
			let data = JSON.parse(atob(params?.id));
			this.video = JSON.parse(data.urlArray);
			this.campignId = data?.campaignId
			this.taskActionStampId = data?.taskActionStampId
			this.reward = data?.reward;
			this.symbol = data?.symbol;
			this.totalDuration = data.duration;
			let totalMinutes = Math.floor(this.totalDuration / 60);
			this.totalHours = Number(Math.floor(totalMinutes / 60));
			this.totalMin = Number(totalMinutes % 60);
			this.totalSec =Number( this.totalDuration % 60);
			console.log(data,this.totalDuration, this.totalHours, this.totalMin, this.totalSec, "_____________",this.reward)
		});
	
		localStorage.setItem("reward", JSON.stringify(this.reward))
		localStorage.setItem("symbol", this.symbol)
		this.video = this.video.filter(element => {
			return element !== null;
		});
		if (this.video?.length) {
			this.videoId = this.video[0]
		}

		if (this.video?.length) {
			this.init();
		}
		this.setTimetInterval = setInterval(()=>{
			if(this.startTimerforYT){
				this.startTimer();
				this.startTimerforYT = false;
			}
		}, 100)
	}

	/**
	 * @description: used to start timer
	 */
	startTimer(){
		this.interval = setInterval(() => {
			console.log("starting timer", this.totalSec, this.totalMin)
			if(this.totalHours == 0 && this.totalMin == 0 && this.totalSec == 0){
				clearInterval(this.interval);
			}else{
				console.log(this.totalHours,this.totalMin,this.totalSec)
				if(this.totalMin == 0 && this.totalHours > 0 && this.totalSec == 0){
					this.totalHours--;
					this.totalMin = 60 
				}
				 if(this.totalSec == 0 && this.totalMin > 0){
					console.log("min 1", this.totalSec)
					this.totalSec = 60;
					this.totalMin--;
				}
				this.totalSec--;

			}
			
		  },1000)
	}

	/**
	 * @description: used to start youtube video
	 */
	startVideo() {
		this.player = new window['YT'].Player('player', {
			videoId: this.videoId,
			playerVars: {
				autoplay: 1,
				modestbranding: 0,
				controls: 0,
				disablekb: 1,
				rel: 0,
				showinfo: 0,
				hideinfo: 1,
				fs: 1,
				playsinline: 1,
			},
	

			events: {
				'onStateChange': this.onPlayerStateChange.bind(this),
				'onError': this.onPlayerError.bind(this),
				'onReady': this.onPlayerReady.bind(this),
			}
		});
		
	}

	/**
	 * @description: state change of player ready
	 */
	onPlayerReady(event) {
		event.target.playVideo();
	}

	/**
	 * @description: youtube player state change function
	 * @param event 
	 */
	onPlayerStateChange(event) {
		console.log("calling on changes")
		switch (event.data) {
			case window['YT'].PlayerState.PLAYING:
				// this.totalSec--;
				this.startTimerforYT = true;
				if (this.cleanTime() == 0) {
					console.log('started +++++++++++++' + this.cleanTime());
				} else {
					console.log('playing +++++++++++=' + this.cleanTime())
				};
				break;

			case window['YT'].PlayerState.PAUSED:
				if (this.player.getDuration() - this.player.getCurrentTime() != 0) {
					event.target.playVideo();
				};
				this.startTimerforYT = false;
				clearInterval(this.interval);
				break;
			case window['YT'].PlayerState.ENDED:
				if (this.i < this.video.length) {
					this.player.loadVideoById(this.video[this.i]);
					this.i++
					this.startTimerforYT = false;
					clearInterval(this.interval);
				} else {
					this.grantReward = true;
					this.hideTime = true;
					this.OpenWaitingModalForCampaign();
				}
				break;
		};
	};

	cleanTime() {
		return Math.round(this.player.getCurrentTime())
	};

	/**
	 * @description: used to distribute reward after user finishes watching video
	 */
	grantRewardAfterWatchComplete() {
		let data = {
			"shoutoutCampaignId": this.campignId,
			"taskActionStampId": this.taskActionStampId
		}
		this.shoutOutService.grantRewardAfterWatchComplete(data).subscribe((res: any) => {
			if (res.error) {
				this.closeModal();
				localStorage.setItem('showToaster', 'true')
				localStorage.setItem('errorMessage',JSON.stringify(res.message || this.message.SOMETHING_WRONG))
				location.href = '/shout-out';

			}
			else {
				localStorage.setItem('showToaster', 'true')
				localStorage.setItem('reward', JSON.stringify(this.reward))
				localStorage.setItem('symbol', this.symbol);
				location.href = '/shout-out';

			}
		}, (err) => {
			this.closeModal();
			localStorage.setItem('showToaster', 'true')
				localStorage.setItem('errorMessage',JSON.stringify(err.error.message || this.message.SOMETHING_WRONG))
				location.href = '/shout-out';

		});
	}

	/**
	 * @description: used to open task verify popup
	 * @param content : html content modal
	 */
	open(content) {
		this.modalService.open(content, {
			ariaLabelledBy: 'modal-basic-title', centered: true, backdrop: 'static',
			keyboard: false
		})
		
	}

	/**
	 * @description: stage change of youtube player error
	 * @param event 
	 */
	onPlayerError(event) {
		switch (event.data) {
			case 2:
				break;
			case 100:
				break;
			case 101 || 150:
				break;
		};
	};

	/**
	 * @description: used to close modal
	 */
	closeModal() {
		this.modalService.dismissAll();
	}

	/**
	 * @description: used to verify task
	 */
	startVerification() {
		this.timeLeftSecond = 10;
		var countDown = setInterval(() => {
			if (this.timeLeftSecond <= 0) {
				this.showCounter = false;
				this.grantRewardAfterWatchComplete();
				clearInterval(countDown);
			} else {
				this.startCounter();
			}
		}, 1000);

	}

	/**
	 * @description: used to set timer on task verification
	 */
	startCounter() {
		this.timeLeftSecond--;
		document.getElementById("seconds").innerHTML = String(this.timeLeftSecond);
	}

	/**
	 * @description: used to open waiting modal of task verification
	 */
	OpenWaitingModalForCampaign() {
		this.modalService.open(this.waitingModal, { centered: true , backdrop: 'static', size:"md", windowClass:"congratulations-popup"});
		this.startVerification();
		
	}
}