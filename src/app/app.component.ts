import { Component } from '@angular/core';

import {CookieService} from 'ngx-cookie-service';  
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ModalChangeTerreComponent } from './components/modal-changeTerre/modal-changeTerre.component';

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
      this.terreChoosed=result;
      this.cookieService.set('scoutocaching_terre',this.terreChoosed);
      //this.init()
    }, (reason) => {
      console.log(reason);
    });
  }
}
