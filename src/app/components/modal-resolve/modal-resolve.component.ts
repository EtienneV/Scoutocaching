import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import {NgbActiveModal, NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {DomSanitizer} from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-modal-resolve',
  templateUrl: './modal-resolve.component.html',
  styleUrls: ['./modal-resolve.component.scss'],
})
export class ModalResolutionComponent implements OnInit {
  @Input() public content;
  header:any;
  footer:any;
  title="Territoire Lyon levant"
  choice:string;
  resolved=false;
  parcoursName:string;
  // content = [
  //   // {
  //   //   type: "titre",
  //   //   text: "Titre de l'indice"
  //   // },
  //   // {
  //   //   type: "paragraphe",
  //   //   text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer consequat tempus ipsum, ac accumsan enim malesuada sed. Integer dictum lectus ex. In elementum mi id magna dignissim vehicula. Praesent sit amet vulputate nulla. Donec arcu sem, aliquet nec ligula a, varius aliquet nunc. Sed vestibulum ipsum quam, in auctor nisl finibus vitae. Quisque a faucibus turpis. Mauris mauris metus, rhoncus in iaculis luctus, rutrum at lectus. Vivamus facilisis et elit nec cursus. Mauris dignissim pretium erat. In eleifend varius commodo. Curabitur et pulvinar elit, sit amet fermentum nunc. Integer cursus elementum urna eget auctor."
  //   // },
  //   // {
  //   //   type: "titre",
  //   //   text: "Vidéo"
  //   // },
  //   // {
  //   //   type: "video",
  //   //   url: "https://www.youtube.com/embed/1Rk1K5Mmnbg",
  //   //   trustedUrl: {}
  //   // },
  //   // {
  //   //   type: "titre",
  //   //   text: "Image"
  //   // },
  //   {
  //     type: "bouton",
  //     text: "Terre des Gones",
  //     url: "assets/icons/Composant 7 – 2.png"
  //   },
  //   {
  //     type: "image",
  //     url: "assets/icons/Composant 7 – 2.png",
  //     trustedUrl: {}
  //   },
  //   {
  //     type: "paragraphe",
  //     text: "Bienvenue dans ce jeu de piste"
  //   }
  // ]

  constructor(public activeModal: NgbActiveModal, private sanitizer: DomSanitizer, private cookieService : CookieService) { }

  ngOnInit(): void {
    this.start();
  }

  validContent():void{
    const elementsToBeRemoved=[];
    for (let i = 0; i < this.content.length; i++) {
      const element = this.content[i];
      if (element.type == "titre" || element.type=="paragraphe" ){
        if (element.text!=null){
                element.text=element.text.replace('\"','"')
        }
        else{
              elementsToBeRemoved.push(this.content.indexOf(element))
        }
      }
      if(element.type == "video" || element.type == "image") {
        if(element.url!=null){
        element.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(element.url)
        }else{
              elementsToBeRemoved.push(this.content.indexOf(element))
        }
      }
    }
    for (var i = elementsToBeRemoved.length-1; i>=0 ; i--) {
        this.content.splice(elementsToBeRemoved[i],1);
    }
  }
  start():void{
    this.title="Qui est le coupable ?";
    this.validContent();
    console.log(this.content);
  }

  isCoupable(ans){
    if(!ans){
      alert("Oups, ce n'est pas le coupable !");
    }
    else{
      this.cookieService.set('scoutocaching_caches_' + this.parcoursName + "_done","true");
      this.title="Félicitations !";
      this.resolved=true;
      // setTimeout(()=>{this.activeModal.close(this.resolved);},3000);
    }
    console.log(ans);
  }
  deepClone(oldArray: Object[]) {
    let newArray: any = [];
    oldArray.forEach((item) => {
      newArray.push(Object.assign({}, item));
    });
    return newArray;
  }
}
