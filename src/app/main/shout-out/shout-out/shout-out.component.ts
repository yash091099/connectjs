import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ShoutOutService } from '../service/shout-out.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonApiService, LoaderService } from 'src/app/shared/services';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { Constants } from 'src/app/config/constant';
import noWhitespaceValidator from 'src/app/shared/services/no-white-space-validator.service';
import { Messages } from 'src/app/config/message';
import { FormValidatorService } from "src/app/shared/services/form-validator.service";
import { AmountService } from 'src/app/shared/services/amount.service';
import { ReferService } from '../../refer/service/refer.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CookiesService } from 'src/app/shared/services/cookies.service';
import forbiddenEmailValidation from 'src/app/shared/services/email-validator.service';
declare var $: any;
@Component({
    selector: 'app-shout-out',
    templateUrl: './shout-out.component.html',
    styleUrls: ['./shout-out.component.css']
})
export class ShoutOutComponent implements OnInit {
    /** Form */
    twitterContentForm: FormGroup;
    twitterTaskContentForm: FormGroup;
    reverifyForm: FormGroup;
    filterForm: FormGroup
    /*********Array*********/
    leaderShipBoardArray = [];
    campaignsArray = [];
    urlArray: any = [];
    tweetContent: any = '';
    tweetImage: any = '';
    callbackUrl: any = '';
    socialArray = []
    activeSocialConnection = []
    mentionHandlesArr: any = [];
    upcommingCompitionsArray = [];
    leadershipProjects = [];
    leadershipDataByProjects = [];
    primaryTask : any = [];
    /*********Object*********/
    loggedInUserDetails: any = {}
    public twitterFollowContent:any = {};
    /*********Variable*********/
    leaderData: any;
    reward: any;
    symbol = '';
    YoutubeWatchDataToSend: any;
    waitingModalRef:any
    shoutoutCampaign: any;
    userData: any;
    /*********Boolean*********/
    showError: boolean = false;
    showHideMyName: boolean = false;
    hideCustomizeColumn: boolean = true;
    startVerifyTask = false;
    removeResetIcon: boolean = false;
    blinker: boolean = false;
    isRankInViewPort = true;
    moreScrollBtn: boolean = true;
    topScrollBtn: boolean = false;
    topScrollProjectBtn = false;
    moreScrollProjectBtn = true;
    hidePrevButton: boolean = false;
    hideNextButton: boolean = false;
    hidePrevButtonLead: boolean = false;
    hideNextButtonLead: boolean = false;
    restrictButtonAction: boolean = false;
    walletConnected = false;
    disableLoader: boolean = false;
    projectDataFetched:boolean = false;
    showProjectSlider = false;
	public isMobileScreen = false;
    /*********integrer*********/
    currentPageForLeaderListing = 0;
    totalCountForLeaderListing = 0;
    rowsPerPageForLeaderListing = 0;
    currentPageForTaskListing = 0;
    totalCountForTaskListing = 0;
    rowsPerPageForTaskListing = 0;
    taskCounterPercentage = 0;
    timeLeftSecond: any = 10;
    videosDuration:any = 0;
    rank = 0
    index = 1;
    noTaskupdate: FormGroup
    selectedCompetitionIndex = 0;
    /*********String*********/
    userEmail: any = '';
    projectId: any = '';
    customNameToSend: any = '';
    campaignId: any = ''
    category: any = ''
    taskActionStampId: any = '';
    twitterResponse: any = '';
    campaignUrl = "";
    campaignType = "";
    WATCH: "Watch";
    showErrorMessage: any = '';
    savedIndex: any;
    taskErrorMessage = '';
    selectedModalType = '';
    handlesError = '';
    public twitterLink:any;
    projectNameLeaderBoard = '';
    selectedIndex = 0;

    /*********Constants*********/
    SOCIAL_CONNECTIONS = Constants.SOCIAL_CONNECTIONS;
    constants = Messages.CONST_MSG;
    modalType = Constants.MODAL_TYPE;
    taskPerformContent = Constants.TASK_CONFIRMTION_CONTENT;

