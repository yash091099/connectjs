import { Component, OnInit } from '@angular/core';
import { ShoutOutService } from '../main/shout-out/service/shout-out.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-twitter-html',
  templateUrl: './twitter-html.component.html',
  styleUrls: ['./twitter-html.component.css']
})
export class TwitterHtmlComponent implements OnInit {
  public showLoader = false;
  public twitterHTML:any;
  
  constructor(private shoutoutService: ShoutOutService, public route: ActivatedRoute,) { }

  ngOnInit(): void {
	this.route.params.subscribe((params) => {
		console.log(params)
		if(params?.id){
			this.getCampaignDetails(params?.id)
		}
	})	
  }

  preventAction($event){
	$event.preventDefault()
  }

  getCampaignDetails(id){
	this.showLoader = true;
	this.shoutoutService.getCampaignDetailsById(id).subscribe((res)=>{
		this.showLoader = false;
		let data = res?.data;		
			this.twitterHTML = '<blockquote class=\"twitter-tweet\"><p lang=\"en\" dir=\"ltr\">🚀💰 Ready to conquer the Crypto Market? 📈💎<br><br>🌟 Survive and thrive in the crypto market by following these tips. Let&#39;s embrace the future of finance together! 💪🚀💎<a href=\"https://twitter.com/hashtag/Crypto?src=hash&amp;ref_src=twsrc%5Etfw\">#Crypto</a> <a href=\"https://twitter.com/hashtag/Cryptocurrency?src=hash&amp;ref_src=twsrc%5Etfw\">#Cryptocurrency</a> <a href=\"https://twitter.com/hashtag/Investing?src=hash&amp;ref_src=twsrc%5Etfw\">#Investing</a> <a href=\"https://twitter.com/hashtag/SurviveAndThrive?src=hash&amp;ref_src=twsrc%5Etfw\">#SurviveAndThrive</a> <a href=\"https://twitter.com/hashtag/CryptoGuide?src=hash&amp;ref_src=twsrc%5Etfw\">#CryptoGuide</a> <a href=\"https://twitter.com/hashtag/KnowledgeIsPower?src=hash&amp;ref_src=twsrc%5Etfw\">#KnowledgeIsPower</a> <a href=\"https://t.co/hWUTfGuEbW\">pic.twitter.com/hWUTfGuEbW</a></p>&mdash; TDX (@TDXLaunchpad) <a href=\"https://twitter.com/TDXLaunchpad/status/1662163943140491266?ref_src=twsrc%5Etfw\">May 26, 2023</a></blockquote>\n<script async src=\"https://platform.twitter.com/widgets.js\" charset=\"utf-8\"></script>\n';
			this.twitterHTML = this.twitterHTML.replace("\n");
			this.twitterHTML = this.twitterHTML.replace("undefined", '');
	}, (error)=>{
		this.showLoader = false;
	})
  }

}
