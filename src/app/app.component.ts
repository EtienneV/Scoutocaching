import { Component } from '@angular/core';

import {CookieService} from 'ngx-cookie-service';  
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ModalChangeTerreComponent } from './components/modal-changeTerre/modal-changeTerre.component';
import { ModalAideComponent } from './components/modal-aide/modal-aide.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Scoutocaching';
  terreChoosed='';
  constructor(private modalService: NgbModal, private cookieService: CookieService) {
    this.terreChoosed = this.cookieService.get('scoutocaching_terre');

  }

  changeTerre():void{
    const onboarding = this.modalService.open(ModalChangeTerreComponent, {size: 'lg', centered: true }); 
    onboarding.result.then((result) => {
      console.log(result);
      this.terreChoosed=result;
      this.cookieService.set('scoutocaching_terre',this.terreChoosed);
      //this.init()
    }, (reason) => {
      console.log(reason);
    });
  }
  chargeAide():void{
    const onboarding = this.modalService.open(ModalAideComponent, {size: 'lg', centered: true }); 
    // onboarding.result.then((result) => {
    //   // console.log(result);
    //   //this.init()
    // }, (reason) => {
    //   // console.log(reason);
    // });
  }
  async lireIntrigue():Promise<void>{
    const onboarding = this.modalService.open(ModalAideComponent, {size: 'lg', centered: true }); 
    if(this.cookieService.get('scoutocaching_terre')==="lumieres"){
      await import("../assets/content/lumieres_loader.json").then(data => {
        onboarding.componentInstance.loadContent(data['description']);
        onboarding.componentInstance.title = data['description'].filter(word => word.type ==="title")[0].text;
        // onboarding.componentInstance.indice = data.description;
      });
      
    }
    else if(this.cookieService.get('scoutocaching_terre')==="canuts"){
      await import("../assets/content/canuts_loader.json").then(data => {
        onboarding.componentInstance.loadContent(data['description']);
        onboarding.componentInstance.title = data['description'].filter(word => word.type ==="title")[0].text;
        // onboarding.componentInstance.indice = data.description;
            });
    }
    else if(this.cookieService.get('scoutocaching_terre')==="gones"){

      await import("../assets/content/gones_loader.json").then(data => {
        onboarding.componentInstance.loadContent(data['description']);
        onboarding.componentInstance.title = data['description'].filter(word => word.type ==="title")[0].text;
        // onboarding.componentInstance.indice = data.description;
      });
    }
    // onboarding.result.then((result) => {
    //   // console.log(result);
    //   //this.init()
    // }, (reason) => {
    //   // console.log(reason);
    // });
  }
}
