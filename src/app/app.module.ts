import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DevicesComponent } from './pages/devices/devices.component';
import { PilotageComponent } from './pages/pilotage/pilotage.component';
import { MericourtComponent } from './pages/mericourt/mericourt.component';
import { NodeComponent } from './pages/node/node.component';
import { MapComponent } from './components/map/map.component';
import { LoginComponent } from './authentification/login/login.component';
import { PageSiteComponent } from './components/page-site/page-site.component';
import { RasJabelComponent } from './pages/ras-jabel/ras-jabel.component';

@NgModule({
  declarations: [
    AppComponent,
    DevicesComponent,
    PilotageComponent,
    MericourtComponent,
    NodeComponent,
    MapComponent,
    LoginComponent,
    PageSiteComponent,
    RasJabelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
