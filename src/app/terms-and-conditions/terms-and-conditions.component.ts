import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.css']
})
export class TermsAndConditionsComponent implements OnInit {
  isLoggedIn = false
  constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle("TDX Launchpad | Terms-Conditions");

    if (localStorage.getItem('_u')) {
      this.isLoggedIn = true;
    }
  }

}
