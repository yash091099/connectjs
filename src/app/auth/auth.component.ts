import { Component, OnInit } from '@angular/core';
import { CookiesService } from '../shared/services/cookies.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
	public cookieBox = false;
  constructor(private cookieService: CookiesService) { }

  ngOnInit(): void {
	if(this.cookieService.get('cookie-box')){
		this.cookieBox = true
	}
  }

}
