import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {NgbActiveModal, NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {DomSanitizer} from '@angular/platform-browser';
import { BarcodeFormat } from '@zxing/library';
@Component({
  selector: 'app-modal-onboarding',
  templateUrl: './modal-onboarding.component.html',
  styleUrls: ['./modal-onboarding.component.scss'],
})
export class ModalOnBoardingComponent implements OnInit {
  
  showStart=true
  showTerreChoice=false
  title="Territoire Lyon levant"
  content = [
    // {
    //   type: "titre",
    //   text: "Titre de l'indice"
    // },
    // {
    //   type: "paragraphe",
    //   text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer consequat tempus ipsum, ac accumsan enim malesuada sed. Integer dictum lectus ex. In elementum mi id magna dignissim vehicula. Praesent sit amet vulputate nulla. Donec arcu sem, aliquet nec ligula a, varius aliquet nunc. Sed vestibulum ipsum quam, in auctor nisl finibus vitae. Quisque a faucibus turpis. Mauris mauris metus, rhoncus in iaculis luctus, rutrum at lectus. Vivamus facilisis et elit nec cursus. Mauris dignissim pretium erat. In eleifend varius commodo. Curabitur et pulvinar elit, sit amet fermentum nunc. Integer cursus elementum urna eget auctor."
    // },
    // {
    //   type: "titre",
    //   text: "Vidéo"
    // },
    // {
    //   type: "video",
    //   url: "https://www.youtube.com/embed/1Rk1K5Mmnbg",
    //   trustedUrl: {}
    // },
    // {
    //   type: "titre",
    //   text: "Image"
    // },
    {
      type: "bouton",
      text: "Terre des Gones",
      url: "../../assets/icons/Composant 7 – 2.png"
    },
    {
      type: "image",
      url: "../../assets/icons/Composant 7 – 2.png",
      trustedUrl: {}
    },
    {
      type: "paragraphe",
      text: "Bienvenue dans ce jeu de piste"
    }
  ]

  constructor(public activeModal: NgbActiveModal, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.content=[{
      type: "image",
      url: "../../assets/icons/Composant 7 – 2.png",
      trustedUrl: {}
    },
    {
      type: "paragraphe",
      text: "Bienvenue dans ce jeu de piste"
    }];
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
    console.log("Ouvrir choix Terres")
    this.showStart=false;
    this.showTerreChoice=true;
    this.title="Quelle est ta terre ?"
    this.content=[{
      type: "bouton",
      text: "Terre des Gones",
      url: "../../assets/icons/Composant 4 – 2.png"
    },
    {
      type: "bouton",
      text: "Terre des Canuts",
      url: "../../assets/icons/Composant 5 – 2.png"
    },
    {
      type: "bouton",
      text: "Terre des Lumieres",
      url: "../../assets/icons/Composant 6 – 2.png"
    } ]
  }
  selectTerre(e):void{
    var choice="";
    if (e==="Terre des Gones"){
      choice="gones";
      // console.log("Gones");
    }
    else if(e==="Terre des Lumieres"){
      choice="lumieres";
      // console.log("Lumières");
    }
    else{
      choice="canuts";
      // console.log("Canuts");
    }
    this.activeModal.close(choice);
  }
}
