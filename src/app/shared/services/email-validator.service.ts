import { AbstractControl } from "@angular/forms";
import { environment } from "src/environments/environment";


  function forbiddenEmailValidation(control: AbstractControl): { [key: string]: any } | null {
    if (control.value) {
      const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      let forbidden = emailRegex.test(control.value);
      if(environment.production){
        const invalidTestingMailDomains:any = [
          "example.com",
          "example.net",
          "example.org",
          "test.com",
          "test.net",
          "test.org",
          "invalid.com",
          "invalid.net",
          "invalid.org",
          "example.test",
          "example.invalid",
          "mailinator.com",
          "10minutemail.com",
          "guerrillamail.com",
          "temp-mail.org",
          "33mail.com",
          "1usemail.com",
          "sharklasers.com",
          "throwawayemail.com",
          "yopmail.com",
          "dispostable.com",
          "getnada.com",
          "fakeinbox.com",
          "maildrop.cc",
          "tempmailaddress.com"
          ];
        let email = control.value?.split("@")
        if(invalidTestingMailDomains.includes(email[1]?.trim())){
          forbidden = false
        }
      }
      return !forbidden ? { 'forbiddenEmail': { value: control.value } } : null;
    }
    return null;
  }

export default forbiddenEmailValidation; 