import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperServices } from './jwt-helper.service';
@Injectable({
  providedIn: 'root'
})
export class LoginGaurdService {

  constructor(private jwtHelper: JwtHelperServices, private router: Router) { }
  canActivate(): boolean {
    if (!this.jwtHelper.isTokenExpired) {
      this.router.navigate(['/launchpad']);
      return false;
    }
    return true;
  }
}
