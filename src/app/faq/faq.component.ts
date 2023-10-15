import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Constants } from '../config/constant';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  /**Boolean */
  isLoggedIn = false
  /**Constant */
  marqueeData = Constants.marqueeData
  
  constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle("TDX Launchpad | FAQ");
    if (localStorage.getItem('_u')) {
      this.isLoggedIn = true;
    }
  }

}
