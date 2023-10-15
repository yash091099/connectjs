import { Injectable } from '@angular/core';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class ShareLinkService {

  constructor() { }

  facebookShareableLink(shareLink){
    console.log('Facebook');
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareLink}`,'_blank');
  }

  twitterShareableLink(shareLink, title){
    console.log('Twitter');
    window.open(`https://twitter.com/share?&url=${shareLink}&text=${title}`,'_blank');
  }

  linkedInShareableLink(shareLink){
    console.log('LinkedIn');
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareLink}`,'_blank');
  }

  redditShareableLink(shareLink, title){
    console.log('reddit');
    window.open(`https://reddit.com/submit?url=${shareLink}&text=${title}`,'_blank');
  }


  telegramShareableLink(shareLink){
    window.open(`https://telegram.me/share/url?url=${shareLink}`,'_blank');
  }

}
