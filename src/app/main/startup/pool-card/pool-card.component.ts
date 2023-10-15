import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pool-card',
  templateUrl: './pool-card.component.html',
  styleUrls: ['./pool-card.component.css']
})
export class PoolCardComponent implements OnInit {
  @Input() projectdata:any;
  @Input() detectLastCardBool:any;

  constructor() { }

  ngOnInit(): void {
    console.log(this.projectdata,'++++++++++++++++++++++_____________________++++++++++++++')
    console.log(this.detectLastCardBool,'++++++++++++++++++++++_____________________++++++++++++++')


  }

  
  
}