    /*********Regex*********/
    twitterCommentRegex = /^https:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)$/
    twitterURL = Constants.TWITTER_URL;
    /** Element Ref */
    public modalRef:NgbModalRef;
    @ViewChild("infoModal", { static: true }) infoModal: ElementRef;
    @ViewChild("waitingModal", { static: true }) waitingModal: ElementRef;
    @ViewChild("twitterReconnectModal", { static: true }) twitterReconnectModal: ElementRef;


    constructor(
        private shoutOutService: ShoutOutService,
        public route: ActivatedRoute,
        private toastrService: ToastrService,
        public fb: FormBuilder,
        public router: Router,
        private validator: FormValidatorService,
        private loaderService: LoaderService,
        private modalService: NgbModal,
        private sharedService: CommonApiService,
        private amountService: AmountService,
        private referService: ReferService,
        public sanitizer: DomSanitizer,
		private authService: AuthService,
		private cookieService: CookiesService
    ) { }

    ngOnInit(): void {
        this.userData = JSON.parse(localStorage.getItem('_u'));
		let width = window.screen.availWidth;
		if(width <= 667 && width >= 320){
			this.isMobileScreen = true;
		}
        this.twitterForm();
        $('.leaderboardscroll').scroll(function() {
            document.getElementById('scrollHideBtn').click();
          });
      
        setTimeout(() => {

            console.log("calling ____________________122332332")
            if(this.projectDataFetched){
            this.showProjectSlider = true;

            console.log("calling ____________________123", this.upcommingCompitionsArray?.length)
           
            var $num = $('.card-carousel .my-card').length;
            var $even = $num / 2;
            var $odd = ($num + 1) / 2;
            console.log($num, "________________________")


            if ($num % 2 == 0) {
                $('.card-carousel .my-card:nth-child(' + $even + ')').addClass('active');
                $('.card-carousel .my-card:nth-child(' + $even + ')').prev().addClass('prev');
                $('.card-carousel .my-card:nth-child(' + $even + ')').next().addClass('next');
            } else {
                console.log($odd)
                $('.card-carousel .my-card:nth-child(' + $odd + ')').addClass('active');
                $('.card-carousel .my-card:nth-child(' + $odd + ')').prev().addClass('prev');
                $('.card-carousel .my-card:nth-child(' + $odd + ')').next().addClass('next');
            }

            $('.card-carousel .my-card').on('click', function () {
                if ($('.card-carousel').is(':animated')) {
                    return;
                }
            });
            // Keyboard nav
            $('html body').keydown(function (e) {
                if (e.keyCode == 37) { // left
                    $('.card-carousel .active').prev().trigger('click');
                }
                else if (e.keyCode == 39) { // right
                    $('.card-carousel .active').next().trigger('click');
                }
            });
        }

        }, 4000)
        setTimeout(() => {
        
                console.log("dsfdfdsfdsf________________", this.upcommingCompitionsArray?.length)
                var $num = $('.card2-carousel .my-card').length;
                var $even = $num / 2;
                var $odd = ($num + 1) / 2;
                console.log($num)
    
                if ($num % 2 == 0) {
                    $('.card2-carousel .my-card:nth-child(' + $even + ')').addClass('active');
                    $('.card2-carousel .my-card:nth-child(' + $even + ')').prev().addClass('prev');
                    $('.card2-carousel .my-card:nth-child(' + $even + ')').next().addClass('next');
                } else {
                    console.log($odd)
                    $('.card2-carousel .my-card:nth-child(' + $odd + ')').addClass('active');
                    $('.card2-carousel .my-card:nth-child(' + $odd + ')').prev().addClass('prev');
                    $('.card2-carousel .my-card:nth-child(' + $odd + ')').next().addClass('next');
                }
    
                $('.card2-carousel .my-card').on('click', function () {
                    if ($('.card2-carousel').is(':animated')) {
                        return;
                    }
                });
                // Keyboard nav
                $('html body').keydown(function (e) {
                    if (e.keyCode == 37) { // left
                        $('.card2-carousel .active').prev().trigger('click');
                    }
                    else if (e.keyCode == 39) { // right
                        $('.card2-carousel .active').next().trigger('click');
                    }
                });
            
            
        }, 2000)
        
        console.log(this.index, 'index')
        let savedIndex = localStorage.getItem('cardIndex');
        console.log(savedIndex, 'index')
        if (savedIndex) {
            this.index = Number(savedIndex);
        }
        console.log(this.index, 'index')

        this.amountService.getWalletConnection().subscribe((res) => {
            if (res) {
                this.walletConnected = res;
            }
        })
        

        this.route.params.subscribe((params) => {
            if (params?.test) {
                let parseResponse: any = params?.test;
                this.twitterResponse = JSON.parse(atob(parseResponse));
            }
			if(params?.sponsor){
				let sponsor = params['sponsor'];
				this.verifyReferralLink(sponsor);
			}
        });
		if(this.twitterResponse && this.twitterResponse?.data?.verifyTask){
			this.performTask();
		}else if(localStorage.getItem('campaignId') || localStorage.getItem('taskActionStampId') || localStorage.getItem('category')){
			localStorage.removeItem('campaignId')
            localStorage.removeItem('taskActionStampId');
            localStorage.removeItem('category');
		}
        console.log(this.twitterResponse, "reesponse")
        
        this.createNoTaskUpdateForm();
        this.createForm();
        this.createFilterForm();
        this.userEmail = JSON.parse(localStorage.getItem('_u')).email;
        this.getAllLeadershipProjects();
        
        this.setStateToInitial();
        setTimeout(() => {
            console.log("Loader calling off")
            this.loaderService.hide()
        },10000)
		
    
    }
    
    createNoTaskUpdateForm(){
        this.noTaskupdate = this.fb.group({
            email: new FormControl('', [Validators.required, forbiddenEmailValidation, noWhitespaceValidator]),

        })
    }

    get email(): any { return this.noTaskupdate.get('email'); 
}  

    

		/**
	 * @description: used to update verify sponsor referral link
	 * @param sponsor 
	 */
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

    async onClickSlider(side) {
        if (!this.restrictButtonAction) {
            this.restrictButtonAction = true;
            setTimeout(() => {
                this.restrictButtonAction = false;
            }, 500);
            console.log("button clicking again");
            var $slide = await $('.card-carousel .active')[0].getBoundingClientRect().width
            console.log('working on arrow click', $('.card-carousel .prev').hasClass('prev'))
            if (side == 'next') {
                this.selectedCompetitionIndex = this.selectedCompetitionIndex + 1;
                let findIndex = this.leadershipProjects.findIndex(item => item?._id == this.upcommingCompitionsArray[this.selectedCompetitionIndex]?._id);
                console.log("index exists on next",findIndex);
                if(findIndex != -1){
                    this.projectId = this.upcommingCompitionsArray[this.selectedCompetitionIndex]?._id;
                    this.projectNameLeaderBoard = this.upcommingCompitionsArray[this.selectedCompetitionIndex]?.name+"'s Leaderboard"
                    this.getLeadershipDetailsProjectWise();
                    let id = '#scrollableDiv'+(findIndex)
                    $("#scrollableDiv").animate({ scrollTop: 0 }, "fast");
                    console.log("id on next",id);
                    $(id).animate({ scrollTop: 0 }, "fast");
                }
                // else{
                //     $("#scrollableDiv").animate({ scrollTop: 0 }, "fast");
                //     this.projectNameLeaderBoard = '';
                //     this.getLoggedUserRank();
                // }
                await $('.card-carousel').animate({ left: '-=' + $slide });
                await $('.card-carousel .next').addClass('active');
                await $('.card-carousel .next').removeClass('next');
                await $('.card-carousel .active').prev().addClass('prev');
                await $('.card-carousel .active').prev().removeClass('active');
                await $('.card-carousel .prev').prev().removeClass('prev');
                await $('.card-carousel .active').next().addClass('next');
                if (!$('.card-carousel .active').next()?.length) {
                    this.hideNextButton = true;
                } else {
                    this.hideNextButton = false;
                }
                if (!$('.card-carousel .active').prev()?.length) {
                    this.hidePrevButton = true;
                } else {
                    this.hidePrevButton = false;
                }

            } else if (side == 'prev') {
                this.selectedCompetitionIndex = this.selectedCompetitionIndex - 1;
                let findIndex = this.leadershipProjects.findIndex(item => item?._id == this.upcommingCompitionsArray[this.selectedCompetitionIndex]?._id);
                console.log("index exists on next",findIndex);
                if(findIndex != -1){
                    this.projectId = this.upcommingCompitionsArray[this.selectedCompetitionIndex]?._id;
                    this.projectNameLeaderBoard = this.upcommingCompitionsArray[this.selectedCompetitionIndex]?.name+"'s Leaderboard"
                    this.getLeadershipDetailsProjectWise();
                    let id = '#scrollableDiv'+(findIndex)
                    $("#scrollableDiv").animate({ scrollTop: 0 }, "fast");
                    console.log("id on previos",id);
                    $(id).animate({ scrollTop: 0 }, "fast");
                }
                // else{
                //     $("#scrollableDiv").animate({ scrollTop: 0 }, "fast");
                //     this.projectNameLeaderBoard = '';
                // }
              
                await $('.card-carousel').animate({ left: '+=' + $slide });
                await $('.card-carousel .prev').addClass('active');
                await $('.card-carousel .prev').removeClass('prev');
                await $('.card-carousel .active').next().addClass('next');
                await $('.card-carousel .active').next().removeClass('active');
                await $('.card-carousel .next').next().removeClass('next');
                await $('.card-carousel .active').prev().addClass('prev');
                console.log("prev calling end")
                if (!$('.card-carousel .active').prev()?.length) {
                    this.hidePrevButton = true;
                } else {
                    this.hidePrevButton = false;
                }
                if (!$('.card-carousel .active').next()?.length) {
                    this.hideNextButton = true;
                } else {
                    this.hideNextButton = false;
                }
            }
            console.log("now you can press busson")
        }

    }
    async onClickSlider2(side,index) {
        console.log(index)
        if (!this.restrictButtonAction) {
            this.restrictButtonAction = true;
            setTimeout(() => {
                this.restrictButtonAction = false;
            }, 500);
            console.log("button clicking again");
            var $slide = await $('.card2-carousel .active')[0].getBoundingClientRect().width
            console.log('working on arrow click', $('.card2-carousel .prev').hasClass('prev'))
            if (side == 'next') {
                await $('.card2-carousel').animate({ left: '-=' + $slide });
                await $('.card2-carousel .next').addClass('active');
                await $('.card2-carousel .next').removeClass('next');
                await $('.card2-carousel .active').prev().addClass('prev');
                await $('.card2-carousel .active').prev().removeClass('active');
                await $('.card2-carousel .prev').prev().removeClass('prev');
                await $('.card2-carousel .active').next().addClass('next');
                if (!$('.card2-carousel .active').next()?.length) {
                    this.hideNextButtonLead = true;
                } else {
                    this.hideNextButtonLead = false;
                }
                if (!$('.card2-carousel .active').prev()?.length) {
                    this.hidePrevButtonLead = true;
                } else {
                    this.hidePrevButtonLead = false;
                }

            } else if (side == 'prev') {
                console.log("prev calling")
                await $('.card2-carousel').animate({ left: '+=' + $slide });
                await $('.card2-carousel .prev').addClass('active');
                await $('.card2-carousel .prev').removeClass('prev');
                await $('.card2-carousel .active').next().addClass('next');
                await $('.card2-carousel .active').next().removeClass('active');
                await $('.card2-carousel .next').next().removeClass('next');
                await $('.card2-carousel .active').prev().addClass('prev');
                console.log("prev calling end")
                if (!$('.card2-carousel .active').prev()?.length) {
                    this.hidePrevButtonLead = true;
                } else {
                    this.hidePrevButtonLead = false;
                }
                if (!$('.card2-carousel .active').next()?.length) {
                    this.hideNextButtonLead = true;
                } else {
                    this.hideNextButtonLead = false;
                }
            }
            console.log("now you can press busson")
        }

    }
    getIndex(prev){
        this.topScrollProjectBtn = false;
        this.moreScrollProjectBtn = true;   
        this.moreScrollBtn = true;
        this.topScrollBtn = false;  
        if(prev){
            $(".carousel-item.active").removeClass("active");
            this.selectedIndex = this.selectedIndex - 1;
        }else{
            $(".carousel-item.active").removeClass("active");
            this.selectedIndex = this.selectedIndex + 1;
        }
            console.log('selected index====',this.selectedIndex)
        if(this.leadershipProjects?.length && (this.selectedIndex   < this.leadershipProjects?.length) ){
            this.projectId = this.leadershipProjects[this.selectedIndex]?._id
            this.projectNameLeaderBoard = this.leadershipProjects[this.selectedIndex]?.name+"'s Leaderboard";
            this.getLeadershipDetailsProjectWise();
        }else{
            $("#scrollableDiv").animate({ scrollTop: 0 }, "fast");
            this.projectNameLeaderBoard = ''
        }
        
        
        
        
    }
    

    isInViewport(el) {
        const rect = el.getBoundingClientRect();
        const scrollBox = document.querySelector('.leaderboardscroll').getBoundingClientRect();
        return !(rect.top >= scrollBox.bottom || rect.top <= scrollBox.top);
    }

    /**
     * @description: used to scroll to id element
     * @param id 
     */
    scrollToId(id: string) {
        console.log("element id : ", id);
        this.referService.scrollToElementById(id);
    }
    /**
     * @description: used to set state to initial
     */
    setStateToInitial() {
        this.getLoggedUserRank();
        this.getCampaigns();
        this.modalService.dismissAll();
        this.getActiveSocialConnection();
        if (this.twitterResponse?.error) {
            this.taskErrorMessage = this.twitterResponse?.message || Messages.CONST_MSG.FAILED_TOCONNECT_SOCIAL;
            this.OpenInfoModalForCampaign(this.modalType.ERROR)

        }else if(!this.twitterResponse?.error && this.twitterResponse?.status == 200 && !this.twitterResponse?.data?.verifyTask){
            this.taskErrorMessage = this.twitterResponse?.message || Messages.CONST_MSG.SOCIAL_ADDED_SUCCESSFULLY;
            this.OpenInfoModalForCampaign(this.modalType.SUCCESS)
        }
        let showToaster = localStorage.getItem('showToaster');
        if (showToaster === 'true') {
            if(localStorage.getItem('reward') && !localStorage.getItem('errorMessage')){
                this.reward = JSON.parse(localStorage.getItem('reward'))
                this.symbol = localStorage.getItem('symbol');
                console.log(this.reward,this.symbol,'============================>>>>>>>>>>>>>>>>>.')
                this.OpenInfoModalForCampaign(this.modalType.CLAIMED);
            }
            else{
                this.taskErrorMessage = JSON.parse(localStorage.getItem('errorMessage'))
                this.OpenInfoModalForCampaign(this.modalType.NOT_CLAIMED);
            }
            localStorage.removeItem('showToaster');

        }
    }

    /**
     * @description: used to refresh content
     */
    refreshContent() {
        this.getCampaigns();
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
     * @description: used to create filter form
     */
    createFilterForm() {
        this.filterForm = this.fb.group({
            filterInput: new FormControl("")
        })
    }

    get filterInput(): any { return this.filterForm.get('filterInput'); }


    /**
     * @description: used to get upcoming competitions data
     */
    getUpcomingCompititions() {
        // this.loaderService.show();
        this.shoutOutService.getUpcomingCompititions().subscribe(
            (resp) => {
                // this.loaderService.hide();
                if (resp.error) {
                    console.log("Error");
                } else {
                    let arrayLength:any = resp?.data?.length
                    let array = resp?.data
                    let lastElement = array[array?.length-1]
                    if(arrayLength){
                        let sliceOne = Math.ceil(arrayLength/2)
                        let arrayOne = array?.splice(sliceOne);
                        let arrayTwo = array?.splice(0, sliceOne);
                        arrayOne = arrayOne?.reverse();
                        this.upcommingCompitionsArray?.push(...arrayOne,...arrayTwo);
                        if (  arrayLength % 2 == 0) {
                            this.upcommingCompitionsArray?.push(lastElement);
                        }
                    }
                    this.upcommingCompitionsArray?.forEach((item, i)=>{
                        this.upcommingCompitionsArray[i].activeSocials= [...new Map(this.upcommingCompitionsArray[i]?.uniqueTasksType?.map(item =>
                            [item['category'], item])).values()];
                    })
                    this.projectDataFetched = true;
                    console.log("upcoming competition array",this.upcommingCompitionsArray);
                    if(this.leadershipProjects?.length && this.upcommingCompitionsArray?.length){
                        console.log(this.upcommingCompitionsArray, '---------------------------------------------------------------------------------------------')

                        console.log(this.upcommingCompitionsArray, this.upcommingCompitionsArray?.length, '---------------------------------------------------------------------------------------------')
                        let index = (this.upcommingCompitionsArray?.length + 1)/2
                        this.selectedCompetitionIndex = index - 1;
                        this.projectId = this.upcommingCompitionsArray[this.selectedCompetitionIndex]?._id;
                        this.projectNameLeaderBoard = this.upcommingCompitionsArray[this.selectedCompetitionIndex]?.name+"'s Leaderboard"
                        this.getLeadershipDetailsProjectWise();
                    }
                    if(!this.upcommingCompitionsArray?.length && this.leadershipProjects?.length){
                        this.projectId = this.leadershipProjects[0]?._id;
                        this.projectNameLeaderBoard = this.leadershipProjects[0]?.name+"'s Leaderboard"
                        this.getLeadershipDetailsProjectWise();
                    }

                  this.getUsersCompletedTasks()
                   

                }
            },
            (err) => {
                console.log("Error");
                // this.loaderService.hide();
            }
        );
    }

    tasksDetailsLoading:boolean=true;
    /**
     * @description: used to get campaign listing
     */
    getCampaigns() {
    this.tasksDetailsLoading=true;

        this.removeResetIcon = false;
        let dataToSend: any = {
            currentPage: this.currentPageForTaskListing
        };
        if (this.filterInput?.value) {
            dataToSend.title = this.filterInput.value.trim();
        }
        // this.loaderService.show();
        this.shoutOutService.getCampaigns(dataToSend).subscribe(
            (resp) => {
                // this.loaderService.hide();
                if (resp.error) {
                    console.log("Error");
                } else {
                    this.campaignsArray = resp.data?.data;
                    this.primaryTask = resp?.data?.data?.filter(item => item?.isPrimary && !item?.isTaskCompleted);				
                    this.totalCountForTaskListing = resp.data.count;
                    this.rowsPerPageForTaskListing = resp.data.pageLimit
                    this.userData = JSON.parse(localStorage.getItem('_u'));
                    if(!this.campaignsArray?.length && !this.userData.allowemailupdates){
                        this.email.patchValue(this.userEmail);
                        this.email.disable();
                        document.getElementById('noTaskModel')?.click();
                    }
                    // if(!this.campaignsArray?.length && !this.userData.allowemailupdates){}
                }
                    this.tasksDetailsLoading=false;

            },
            (err) => {
                    this.tasksDetailsLoading=false;

                // this.loaderService.hide();
            }
        );
    }
    /**
     * @description: get logged user rank details
     */
    getLoggedUserRank() {
        this.shoutOutService.getLoggedUserRank().subscribe(
            (resp) => {
                if (resp.error) {
                    console.log("Error");
                } else {
                    this.rank = resp?.data?.userRankData?.rank;
                    this.isRankInViewPort = resp?.data?.userRankData?.isRankInViewPort;
                    this.loggedInUserDetails = resp?.data?.userRankData;
                    if(this.loggedInUserDetails.user?.name){
                        this.loggedInUserDetails.user.avatarName = this.loggedInUserDetails.user?.name
                    }else{
                    this.loggedInUserDetails.user.avatarName = this.loggedInUserDetails.user?.firstname + ' '+ this.loggedInUserDetails.user?.lastname

                    }
                    
                    this.leaderShipBoardArray = resp?.data?.usersLeadershipBoard;
                this.leaderShipBoardArray.sort(function (val1, val2) { return val2?.token?.$numberDecimal - val1?.token?.$numberDecimal; });
                this.leaderShipBoardArray.forEach((item, i) => {
                    if(this.leaderShipBoardArray[i]?.name){
                        this.leaderShipBoardArray[i].avatarName = this.leaderShipBoardArray[i]?.name
                    }else{
                    this.leaderShipBoardArray[i].avatarName = this.leaderShipBoardArray[i]?.firstname + ' '+ this.leaderShipBoardArray[i]?.lastname

                    }
                    if (item?.email == this.userEmail) {
                        if (item.displayName) {
                            this.showHideMyName = false;
                        } else {
                            this.showHideMyName = true;
                        }
                    }
                })

                }
            },
            (err) => {
            }
        );
    }
    isLeaderBoardLoading: boolean = true;
    /**
     * @description: used to get all projects for leaderboard
     */
    getAllLeadershipProjects() {
        // this.loaderService.show();
        this.isLeaderBoardLoading=true;
        this.shoutOutService.getAllProjectsForLeaderboard().subscribe((resp) => {
            // this.loaderService.hide();
            if (resp?.error) {
                console.log('Error');
            } else {
                this.leadershipProjects = resp?.data||[];
                this.getUpcomingCompititions();
                // if(this.leadershipProjects?.length){
                //     console.log('+++++++++++++++++++++++++++++++++',this.leadershipProjects);
                //     this.projectId = this.leadershipProjects[0]?._id
                // this.projectNameLeaderBoard = this.leadershipProjects[0]?.name+"'s Leaderboard";
                // this.getLeadershipDetailsProjectWise();
                // }

            }

                this.isLeaderBoardLoading = false;
            }, (err) => {
                this.isLeaderBoardLoading = false;
                // this.loaderService.hide();
            });
    }

    /**
     * @description: used to get leaderboard details by project id
     */
    getLeadershipDetailsProjectWise() {
        // this.loaderService.show();
        let dataToSend = {
            projectId: this.projectId
        }
		this.isLeaderBoardLoading = true;
        this.shoutOutService.getLeadershipDetailsByProjectId(dataToSend).subscribe((resp) => {
            // this.loaderService.hide();
		this.isLeaderBoardLoading = false;

            if (resp?.error) {
                console.log('Error');
            } else {
                this.leadershipDataByProjects = resp?.data;
                let leadershipBoardData: any = resp?.data?.usersLeadershipBoard;
                console.log(leadershipBoardData?.length, "length")
                leadershipBoardData?.forEach((item, i) => {
                    if(leadershipBoardData[i]?.user?.name){
                        leadershipBoardData[i].user.avatarName = leadershipBoardData[i]?.user?.name
                    }else{
                        leadershipBoardData[i].user.avatarName = leadershipBoardData[i].user?.firstname + ' '+ leadershipBoardData[i]?.user?.lastname

                    }
                })
                let index = this.leadershipProjects.findIndex(item => item?._id == this.projectId);
                if(index != -1){
                    this.selectedIndex = index;
                }
                console.log("selected index",this.selectedIndex);
                console.log("leadership projects length",this.leadershipProjects);
                let id = '#scrollableDiv'+(this.selectedIndex)
                console.log("scrollable id++++",id);
                console.log($(id).animate({ scrollTop: 0 }, "fast"))
            $(id).animate({ scrollTop: 0 }, "fast");
            let id1 = '#scrollableDiv'+(this.selectedIndex+1)
            console.log("scrollable id++++",id);
            console.log($(id).animate({ scrollTop: 0 }, "fast"))
        $(id1).animate({ scrollTop: 0 }, "fast");
            let id2 = '#scrollableDiv'+(this.selectedIndex-1)
            console.log("scrollable id++++",id);
            console.log($(id).animate({ scrollTop: 0 }, "fast"))
        $(id2).animate({ scrollTop: 0 }, "fast");
            this.topScrollProjectBtn = false;
            

                console.log("leadership board data",leadershipBoardData);
            }
            }, (err) => {
		this.isLeaderBoardLoading = false;

                // this.loaderService.hide();
            });
    }

    /**
     * @description: used to search filter
     */
    applyFilter() {
        if (this.filterInput?.value) {
            setTimeout(() => {
                this.getCampaigns()
            }, 1500)
        }
    }

    /**
     * @description: used to reset filter
     */
    resetFilter() {
        this.removeResetIcon = true;
        this.filterForm.reset();
        this.getCampaigns();
    }

    /**
     * @description: used to perform task
     */
    performTask() {
        // this.loaderService.show();
        let data:any = {
            shoutoutCampaignId: this.campaignId || localStorage.getItem('campaignId'),
            category: this.category || localStorage.getItem('category'),
            taskActionStampId: this.taskActionStampId || localStorage.getItem('taskActionStampId')
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
                localStorage.removeItem('campaignId');
                localStorage.removeItem('taskActionStampId');
                localStorage.removeItem('category');	
                if (resp.error) {
                    this.showErrorMessage = resp.message;
                    this.taskCounterPercentage = 0;
                    this.startVerifyTask = false;
                    if(this.waitingModalRef){
                        this.waitingModalRef.close();
                    }
                    if (resp?.data?.reverify) {
                        this.closeModal();
                        document.getElementById('reverifyModal').click();
                    } 
                    else if(resp?.data?.status == 429 && !resp?.data?.twitterAppTwo){
                        this.modalService.dismissAll();
                        this.modalService.open(this.twitterReconnectModal, { centered: true ,backdrop: 'static', size:"md", windowClass:'twitterReconnectModal-error' });
                    }
                    else {
                        this.taskErrorMessage = resp?.message.replace('t.me', 'telegram.me') || this.constants.SOMETHING_WRONG;
                        this.OpenInfoModalForCampaign(this.modalType.NOT_CLAIMED)
                    }
                } else {
                    this.taskCounterPercentage = 0;
                    this.startVerifyTask = false;
                    this.closeModal();
                    if(this.campaignType != this.SOCIAL_CONNECTIONS.ENGAGEMENT){
						this.OpenInfoModalForCampaign(this.modalType.CLAIMED);
					}
					if(this.campaignType == this.SOCIAL_CONNECTIONS.ENGAGEMENT){
						window.open(this.campaignUrl, "_blank");
					}
                    this.getCampaigns();
                    this.getUsersCompletedTasks();
                    this.getLoggedUserRank();
                    if(localStorage.getItem('reward')){
                       this.reward = localStorage.getItem('reward')
                    }
                    if(localStorage.getItem('symbol')){
                        this.symbol = localStorage.getItem('symbol')
                     }
                     console.log(this.reward,this.symbol,'============================>>>>>>>>>>>>>>>>>.')
                     console.log('=========================ppppppppppppppp')
                }
            },
            (err) => {
                localStorage.removeItem('campaignId');	
                localStorage.removeItem('taskActionStampId');
                localStorage.removeItem('category');
                this.showErrorMessage = err.error.message;
                if(this.waitingModalRef){
                    this.waitingModalRef.close();
                }
                // this.loaderService.hide();
                this.taskCounterPercentage = 0;
                this.startVerifyTask = false;
                if (err?.error?.data?.reverify) {
                    this.closeModal();
                    document.getElementById('reverifyModal').click();
                } 
                else if(err?.error?.data?.status == 429 && !err?.error?.data?.twitterAppTwo){
                    this.modalService.dismissAll();
                    this.modalService.open(this.twitterReconnectModal, { centered: true ,backdrop: 'static', size:"md", windowClass:'twitterReconnectModal-error'});
                }
                else {
                    this.closeModal();
                    this.taskErrorMessage = err?.error?.message.replace('t.me', 'telegram.me') || this.constants.SOMETHING_WRONG;
                        this.OpenInfoModalForCampaign(this.modalType.NOT_CLAIMED)
                }
                console.log(err);
            });
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
        this.callbackUrl=task?.callbackUrl;
        console.log(this.callbackUrl,'==========')
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


        startVerification() {
        this.blinker = false;
        this.timeLeftSecond = 10;
        if(this.category == this.SOCIAL_CONNECTIONS.TWITTER && this.campaignType == this.SOCIAL_CONNECTIONS.LIKE){
            this.timeLeftSecond = 20;
        }
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
     * @description: used to copy data
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
     * @description: used to start counter
     */
    startCounter() {
        this.timeLeftSecond--;
        if (document.getElementById("seconds").innerHTML) {
            document.getElementById("seconds").innerHTML = String(this.timeLeftSecond);
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
     * @description: used to get active social connection
     */
    getActiveSocialConnection() {
        // this.loaderService.show();
        this.shoutOutService.getSocialConnection().subscribe(
            (resp) => {
                // this.loaderService.hide();
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
                // this.loaderService.hide();
                console.log(err);
            }
        );
    }
    /**
     * @description: used to add social connection
     */
    addSocialConnection() {
        let id = JSON.parse(localStorage.getItem('_u'))._id;
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

	/**
	 * @description: used to open modal for mention handles
	 */
		OpenModalFormentionHandles(data?) {
			if(data){
				this.shoutoutCampaign = data
				this.campaignType = data?.type?.type
				this.campaignId = data?._id
			}
			console.log("data in mention handles+++++++",this.shoutoutCampaign);
			console.log("campaign type",this.campaignType);
			document.getElementById("OpenModalForMentionHandles").click();
		}

		OpenModalFormentionHandlesDiscord(data?) {
			if(data){
				this.shoutoutCampaign = data
				this.campaignType = data?.type?.type
				this.campaignId = data?._id
			}
			console.log("data in mention handles+++++++",this.shoutoutCampaign);
			console.log("campaign type",this.campaignType);
			document.getElementById("OpenModalForMentionHandlesDiscord").click();
		}

    /**
     * @description: used to open modal for social
     */
    OpenModalForSocial() {
        document.getElementById("OpenModalForSocial").click();
    }

    /**
     * @description: used to open modal for telegram
     */
    openModalForTelegram() {
        document.getElementById("openModalForTelegram").click();
    }

    openModalForDiscord() {
        document.getElementById("openModalForDiscord").click();
    }

    /**
     * @description: used to open modal for campaign
     */
    OpenModalForCampaign() {
        this.showErrorMessage = '';
        document.getElementById("OpenModalForCampaign",).click();
    }
    /**
     * @description: used to open waiting modal for campaign
     */
    OpenWaitingModalForCampaign() {
        this.showErrorMessage = '';
        this.closeModal();
        this.waitingModalRef =  this.modalService.open(this.waitingModal, { centered: true , backdrop: 'static', size:"md", windowClass:"congratulations-popup"});
        this.startVerification();
        
    }
    /**
     * @description: used to open info modal for campaign
     * @param type 
     */
    OpenInfoModalForCampaign(type) {
        this.selectedModalType = type;  
        this.modalService.open(this.infoModal, { centered: true ,backdrop: 'static', size:"md", windowClass:"congratulations-popup"});
    }
    /**
     * @description: used to open modal for twitter task
     */
    OpenModalForTwitterTask() {
        if(this.campaignType == this.SOCIAL_CONNECTIONS.QUOTE || this.campaignType == this.SOCIAL_CONNECTIONS.COMMENT){
            this.twitterTaskForm();
        }
        console.log("campaign url click on twitter task",this.campaignUrl);
        const twitterId = this.getTwitterId(this.campaignUrl);
        console.log("twitter id=======>>>>>>>",twitterId);
        this.twitterLink = twitterId;
        document.getElementById("OpenModalForTwitterTask").click();
    }
    /**
     * @description: used to open twitter task
     * @param content 
     */
    openTwitterTask(content){
        if(this.campaignType == this.SOCIAL_CONNECTIONS.FOLLOW){
            this.modalService.open(content, { centered: true ,backdrop: 'static', size:"sm"});


        }else{
            this.modalService.open(content, { centered: true ,backdrop: 'static', size:"md"});


        }
    }
    /**
     * @description: used to get twitter id
     * @param url
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
     * @description: used to open hide my name popup
     * @param content 
     */  
    openhideMyNamePopUp(content) {
        this.showError = false;
        let leaderName = JSON.parse(localStorage.getItem('_u'))?.name;
        this.leaderData = leaderName
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false, centered: true, size: 'md' })
    }

    /**
     * @description: used to customize name
     * @param leaderName 
     */
    hideName(leaderName) {
        this.showError = true;
        if (!this.hideCustomizeColumn && this.customNameToSend?.trim() == '') {
            return;
        }
        this.modalService.dismissAll();
        let dataToSend: any = {}
        if (this.hideCustomizeColumn && this.leaderData) {
            dataToSend.isDisplayNameHidden = this.hideCustomizeColumn
            dataToSend.displayName = leaderName[0] + '****' + leaderName[leaderName?.length - 1]
            dataToSend.isHidden = !leaderName?.isHidden || !leaderName?.isNameHidden
        }
        if (!this.hideCustomizeColumn) {
            dataToSend.displayName = this.customNameToSend?.trim();
            dataToSend.isHidden = !leaderName?.isHidden || !leaderName?.isNameHidden
            dataToSend.isDisplayNameHidden = this.hideCustomizeColumn
        }
        this.leaderData = '';
        this.hideCustomizeColumn = true;
        this.customNameToSend = '';
        // this.loaderService.show();
        this.shoutOutService.hideLeaderName(dataToSend).subscribe((resp) => {
            // this.loaderService.hide();
            if (resp.error) {
                this.toastrService.error(resp.message || this.constants.SOMETHING_WRONG, this.constants.ERROR, {
                    timeOut: 3000
                });
            } else {
                this.showHideMyName = false;
                this.getLoggedUserRank();
            }
        }, (err) => {
            // this.loaderService.hide();
            this.toastrService.error(err.error.message || this.constants.SOMETHING_WRONG, this.constants.ERROR, {
                timeOut: 3000
            });
        });
    }

    /**
     * @description: used to close modal and reset fields
     */
    closeModal(type?) {
        this.handlesError = null;
        if(this.twitterTaskContentForm){
            this.twitterTaskContentForm.reset();
        }
        this.taskErrorMessage = '';
        if(this.modalRef){
            this.modalRef.close();
            this.modalRef = null;
            return;
        }
		if(this.route.params)
        this.selectedModalType = '';
        this.twitterContentForm.reset();
        this.hideCheckBox.setValue(false);
        this.hideCustomizeColumn = true;
        this.leaderData = '';
        this.modalService.dismissAll();
        this.taskCounterPercentage = 0;
        this.startVerifyTask = false;
        if(type == 'info'){
            this.router.navigateByUrl('/shout-out');
        }
        localStorage.removeItem('errorMessage');
    }

    /**
     * @description: toggle customized name content
     */
    toggleHideMyNameContent() {
        this.showError = false;
        this.customNameToSend = '';
        this.hideCustomizeColumn = !this.hideCustomizeColumn;
    }

    /**
     * @description: used to open modal
     * @param content : modal content
     */
    open(content) {
        this.reverifyForm.reset();
        this.modalService.open(content, {
            ariaLabelledBy: 'modal-basic-title', centered: true, backdrop: 'static',
            keyboard: false
        })
    }
    /**
     * @description: used to connect social channel
     * @param value 
     */
    connectSocialChannel(value) {
        let id = JSON.parse(localStorage.getItem('_u'))?._id;
        if (value == this.SOCIAL_CONNECTIONS.YOUTUBE) {
            const token: string = this.sharedService.getToken();
            const user = this.sharedService.getCurrentUserId();
            let headers: any = {
                accountId: user,
                token: token,
            }
            headers = JSON.stringify(headers);
            window.location.href = `${environment.baseURL}auth/v1/google/social?id=${id}&headers=${headers}`;
        }
        else if (value == this.SOCIAL_CONNECTIONS.TWITTER) {
            window.location.href = `${environment.baseURL}auth/v1/twitter/social?id=${id}`;
        }
        else {
            return;
        }
    }
    /**
     * @description: change function of pagination
     * @param page 
     * @param listingType 
     */
    pageChanged(page, listingType) {
        if (listingType == 'campaign') {
            this.currentPageForTaskListing = page;
            this.getCampaigns();
        } else {
            this.currentPageForLeaderListing = page;
            this.getLoggedUserRank();
        }
    }
    /**
     * @description: used to copy mention hadles
     */
    copyAllHandles() {
        let allHandles = [];
        this.mentionHandlesArr.forEach((item) => {
            if (item.charAt(0) != '@') {
                item = "@" + item
            }
            allHandles.push(item)
        })
        this.cpyToClipboard(allHandles.join(', '));
    }
    /**
     * @description: used to copy data
     */
    cpyToClipboard(text) {
        document.addEventListener("copy", (e: ClipboardEvent) => {
            e.clipboardData.setData("text/plain", text);
            e.preventDefault();
            document.removeEventListener("copy", null);
        });
        document.execCommand("copy");
        this.toastrService.success(this.constants.COPIED_TO_CLIPBOARD, this.constants.SUCCESS, {
            timeOut: 3000
        });
    }
    /**
     * @description: used to perform task on proceed click
     */
    onProceedClick() {
        console.log(this.campaignType, this.SOCIAL_CONNECTIONS.COMMENT, this.campaignType == this.SOCIAL_CONNECTIONS.QUOTE)
        if(this.campaignType == this.SOCIAL_CONNECTIONS.COMMENT || this.campaignType == this.SOCIAL_CONNECTIONS.QUOTE){
            this.OpenModalForTwitterTask();
        } else if(this.campaignType == this.SOCIAL_CONNECTIONS.TWEET){
            if(this.twitterContentForm?.invalid){
                this.validator.markControlsTouched(this.twitterContentForm);
                return false;
            }
            this.performTask();
        }else{
            this.modalService.dismissAll();
            this.OpenModalForCampaign();
            if (this.campaignType != this.SOCIAL_CONNECTIONS.TWEET) {
                window.open(this.campaignUrl, "_blank");
            } else {
                window.open(this.twitterURL, "_blank");
            }
        }
    }
    /**
     * @description: used to reverify modal submit
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
        // this.loaderService.show();
        this.shoutOutService.verifyTask(dataToSend).subscribe((res) => {
            // this.loaderService.hide();
            if (res?.error) {
                this.taskErrorMessage = this.constants.WRONG_LINK_OR_TASK_NOT_PERFORM; 
                this.selectedModalType = this.modalType.NOT_CLAIMED;    
                this.modalRef = this.modalService.open(this.infoModal, { centered: true ,backdrop: 'static', size:"md", windowClass:"congratulations-popup"});
                
                console.log(res)
            } else {
                this.toastrService.success(this.constants.TASK_VERIFIED_SUCCESS);
                this.closeModal();
            }
        }, (error) => {
            // this.loaderService.hide();
            this.taskErrorMessage = this.constants.WRONG_LINK_OR_TASK_NOT_PERFORM; 
            this.selectedModalType = this.modalType.NOT_CLAIMED;    
            this.modalRef = this.modalService.open(this.infoModal, { centered: true ,backdrop: 'static', size:"md", windowClass:"congratulations-popup"});
            console.log(error)
        })
    }

    /**
     * @description: used to navigate to launchpad
     */
    back() {
        this.router.navigate(['/launchpad'])
    }

    /**
     * @description: used to handle telegram login
     * @param event 
     */
    handleTelegramLogin(event) {
        let data = event;
        this.shoutOutService.loginWithTelegram(data).subscribe(response => {
            this.getActiveSocialConnection();
            if (response.error) {
                // this.loaderService.hide();
                this.taskErrorMessage = (response?.message || this.constants.SOMETHING_WRONG);
                this.OpenInfoModalForCampaign(this.modalType.ERROR)
            } else {
                // this.loaderService.hide();
                this.taskErrorMessage = Messages.CONST_MSG.SOCIAL_ADDED_SUCCESSFULLY;
                this.OpenInfoModalForCampaign(this.modalType.SUCCESS)
            }
        }, err => {
            // this.loaderService.hide();
            this.taskErrorMessage = err.error.message || this.constants.SOMETHING_WRONG;
                this.OpenInfoModalForCampaign(this.modalType.ERROR)
        });
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
            }else{
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
     * @description: used to check mention handles array
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

    async scrollLeaderBoard(props?){
        console.log("going on scroll leaderboard more func")
        this.moreScrollBtn = true;
        this.topScrollBtn = false;
        const scrollableDiv = document.getElementById('scrollableDiv');
        
        if(props == 'more'){
        scrollableDiv.scrollTop += 200; // Change the value to adjust scrolling speed
        }
        if(props == "top"){
            scrollableDiv.scrollTop = 0;
        }     
        console.log("scroll top value",scrollableDiv.scrollTop);
        console.log("div scrollable height",(scrollableDiv.scrollHeight - scrollableDiv.clientHeight))
        // Check if the user has reached the bottom
        const isAtBottom = scrollableDiv.scrollTop >= ((scrollableDiv.scrollHeight - scrollableDiv.clientHeight) - 1);
      
        if (isAtBottom) {
          console.log("Reached the bottom!");
          this.moreScrollBtn = false;
          this.topScrollBtn = true;
          console.log("more scroll btn",this.moreScrollBtn);
          console.log("top scroll btn",this.topScrollBtn);
          // Your additional actions or logic when reaching the bottom can be added here.
        }
    }

    async scrollLeaderBoardProjects(props, id?){
    
        this.moreScrollProjectBtn = true;
        this.topScrollProjectBtn = false;
        // const scrollableDiv = document.getElementById('scrollableDiv2');
        // if(id){
            const scrollableDiv = document.getElementById(id);
            if(this.selectedIndex < this.leadershipProjects?.length){
            }
        // }
        if(props == 'more'){
        scrollableDiv.scrollTop += 200; // Change the value to adjust scrolling speed
        }
        if(props == "top"){
            scrollableDiv.scrollTop = 0;
        }     
        // Check if the user has reached the bottom
        const isAtBottom = scrollableDiv.scrollTop >= ((scrollableDiv.scrollHeight - scrollableDiv.clientHeight) - 1);
      
        if (isAtBottom) {
            console.log("at bottom")
          this.moreScrollProjectBtn = false;
          this.topScrollProjectBtn = true;
          // Your additional actions or logic when reaching the bottom can be added here.
        }
    }
    redirectToProfile(){
        this.closeModal();
        this.router.navigate(['settings/profile']);
    }
	getUsersCompletedTasks(){
        this.shoutOutService.getUsersCompletedTasks().subscribe((res) => {
            this.loaderService.hide();
            if (res?.error) {
              
            } else {
				this.upcommingCompitionsArray?.forEach((item, i)=>{
					this.upcommingCompitionsArray[i].completedTasks = res?.data[item?._id]?.completedTasks 
					
					
				})
            }
        }, (error) => {
           this.loaderService.hide();
        })
	}

	/**
	 * @description: used to mark telegram engagement task as completed
	 */
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
                this.modalService.dismissAll()
			} else {
				this.closeModal();
				this.getCampaigns();
				this.selectedModalType = this.modalType.SUCCESS;
                this.reward=localStorage.getItem('reward')
                this.symbol=localStorage.getItem('symbol')
                console.log(this.reward,this.symbol,'--------------------reward symbol')
                console.log(localStorage.getItem('reward'),localStorage.getItem('symbol'),'--------------------local reward symbol')
				this.modalRef = this.modalService.open(this.infoModal, { centered: true ,backdrop: 'static', size:"md", windowClass:"congratulations-popup"});
			}
		}, (error) => {
			this.loaderService.hide();
            this.modalService.dismissAll();
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
                        this.markEngagementTaskCompleted()
                    }
                    else {
                        this.toastrService.error(this.constants.DAILY_REWARD_LIMIT_EXCEED);
                        this.modalService.dismissAll();
                    }
                
			
			}
		}, (err) => {
			this.loaderService.hide()
		});
    }

		/**
	 * @description: connect user to second app
	 */
		connectUserToSecondApp(){
			localStorage.setItem('campaignId', this.campaignId);
            localStorage.setItem('taskActionStampId',this.taskActionStampId);
            localStorage.setItem('category',this.category);
			let id = JSON.parse(localStorage.getItem('_u'))?._id;
			window.location.href = `${environment.baseURL}auth/v1/twitter/social/two?id=${id}`;
		}

        VerifyUpdateNewTask(){
            if(this.noTaskupdate?.invalid){
                this.noTaskupdate.markAllAsTouched();
                return
            }
            let dataToSend: any = {
                // email:this.email?.value
                allowEmailUpdates: true
			}
			this.loaderService.show();
			this.shoutOutService.newUpdateTask(dataToSend).subscribe((res) => {
				this.loaderService.hide();
				if (res?.error) {
					this.toastrService.error(res?.message);	
					console.log(res)
				} else {
                    this.toastrService.success(res?.message);
                    this.modalService.dismissAll();
                    this.userData.allowemailupdates = true;
                    window.localStorage.setItem('_u', JSON.stringify(this.userData));
				}
			}, (error) => {
				this.loaderService.hide();
				this.toastrService.error(error?.error?.message);
				console.log(error)
			})
		
		}  

        openNoTaskModel(content){
                     
            this.modalService.open(content, { centered: true ,backdrop: 'static', size:"md", windowClass:"getUpdates-popup"});

    }

    waitingModalForEngagement(){
        this.closeModal();
        this.getCampaigns()
        this.waitingModalRef =  this.modalService.open(this.waitingModal, { centered: true , backdrop: 'static', size:"md", windowClass:"congratulations-popup"});
        this.startVerificationForEngagement();
    }

    startVerificationForEngagement(){
        this.blinker = false;
        this.timeLeftSecond = 10;
        this.startVerifyTask = true;
        var countDown = setInterval(() => {
            if (this.timeLeftSecond <= 0) {
                this.blinker = true
                // this.markEngagementTaskCompleted();
                this.checkrewardAvailableForEngagementTask()
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
}


