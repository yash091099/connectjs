import { Injectable } from '@angular/core';
import { HttpencapService } from 'src/app/shared/services';
@Injectable({
  providedIn: 'root'
})
export class StartupService {
  constructor(private http: HttpencapService) { }
  fetchStartUps(data?) {
    return this.http.get("startup/v1/get/startup", data);
  }
  fetchProjects(data?) {
    return this.http.get("startup/v1/get/startup/details", data);
  }
  getBanners() {
    return this.http.get("startup/v1/get/startup/banners/users");
  }
}
