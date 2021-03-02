import { Component, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
import lumieres_loader from '@assets/content/lumieres_loader.json';
import canuts_loader from '@assets/content/canuts_loader.json';
import gones_loader from '@assets/content/gones_loader.json';
@Component({
  selector: 'app-modal-onboarding',
  templateUrl: './modal-onboarding.component.html',
  styleUrls: ['./modal-onboarding.component.scss'],
})

export class ModalOnBoardingComponent implements OnInit {

  terreChoosed: string;

  alreadyStarted = false;
  showStart = true
  showTerreChoice = false
  showTerreContent = false

  title = "Territoire Lyon levant"

  content = [
    {
      type: "bouton",
      text: "Terre des Gones",
      url: "assets/icons/Composant 7 – 2.png",
      done: true
    },
    {
      type: "image",
      url: "assets/icons/Composant 7 – 2.png",
      trustedUrl: {}
    },
    {
      type: "paragraphe",
      text: "Bienvenue dans ce jeu de piste"
    }
  ]


  choice = "";
  header: any;
  footer: any;

  constructor(public activeModal: NgbActiveModal, private sanitizer: DomSanitizer, private cookieService: CookieService) {
    this.terreChoosed = this.cookieService.get('scoutocaching_terre');
    this.alreadyStarted = this.cookieService.check('alreadyStarted');

    console.log("terreChoosed : " + this.terreChoosed);
    console.log("alreadyStarted : " + this.alreadyStarted);
  }

  ngOnInit(): void {

    this.content = [{
      type: "image",
      url: "assets/icons/Composant 7 – 2.png",
      trustedUrl: {}
    },
    {
      type: "paragraphe",
      text: "Bienvenue dans ce jeu de piste"
    }];

    this.validContent();

  }

  validContent(): void {
    const elementsToBeRemoved = [];

    console.log(this.content)

    for (let i = 0; i < this.content.length; i++) {
      const element = this.content[i];
      if (element.type == "titre" || element.type == "paragraphe") {
        if (element.text != null) {
          element.text = element.text.replace('\"', '"')
        }
        else {
          elementsToBeRemoved.push(this.content.indexOf(element))
        }
      }
      if (element.type == "video" || element.type == "image") {
        if (element.url != null) {
          element.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(element.url)
        } else {
          elementsToBeRemoved.push(this.content.indexOf(element))
        }
      }
    }

    console.log(elementsToBeRemoved)

    for (var i = elementsToBeRemoved.length - 1; i >= 0; i--) {
      this.content.splice(elementsToBeRemoved[i], 1);
    }

    console.log(this.content)

  }

  start(): void {
    if (this.terreChoosed === "") {

      console.log("Ouvrir choix Terres")

      this.showStart = false;
      this.showTerreChoice = true;

      this.title = "Quelle est ta terre ?"

      this.content = [{
        type: "bouton",
        text: "Terre des Gones",
        url: "assets/icons/Composant 4 – 2.png",
        done: this.cookieService.check('scoutocaching_caches_gones_done')
      },
      {
        type: "bouton",
        text: "Terre des Canuts",
        url: "assets/icons/Composant 5 – 2.png",
        done: this.cookieService.check('scoutocaching_caches_canuts_done')
      },
      {
        type: "bouton",
        text: "Terre des Lumieres",
        url: "assets/icons/Composant 6 – 2.png",
        done: this.cookieService.check('scoutocaching_caches_lumieres_done')
      }];
      this.validContent();

    } else {
      this.activeModal.close(this.terreChoosed);
    }

  }

  selectTerre(e): void {

    console.log(e)

    if (e === "Terre des Gones") {
      this.choice = "gones";
      this.content = gones_loader.description;
    }
    else if (e === "Terre des Lumieres") {
      this.choice = "lumieres";
      this.content = lumieres_loader.description;
      // console.log("Lumières");
    }
    else {
      this.choice = "canuts";
      this.content = canuts_loader.description;
      // const json:any = lumiere_loader;
      // console.log("Canuts");
    }

    this.title = e;
    this.validContent();

    this.showTerreChoice = false;
    this.showTerreContent = true;

    this.header = this.content[0];
    this.footer = this.content[this.content.length - 1];

    this.content = this.content.slice(1, this.content.length - 2);
  }

  go(e): void {
    this.activeModal.close(this.choice);
  }

  goBackToTerreChoice(e): void {
    this.header = null;
    this.footer = null;

    this.showStart = false;

    this.showTerreContent = false;
    this.showTerreChoice = true;
    this.start();
  }

}
