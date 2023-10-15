import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { JwtHelperServices } from './jwt-helper.service';
import { CommonApiService } from './common-api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGaurdService {

  constructor(
    private jwtHelper: JwtHelperServices, 
    private router: Router, 
    private sharedService: CommonApiService
  ){}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.jwtHelper.isTokenExpired) {
      const currentUrl = state.url;
      const segments = currentUrl.split('/');
      const lastSegment = segments[segments.length - 1];
	  console.log(segments, "___________")
	  if(segments?.length == 6){
		localStorage.setItem('projectName', segments[segments.length - 3]);
		localStorage.setItem('projectId',segments[segments.length - 2]);
	  }else if(segments?.length == 3){
		localStorage.setItem('pageName', segments[segments.length - 2]);
	  }
      window.localStorage.removeItem('_u');
      window.localStorage.removeItem('token');
      if(lastSegment){
        this.router.navigate(['auth/login',lastSegment]);
      }
      else{
        this.router.navigate(['auth']);
      }
      return false;
    }
    this.sharedService.isUserLoggedIn();
    return true;
  }

  canActivateChild(): boolean {
    if (this.jwtHelper.isTokenExpired) {
      window.localStorage.removeItem('_u');
      window.localStorage.removeItem('token');
      this.router.navigate(['auth']);
      return false;
    }
    return true;
  }
}
