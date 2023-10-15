import { RouterModule } from '@angular/router';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { ShowErrorsComponent } from './components/show-errors/show-errors.component';

import { LoaderService } from './components/loader/loader.service';
import { JwtHelperServices } from './services/jwt-helper.service';
import { CommonApiService } from './services/common-api.service';
import { MessageService } from './components/messages/message.service';
import { MessagesComponent } from './components/messages/messages.component';
import { AmountService } from './services/amount.service';
import { CookiesService } from './services/cookies.service';
import { SafePipe } from './pipe/safe.pipe';
import { TruncatePipe } from './pipe/truncate.pipe';
import { DecimalPipe } from './pipe/decimal.pipe';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ShortNumberPipe } from './pipe/short-number-pipe';
import { HeaderComponent } from './components/header/header.component';
import { OrdinalPipe } from './pipe/ordinal.pipe';
import { FetchImageSrcPipe } from './pipe/fetch-image-src.pipe';
import { ProjectSaleCardComponent } from './components/project-sale-card/project-sale-card.component';
import { KycVerifyComponent } from './components/kyc-verify/kyc-verify.component';

const SHARED_COMPONENTS = [
  MessagesComponent,
  SafePipe,
  TruncatePipe,
  DecimalPipe,
  ShortNumberPipe,
  OrdinalPipe,
  FetchImageSrcPipe
];

const SINGLETON_SERVICES = [
  LoaderService,
  JwtHelperServices,
  CommonApiService,
  MessageService,
  AmountService,
  CookiesService,
  HeaderComponent
];

export const jwtConfig = {
  config: {
    tokenGetter: tokenGetter,
    headerName: environment.headerName,
    authScheme: environment.authScheme,
    throwNoTokenError: false,
    whitelistedDomains: environment.whitelistedDomains,
    blacklistedRoutes: environment.blacklistedRoutes,
  },
};
export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [ShowErrorsComponent, ...SHARED_COMPONENTS, ProjectSaleCardComponent, KycVerifyComponent,],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    NgbTooltipModule
  ],
  exports: [
    ShowErrorsComponent,
    CommonModule,
    ProjectSaleCardComponent,
    ...SHARED_COMPONENTS,
  ],
  providers: [
    CommonApiService,
    CookiesService
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        ...SINGLETON_SERVICES,
      ],
    };
  }
}
