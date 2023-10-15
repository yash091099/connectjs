import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-sale-card',
  templateUrl: './project-sale-card.component.html',
  styleUrls: ['./project-sale-card.component.css']
})
export class ProjectSaleCardComponent implements OnInit {
  /** Event Emitter */
  @Input() projectdata:any;

  constructor(private router: Router) { }

  ngOnInit(): void {
    console.log(this.projectdata,'++++++++++++++++++++++++++++++++++')
  }
  /**
   * @description: used to redirect to startup details
   * @param id 
   * @param roundId 
   */
  redirectToStartup(id,roundId) {
    this.router.navigate([`startup/details/${id}/${roundId}`]);
    
  }
}
