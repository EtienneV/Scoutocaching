import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MericourtComponent } from './pages/main/main.component';
import { MapComponent } from './components/map/map.component';
import { LoginComponent } from './authentification/login/login.component';
import { PageSiteComponent } from './components/page-site/page-site.component';
import { ModalCacheComponent } from './components/modal-cache/modal-cache.component';
import { ModalOnBoardingComponent } from './components/modal-onboarding/modal-onboarding.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { ModalChangeTerreComponent } from './components/modal-changeTerre/modal-changeTerre.component';

@NgModule({
  declarations: [
    AppComponent,
    MericourtComponent,
    MapComponent,
    LoginComponent,
    PageSiteComponent,
    ModalCacheComponent,
    ModalOnBoardingComponent,
    ModalChangeTerreComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    NgbModule,
    ZXingScannerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
