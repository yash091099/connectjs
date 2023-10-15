import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormValidatorService, LoaderService } from 'src/app/shared/services';
import { ShoutOutService } from '../service/shout-out.service';
import { ToastrService } from 'ngx-toastr';
import { Constants } from 'src/app/config/constant';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Messages } from 'src/app/config/message';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import noWhitespaceValidator from 'src/app/shared/services/no-white-space-validator.service';
import { environment } from 'src/environments/environment';
import { AmountService } from 'src/app/shared/services/amount.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CookiesService } from 'src/app/shared/services/cookies.service';
@Component({
	selector: 'app-project-details',
	templateUrl: './project-details.component.html',
	styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {
	/** Form Group */
	twitterContentForm: FormGroup;
	twitterTaskContentForm: FormGroup;
	reverifyForm: FormGroup;
	/** String */
	tweetContent: any = '';
	tweetImage: any = '';
	projectId: any = '';
	shoutoutCampaign: any;
	campaignId: any = '';
	category: any = '';
	campaignUrl: any = '';
	campaignType: any = '';
	mentionHandlesArr: any = '';
	urlArray: any = '';
	reward: any = '';
	symbol:any = '';
	projectName: any = '';
	showErrorMessage: any = '';
	taskActionStampId: any = '';
	taskErrorMessage='';
	handlesError = '';
	selectedModalType= '';
	twitterCommentRegex = /^https:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)$/;
	/** Array */
	campaignsArray: any = [];
	socialArray: any = [];
	activeSocialConnection = []
	primaryTask: any = [];
	/** Constant */
	SOCIAL_CONNECTIONS = Constants.SOCIAL_CONNECTIONS;
	constants = Messages.CONST_MSG
	modalType = Constants.MODAL_TYPE;
	twitterURL = Constants.TWITTER_URL;
	taskPerformContent = Constants.TASK_CONFIRMTION_CONTENT;
	/** Variable */
	projectDetails: any;
	twitterLink:any;
	YoutubeWatchDataToSend: any;
	/** Boolean */
	blinker: boolean = false;
	startVerifyTask = false;
	walletConnected = false;
	/** Integer */
	timeLeftSecond: any = 10;
	taskCounterPercentage = 0;
	completedTaskPercent = 0;
	videosDuration:any = 0;
	/** Object */
	public twitterFollowContent:any = {};
	/** Element Ref */
	@ViewChild("infoModal", { static: true }) infoModal: ElementRef;
	@ViewChild("waitingModal", { static: true }) waitingModal: ElementRef;
	@ViewChild('waitingModal', { static: true }) waitingModalTemplate: TemplateRef<any>;
	private modalRef: NgbModalRef;
	private modalRefInfo: NgbModalRef;
	private modalrefrence: NgbModalRef;
	public modalRefTwo: NgbModalRef;
	private modalrefrenceThree: NgbModalRef;
	@ViewChild("projectDetailsModal") projectDetailsModal: ElementRef;
    @ViewChild("twitterReconnectModal", { static: true }) twitterReconnectModal: ElementRef;

	constructor(public router: Router,
		public fb: FormBuilder,
		private validator: FormValidatorService,
		private modalService: NgbModal,
		public route: ActivatedRoute,
		private loaderService: LoaderService,
		private shoutOutService: ShoutOutService,
		private toastrService: ToastrService,
		private amountService: AmountService,
		public sanitizer: DomSanitizer,
		private authService: AuthService,
		private cookieService: CookiesService) { }

	ngOnInit(): void {
		this.twitterForm();
		let _u = localStorage?.getItem?.('_u');
		let u = JSON.parse(_u);
		this.amountService.getWalletConnection().subscribe((res) => {
			if (res) {
				this.walletConnected = res;
			}
		})
		console.log(u);
		this.route.params.subscribe((params) => {
			if (params?.projectId) {
				this.projectId = params?.projectId;
				this.projectName = params?.projectName;
			}
			if(params?.sponsor){
				localStorage.setItem('sponsor', params?.sponsor);
				let sponsor = params['sponsor'];
				this.verifyReferralLink(sponsor);
			}
			console.log(this.projectId, this.projectName)
		});

		if (!u) {
			console.log('please login ');
			localStorage.setItem('projectName', this.projectName);
			localStorage.setItem('projectId', this.projectId);
			this.router.navigate(['auth/login']);
		} else {
			console.log('user logged in ');
			localStorage.removeItem('projectName')
			localStorage.removeItem('projectId')
		}

		console.log(this.projectId, '------------project id');
		this.createForm();
		this.getProjectById();
		this.getCampaignsByProjectId();
		this.getActiveSocialConnection();

	}

	verifyReferralLink(sponsor) {
		this.authService.verifyReferralLink({ sponsor: sponsor }).subscribe((res: any) => {
			if (res.error) {
				this.cookieService.deleteCookie('sponsor');
				this.cookieService.setCookie('fromSponsor', 'false', 10 * 365);
			} else {
				this.cookieService.setCookie('sponsor', sponsor, 10 * 365);
				this.cookieService.setCookie('fromSponsor', 'true', 10 * 365);
				var linkIndex = -1;
				var visitedLinks: any = [];
				visitedLinks = this.cookieService.get('visitedRef') ? JSON.parse(this.cookieService.get('visitedRef')) : [];
				for (var i = 0; i < visitedLinks.length; i++) {
					if (visitedLinks[i].sponsor === sponsor) {
						linkIndex = i;
						break;
					}
				}
				if (linkIndex === -1) {
					this.authService.updateReferralLinkVisit({ sponsor: sponsor }).subscribe((res: any) => {
						if (res.error) {
							console.log('-----', res.message)
						} else {
							var query: any = { sponsor: sponsor };
							visitedLinks.push(query);
							this.cookieService.setCookie('visitedRef', JSON.stringify(visitedLinks), 10 * 365);
						}
					}, err => {
						this.cookieService.deleteCookie('sponsor');
						this.cookieService.setCookie('fromSponsor', 'false', 10 * 365);
						console.log('-----', err.error.message)
					});
				} else {
					console.log('Link is already visited');
				}
			}
		}, err => {
			console.log('-----', err.error.message)
		});
	}
	/**
	 * @description: used to copy to clipboard
	 * @param data 
	 * @param type 
	 */
	copyToClipboard(data, type?) {
		if (type == 'userHandles') {
			if (data.charAt(0) != '@') {
				data = "@" + data
			}
		}
		navigator.clipboard.writeText(data).then(() => {
			this.toastrService.success(this.constants.COPIED_TO_CLIPBOARD);
		});
	}
	/**
	 * @description: used to create reverify form
	 */
	createForm() {
		this.reverifyForm = this.fb.group({
			verificationUrl: ['', [Validators.required, noWhitespaceValidator, Validators?.pattern(this.twitterCommentRegex)]],
			hideCheckBox: [false],
		});
	}


	get verificationUrl(): any { return this.reverifyForm.get('verificationUrl'); }
	get hideCheckBox(): any { return this.reverifyForm.get('hideCheckBox'); }

	/**
	 * @description: used to get project by id
	 */
	getProjectById() {
		let dataToSend: any = {
			projectId: this.projectId
		}
		this.loaderService.show();
		this.shoutOutService.getProjectById(dataToSend).subscribe((res) => {
			this.loaderService.hide();
			if (res?.error) {
				if (res?.status == 400) {
					this.toastrService.error(res?.message || this.constants.SOMETHING_WENT_WRONG);
					this.router.navigate(['shout-out']);
				}
				console.log(res)
			} else {
				this.projectDetails = res?.data;
				console.log(this.projectDetails, '--------------------------project details array ')
				this.completedTaskPercent = (this.projectDetails?.allCompletedTask / this.projectDetails?.allAvailableTasks )* 100;
				console.log(this.completedTaskPercent, "completed", this.projectDetails?.allCompletedTask,this.projectDetails?.allAvailableTasks)
				this.modalService.open(this.projectDetailsModal, { centered: true, size: 'lg', windowClass: "projects-details", backdrop: 'static', keyboard: false });
			}
		}, (error) => {
			this.loaderService.hide();
			if (error?.error?.status == 400) {
				this.toastrService.error(error?.error?.message || this.constants.SOMETHING_WENT_WRONG);
				this.router.navigate(['shout-out']);
			}
			console.log(error)
		})
	}

	/**
	 * @description: used to get campaign details by project id
	 */
	getCampaignsByProjectId() {
		let dataToSend: any = {
			projectId: this.projectId
		}
		this.loaderService.show();
		this.shoutOutService.getCampaignsByProjectId(dataToSend).subscribe((res) => {
			this.loaderService.hide();
			if (res?.error) {
				console.log(res)
			} else {
				this.campaignsArray = [];
				// this.campaignsArray = res?.data || [];
				this.primaryTask = res?.data?.filter(item => item?.isPrimary && !item?.isTaskCompleted);				
				let secondaryData = res?.data?.filter(item => !item?.isPrimary && !item?.isTaskCompleted);
				let completedData = res?.data?.filter(item => item?.isTaskCompleted);
				this.campaignsArray?.push(...this.primaryTask,...secondaryData,...completedData);
				console.log(this.campaignsArray)
			}
		}, (error) => {
			this.loaderService.hide();
			console.log(error)
		})
	}

	/**
	 * @description: used to add social connection
	 */
	addSocialConnection() {
		let id = JSON.parse(localStorage.getItem('_u'))?._id;
		console.log(id)
		if (this.category == this.SOCIAL_CONNECTIONS.YOUTUBE) {
			window.location.href = `${environment.baseURL}auth/v1/google/social?id=${id}`;
		}
		else if (this.category == this.SOCIAL_CONNECTIONS.TWITTER) {
			window.location.href = `${environment.baseURL}auth/v1/twitter/social?id=${id}`;
		}
		else {
			return;
		}
	}

	/**
	 * @description: used to get active social connection
	 */
	getActiveSocialConnection() {
		this.loaderService.show();
		this.shoutOutService.getSocialConnection().subscribe(
			(resp) => {
				this.loaderService.hide();
				if (resp.error) {
					console.log("Error");
				} else {
					if (!resp.data) return;
					this.socialArray = resp?.data[0]?.social || [];
					for (let i = 0; i < this.socialArray.length; i++) {
						this.activeSocialConnection[this.socialArray[i].type] = {
							active: this.socialArray[i].isActive,
						};
					}
				}
			},
			(err) => {
				this.loaderService.hide();
				console.log(err);
			}
		);
	}

	/**
	 * @description: used to proceed on performing task
	 * @param campaignId 
	 * @param category 
	 * @param campaignUrl 
	 * @param campaignType 
	 * @param urlArray 
	 * @param reward 
	 * @param videosDuration 
	 * @param mentionHandlesArr 
	 * @param tweetContent 
	 * @param tweetImage 
	 * @param task 
	 * @param handleError 
	 * @param symbol 
	 */

	/**
	 * @description: used to open modal for mention handles
	 */
	OpenModalFormentionHandles(data?) {
		if(data){
			this.shoutoutCampaign = data
			this.campaignType = data?.type?.type
			this.campaignId = data?._id
		}
		document.getElementById("OpenModalForMentionHandlesForProjectDetails").click();
	}
    /**
     * @description: used to perform task and start earning
     * @param campaignId 
     * @param category 
     * @param campaignUrl 
     * @param campaignType 
     * @param urlArray 
     * @param reward 
     * @param videosDuration 
     * @param mentionHandlesArr 
     * @param task 
     * @param handleError 
     */
    startEarning(campaignId, category, campaignUrl, campaignType, urlArray?, reward?, videosDuration?, mentionHandlesArr?,task?, handleError?) {
        console.log(campaignType , "campaignType",campaignId, category, campaignUrl, campaignType, urlArray, reward, mentionHandlesArr,task, handleError, videosDuration)
        this.tweetContent=task?.tweetContent;
        this.tweetImage = task?.tweetImage;
        if (!this.walletConnected) {
            this.toastrService.info(Messages.message.PLEASE_CONNECT_WALLET)
        } 
        else if(this.primaryTask?.length && !task?.isPrimary){
			this.toastrService.info(Messages.CONST_MSG.PERFORM_PRIMARY_TASK_FIRST);
			return;
		}
        else {
            if (handleError) {
                this.showErrorMessage = '';
                this.closeModal();
            }
            this.campaignId = campaignId
            this.category = category
            this.campaignUrl = campaignUrl
            if(task?.twitterUserProfilePicture){
                let urlArr = this.campaignUrl?.split("/");
                let length = urlArr?.length
                this.twitterFollowContent.username = urlArr[length-1];
                this.twitterFollowContent.profile = task?.twitterUserProfilePicture;
            }
            if (this.category == this.SOCIAL_CONNECTIONS.TELEGRAM) {
                console.log(this.campaignUrl, "this.campaignUrl")

                this.campaignUrl = this.campaignUrl.replace("t.me", "telegram.me");



            }
            this.campaignType = campaignType
            this.urlArray = urlArray
            this.reward = reward
            this.symbol = task?.projectId?.symbol;
            console.log(this.reward,this.symbol,'============================>>>>>>>>>>>>>>>>>.')
            localStorage.setItem('reward',reward);
            localStorage.setItem('symbol',this.symbol);
            let allHandles = []
            mentionHandlesArr.forEach((item) => {
                if (item.charAt(0) != '@') {
                    item = "@" + item
                }
                allHandles.push(item)
            })
            this.mentionHandlesArr = allHandles
            this.videosDuration = videosDuration;
            if ((this.activeSocialConnection[this.category]?.active || null)|| campaignType ==='Visit'||campaignType==='Signup') {
                this.checkRewardAvailable();
            }
            else {
                if (this.category == this.SOCIAL_CONNECTIONS.TELEGRAM) {
                    this.openModalForTelegram();

                }
                else if (this.category == this.SOCIAL_CONNECTIONS.DISCORD) {
                    this.openModalForDiscord();

                }
                else {
                    console.log('teligram case ')
                    this.OpenModalForSocial();
                }
            }
        }
    }
	
	  	/**
	 * @description: used to check reward is available or not
	 */
		  checkRewardAvailable() {
			let data = {
				shoutoutCampaignId: this.campaignId,
			}
			this.loaderService.show();
			this.shoutOutService.checkRewardAvailable(data).subscribe((resp) => {
				this.loaderService.hide()
				if (resp.error) {
					console.log('Error');
				} else {
					this.shoutoutCampaign = resp.data.shoutoutCampaign;
					if(this.campaignType == this.SOCIAL_CONNECTIONS.ENGAGEMENT ){
						if (this.category == this.SOCIAL_CONNECTIONS.TELEGRAM && this.campaignType == this.SOCIAL_CONNECTIONS.ENGAGEMENT ) {
							this.OpenModalFormentionHandles();
						}else if (this.category == this.SOCIAL_CONNECTIONS.DISCORD && this.campaignType == this.SOCIAL_CONNECTIONS.ENGAGEMENT){
							this.OpenModalFormentionHandlesDiscord();
							// this.OpenModalFormentionHandles();
						}
					}else{
						if (resp.data?.dailyRemaining >= resp.data?.shoutoutCampaign?.reward?.$numberDecimal) {
							console.log(this.shoutoutCampaign,'✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎')
							console.log(resp.data , "resp.data")
						   
								this.insertActionLog();
						}
						else {
							this.toastrService.error(this.constants.DAILY_REWARD_LIMIT_EXCEED);
						}
					}
				
				}
			}, (err) => {
				this.loaderService.hide()
			});
		}

		 	/**
	 * @description: used to insert action logs
	 */
	insertActionLog() {
		let data = {
			shoutoutCampaignId: this.campaignId,
		}
		this.loaderService.show();
		this.shoutOutService.insertActionLog(data).subscribe(
			(resp) => {
				this.loaderService.hide();
				if (resp.error) {
					console.log("Error");
				} else {
					this.taskActionStampId = resp?.data?.taskActionStampId
				
					if(resp?.data?.taskActionStampId && this.category == this.SOCIAL_CONNECTIONS.OTHER && this.campaignType == this.SOCIAL_CONNECTIONS.VISIT){
						// Append/query parameters
						const uniqueId = resp?.data?.taskActionStampId;
						const queryString = `?id=${encodeURIComponent(uniqueId)}`;
						// Append the query string to the URL
						this.campaignUrl += queryString;
						console.log(this.campaignType,this.SOCIAL_CONNECTIONS.VISIT,this.campaignUrl)
						window.open(this.campaignUrl, "_blank");
						this.OpenModalForCampaign();
					}else if((resp?.data?.taskActionStampId && this.category == this.SOCIAL_CONNECTIONS.OTHER && this.campaignType == this.SOCIAL_CONNECTIONS.SIGNUP)){
                        const uniqueId = resp?.data?.taskActionStampId;
						const queryString = `?id=${encodeURIComponent(uniqueId)}`;
						// Append the query string to the URL
						this.campaignUrl += queryString;
						console.log(this.campaignType,this.SOCIAL_CONNECTIONS.VISIT,this.campaignUrl)
						window.open(this.campaignUrl, "_blank");
						this.OpenModalForCampaign();
                    }
					else if ((this.activeSocialConnection[this.category]?.active || null) && this.category == this.SOCIAL_CONNECTIONS.YOUTUBE && this.campaignType == this.SOCIAL_CONNECTIONS.WATCH) {
						this.urlArray = JSON.stringify(this.urlArray)
						this.YoutubeWatchDataToSend = { urlArray: this.urlArray, campaignId: this.campaignId, taskActionStampId: this.taskActionStampId, reward: this.reward, duration: this.videosDuration, symbol: this.symbol }
						this.YoutubeWatchDataToSend = btoa(JSON.stringify(this.YoutubeWatchDataToSend))
						localStorage.setItem('urlArray', this.urlArray)
						localStorage.setItem('campaignId', this.campaignId)
						setTimeout(() => {
							document.getElementById('youtubeWatch').click();
						}, 0);
					} else if ((this.category == this.SOCIAL_CONNECTIONS.TWITTER && this.campaignType == this.SOCIAL_CONNECTIONS.TWEET ) || ((this.category == this.SOCIAL_CONNECTIONS.TELEGRAM||this.category=== this.SOCIAL_CONNECTIONS.DISCORD) && this.campaignType == this.SOCIAL_CONNECTIONS.JOIN_CHAT)) {
						this.OpenModalFormentionHandles();
					}else if(this.category == this.SOCIAL_CONNECTIONS.TWITTER){
						this.OpenModalForTwitterTask();
					} else if((this.category === this.SOCIAL_CONNECTIONS.TELEGRAM ||this.category=== this.SOCIAL_CONNECTIONS.DISCORD)&& this.campaignType == this.SOCIAL_CONNECTIONS.ENGAGEMENT){
                        console.log('inside this else if ATBBaXBsUZyem4Mw2sG8TfykLpjp8A774FC5')
						this.performTask();
					}
					else {
						

						this.OpenModalForCampaign();
						console.log('telegram')
						window.open(this.campaignUrl, "_blank");
					}
				}
			(error)=>{
				this.loaderService.hide();
			}}
		)
	}
		
	OpenModalFormentionHandlesDiscord(data?) {
		if(data){
			this.shoutoutCampaign = data
			this.campaignType = data?.type?.type
			this.campaignId = data?._id
		}
		console.log("data in mention handles+++++++",data,this.shoutoutCampaign);
		console.log("campaign type",this.campaignType);
		document.getElementById("OpenModalForMentionHandlesDiscord").click();
	}


	/**
	 * @description: used to open modal for campaign
	 */
	OpenModalForCampaign() {
		this.showErrorMessage = '';
		document.getElementById("OpenModalForCampaignForProjectDetails").click();
	}

	/**
	 * @description: used to open modal for telegram
	 */
	openModalForTelegram() {
		document.getElementById("openModalForTelegramForProjectDetails").click();
	}

	openModalForDiscord() {
        document.getElementById("openModalForDiscord").click();
    }

	/**
	 * @description: used to open modal for social
	 */
	OpenModalForSocial() {
		console.log('kjawokdokwkdwopk')
		document.getElementById("OpenModalForSocialConnect").click();
	}

	/**
	 * @description: used to open waiting modal for campaign
	 */
	OpenWaitingModalForCampaign() {
		this.showErrorMessage = '';
		this.closeModal();
		this.modalRef=this.modalService.open(this.waitingModal, { centered: true , backdrop: 'static', size:"md", windowClass:"congratulations-popup"});
		this.startVerification();
		
	}
	/**
	 * @description: used to open campaign info modal
	 * @param type 
	 */
	OpenInfoModalForCampaign(type) {
		this.selectedModalType = type;	
		this.modalrefrence =	this.modalService.open(this.infoModal, { centered: true ,backdrop: 'static', size:"md", windowClass:"congratulations-popup"});
	}
	/**
	 * @description: used to open modal
	 * @param content 
	 */
	open(content) {
		console.log('hwidjwoioewop')
		this.reverifyForm.reset();
		console.log('type');
		this.modalrefrence = this.modalService.open(content, {
			ariaLabelledBy: 'modal-basic-title', centered: true, backdrop: 'static',
			keyboard: false
		})

	}
	/**
	 * @description: used to open modal for twitter task of quote and comment
	 */
	OpenModalForTwitterTask() {

			if(this.campaignType == this.SOCIAL_CONNECTIONS.QUOTE || this.campaignType == this.SOCIAL_CONNECTIONS.COMMENT){
				this.twitterTaskForm();
			}	
			const twitterId = this.getTwitterId(this.campaignUrl);
			console.log("twitter id=======>>>>>>>",twitterId);
			this.twitterLink = twitterId;	
			document.getElementById("OpenModalForTwitterTask").click();
	}
	/**
	 * @description: used to open modal for twitter task
	 */
	openTwitterTask(content){
		if(this.campaignType == this.SOCIAL_CONNECTIONS.FOLLOW){
			this.modalrefrence = this.modalService.open(content, { centered: true ,backdrop: 'static', size:"sm"});

		}else{
			if(this.mentionHandlesArr && (this.campaignType == this.SOCIAL_CONNECTIONS.QUOTE || this.campaignType == this.SOCIAL_CONNECTIONS.COMMENT)){
				this.modalRefTwo = this.modalService.open(content, { centered: true ,backdrop: 'static', size:"md"});

			}else{
				this.modalrefrence = this.modalService.open(content, { centered: true ,backdrop: 'static', size:"md"});
			}

		}
	}

	/**
	 * @description: used to get twitter id
	 * @param url 
	 * @returns 
	 */
	getTwitterId(url) {
		const regex = /twitter\.com\/[^/]+\/status\/(\d+)/;
		const match = url.match(regex);
		
		if (match && match.length >= 2) {
		  return match[1];
		}
		
		return null;
	  }

	/**
	 * @description: used to close modal and reset variables
	 */  
	closeModal() {
		this.handlesError = null;
		this.taskErrorMessage = '';
		if(this.twitterTaskContentForm){
			this.twitterTaskContentForm.reset();
		}
		if(this.modalRefTwo){
			this.modalRefTwo.close();
			this.modalRefTwo = null;
			return;
		}
		this.twitterContentForm.reset();
		if(this.modalrefrence){
			this.modalrefrence.close();
		}
		if(this.modalrefrenceThree){
			this.modalrefrenceThree.close();
		}
		this.hideCheckBox.setValue(false);
		this.taskCounterPercentage = 0;
		this.startVerifyTask = false;
	}

	/**
	 * @description: used to call api after perform task
	 */
	performTask() {
		this.loaderService.show();
		let data:any = {
			shoutoutCampaignId: this.campaignId,
			category: this.category,
			taskActionStampId: this.taskActionStampId
		};
		if(this.twitterContent?.value){
			data.tweetContent= this.twitterContent.value
		}
		if(this.campaignType == this.SOCIAL_CONNECTIONS.QUOTE || this.campaignType == this.SOCIAL_CONNECTIONS.COMMENT){
			data.tweetText = this.comment.value;
			if(this.mentionHandlesArr && this.handlesError){
				return;
			}
		}
		this.shoutOutService.startEarning(data).subscribe(
			(resp) => {
				this.loaderService.hide();

				if (resp.error) {
					this.showErrorMessage = resp.message;
					this.taskCounterPercentage = 0;
					this.startVerifyTask = false;
					this.modalrefrence.close();
					if (resp?.data?.reverify) {
						this.closeModal();
						document.getElementById('reverifyModalForProjectDetails').click();
					} 
					else if(resp?.data?.status == 429 && !resp?.data?.twitterAppTwo){
                        this.modalrefrenceThree = this.modalService.open(this.twitterReconnectModal, { centered: true ,backdrop: 'static', size:"md"});
                    }
					else {
						this.taskErrorMessage = resp?.message?.replace('t.me', 'telegram.me') || this.constants.SOMETHING_WRONG;
						this.OpenInfoModalForCampaign(this.modalType.NOT_CLAIMED)
						this.getProjectById();
						this.getCampaignsByProjectId();
					}
				} else {
					this.closeModal();
					if(this.campaignType != this.SOCIAL_CONNECTIONS.ENGAGEMENT){
						this.OpenInfoModalForCampaign(this.modalType.CLAIMED);
					}
					if(this.campaignType == this.SOCIAL_CONNECTIONS.ENGAGEMENT){
						window.open(this.campaignUrl, "_blank");
					}
					this.taskCounterPercentage = 0;
					this.startVerifyTask = false;
					this.getProjectById();
					this.getCampaignsByProjectId();
				}
			},
			(err) => {
				this.showErrorMessage = err.error.message;
				this.modalrefrence.close();
				this.loaderService.hide();
				this.taskCounterPercentage = 0;
				this.startVerifyTask = false;
				if (err?.error?.data?.reverify) {
					this.closeModal();
					document.getElementById('reverifyModalForProjectDetails').click();
				} 
				else if(err?.error?.data?.status == 429 && !err?.error?.data?.twitterAppTwo){
                    this.modalrefrenceThree = this.modalService.open(this.twitterReconnectModal, { centered: true ,backdrop: 'static', size:"md"});
                }
				else {
					
					this.taskErrorMessage = err?.error?.message.replace('t.me', 'telegram.me') || this.constants.SOMETHING_WRONG;
					this.OpenInfoModalForCampaign(this.modalType.NOT_CLAIMED)
				}
				console.log(err);
			});
	}


	/**
	 * @description: used to start verification of task perform
	 */
	startVerification() {
		this.blinker = false;
		this.timeLeftSecond = 10;
		this.startVerifyTask = true;
		var countDown = setInterval(() => {
			if (this.timeLeftSecond <= 0) {
				this.blinker = true
				this.performTask();
				clearInterval(countDown);
			} else {
				this.blinker = false
				this.startCounter();
			}
		}, 1000);

	}

	/**
	 * @description: used to start counter
	 */
	startCounter() {
		this.timeLeftSecond--;
		if (document.getElementById("second")?.innerHTML) {
			document.getElementById("second").innerHTML = String(this.timeLeftSecond);
		}
	}

	/**
	 * @description: used to check reverify task
	 */
	reverifyModalSubmit() {
		if (this.reverifyForm?.invalid) {
			this.validator.markControlsTouched(this.reverifyForm);
			return;
		}
		let dataToSend: any = {
			verificationUrl: this.verificationUrl?.value,
			shoutoutCampaignId: this.campaignId
		}
		this.loaderService.show();
		this.shoutOutService.verifyTask(dataToSend).subscribe((res) => {
			this.loaderService.hide();
			if (res?.error) {
				this.taskErrorMessage = this.constants.WRONG_LINK_OR_TASK_NOT_PERFORM 
				this.selectedModalType = this.modalType.NOT_CLAIMED
				this.modalRefTwo = this.modalService.open(this.infoModal, { centered: true ,backdrop: 'static', size:"md", windowClass:"congratulations-popup"});
				console.log(res)
			} else {
				this.toastrService.success(this.constants.TASK_VERIFIED_SUCCESS);
				this.getProjectById();
				this.getCampaignsByProjectId();
				this.closeModal();
			}
		}, (error) => {
			this.loaderService.hide();
			this.taskErrorMessage = this.constants.WRONG_LINK_OR_TASK_NOT_PERFORM 
			this.selectedModalType = this.modalType.NOT_CLAIMED
			this.modalRefTwo = this.modalService.open(this.infoModal, { centered: true ,backdrop: 'static', size:"md", windowClass:"congratulations-popup"});
			console.log(error)
		})
	}

	/**
	 * @description: used to navigate to shoutout
	 */
	goBackToDashboard() {
		this.router.navigate(['shout-out']);
	}

	/**
	 * @description: used to call perform task api on proceed click
	 */
	onProceedClick() {
		if(this.campaignType == this.SOCIAL_CONNECTIONS.COMMENT || this.campaignType == this.SOCIAL_CONNECTIONS.QUOTE){
			this.OpenModalForTwitterTask();
		} else if(this.campaignType == this.SOCIAL_CONNECTIONS.TWEET){
			if(this.twitterContentForm?.invalid){
				this.validator.markControlsTouched(this.twitterContentForm);
				return false;
			}
			this.performTask();
		}else{
			this.modalrefrence.close();
			this.OpenModalForCampaign();
			if (this.campaignType != this.SOCIAL_CONNECTIONS.TWEET) {
				window.open(this.campaignUrl, "_blank");
			} else {
				window.open(this.twitterURL, "_blank");
			}
		}
	}
	
	/**
	 * @description: used to create twitter content form
	 */
	twitterForm() {
		this.twitterContentForm = this.fb.group({
			twitterContent: [null, [Validators.required]],
		});
	}

	get twitterContent(): any { return this.twitterContentForm.get('twitterContent'); }

	/**
	 * @description: used to create twitter task content form
	 */
	twitterTaskForm() {
		this.twitterTaskContentForm = this.fb.group({
			comment: [null, [Validators.required,Validators.maxLength(300), Validators.minLength(25)]],
		});
		if(this.mentionHandlesArr){
			let handles = this.mentionHandlesArr?.join(", ")
			this.comment.patchValue(handles+ " ");
		}
	}

	get comment(): any { return this.twitterTaskContentForm.get('comment'); }

	/**
	 * @description: used to perform twitter task
	 */
	performTwitterTask(){
		if(this.campaignType == this.SOCIAL_CONNECTIONS.QUOTE || this.campaignType == this.SOCIAL_CONNECTIONS.COMMENT){
			if(this.twitterTaskContentForm.invalid){
				this.handlesError = null;
				this.validator.markControlsTouched(this.twitterTaskContentForm);
				return;
			}
				else{
					if(this.mentionHandlesArr && this.handlesError){
						return;
					}
					this.performTask();
				}
				
			}else{
				this.performTask();
	
			
		}
	}
	/**
	 * @description: used to check validation on mention handles
	 * @param $event 
	 */
	checkHandles($event){
		let content = $event.target.value
		if(content && content?.length >= 25){
			content = content?.split(" ")
			let validate = true
			this.mentionHandlesArr?.forEach((item)=>{
			if(!content?.includes(item)){
					validate = false
			}
			})
			if(!validate){
					if(this.mentionHandlesArr?.length == 1){
						this.handlesError = "Please mention " + this.mentionHandlesArr?.join(", ") + " username in your content."
					}else{
						this.handlesError = "Please mention " + this.mentionHandlesArr?.join(", ") + " usernames in your content."
					}
						return;
			}else{
					this.handlesError = null;
			}
		}else{
			this.handlesError = null;
		}
	}
	/**
	 * @description: used to redirect to profile page
	 */
	redirectToProfile(){
		this.closeModal();
		this.router.navigate(['settings/profile']);
	}

	connectUserToSecondApp(){
		localStorage.setItem('campaignId', this.campaignId);
        localStorage.setItem('taskActionStampId',this.taskActionStampId);
        localStorage.setItem('category',this.category);
		let id = JSON.parse(localStorage.getItem('_u'))?._id;
		window.location.href = `${environment.baseURL}auth/v1/twitter/social/two?id=${id}`;
	}
	markEngagementTaskCompleted(){
		let dataToSend: any = {
			shoutoutCampaignId: this.campaignId
		}
		this.loaderService.show();
		this.shoutOutService.markEngagementTaskCompleted(dataToSend).subscribe((res) => {
			this.loaderService.hide();
			if (res?.error) {
				this.toastrService.error(res?.message);				
				console.log(res)
				this.modalRef?.close()
			} else {
				this.closeModal();
				this.getCampaignsByProjectId();
				this.selectedModalType = this.modalType.SUCCESS;
                this.reward=localStorage.getItem('reward')
                this.symbol=localStorage.getItem('symbol')
                console.log(this.reward,this.symbol,'--------------------reward symbol')
                console.log(localStorage.getItem('reward'),localStorage.getItem('symbol'),'--------------------local reward symbol');
				this.modalRef = this.modalService.open(this.infoModal, { centered: true ,backdrop: 'static', size:"md", windowClass:"congratulations-popup"});
			}
		}, (error) => {
			this.loaderService.hide();
			this.modalRef?.close()
			this.toastrService.error(error?.error?.message);
			console.log(error);
		})
	
	}

    checkrewardAvailableForEngagementTask(){
        let data = {
			shoutoutCampaignId: this.campaignId,
		}
		this.loaderService.show();
		this.shoutOutService.checkRewardAvailable(data).subscribe((resp) => {
			this.loaderService.hide()
			if (resp.error) {
				console.log('Error');
			} else {

               
                    if (resp.data?.dailyRemaining >= resp.data?.shoutoutCampaign?.reward?.$numberDecimal) {
						this.modalRef.close()
                        this.markEngagementTaskCompleted()
                    }
                    else {
                        this.toastrService.error(this.constants.DAILY_REWARD_LIMIT_EXCEED);
						this.modalRef?.close()
                    }
                
			
			}
		}, (err) => {
			this.loaderService.hide()
		});
    }

    waitingModalForEngagement(){
        this.closeModal();
		console.log(this.projectId,'✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎');
		this.getCampaignsByProjectId()
        this.modalRef=this.modalService.open(this.waitingModal, { centered: true , backdrop: 'static', size:"md", windowClass:"congratulations-popup"});
        this.startVerificationForEngagement();
    }

    startVerificationForEngagement(){
        this.blinker = false;
        this.timeLeftSecond = 10;
        this.startVerifyTask = true;
        var countDown = setInterval(() => {
            if (this.timeLeftSecond <= 0) {
                this.blinker = true
                this.checkrewardAvailableForEngagementTask();
                clearInterval(countDown);
            } else {
                this.blinker = false
                this.startCounter();
            }
        }, 1000);
    }

	getCielValue(message,duration){
		return Math.ceil(message/duration)
	}
	closeModalsEng(){
		this.modalRef?.close();
		this.modalrefrence?.close()
		this.modalRefInfo?.close();
		}
}
