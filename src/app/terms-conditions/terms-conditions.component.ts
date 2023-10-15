import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.css']
})
export class TermsConditionsComponent implements OnInit {
  isLoggedIn = false
  constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle("TDX Launchpad | Terms-Conditions");

    if (localStorage.getItem('_u')) {
      this.isLoggedIn = true;
    }
  }

}
