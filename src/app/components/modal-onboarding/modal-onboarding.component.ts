import { Component, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
// import lumieres_loader from '@assets/content/lumieres_loader.json';
// import canuts_loader from '@assets/content/canuts_loader.json';
// import gones_loader from '@assets/content/gones_loader.json';
@Component({
  selector: 'app-modal-onboarding',
  templateUrl: './modal-onboarding.component.html',
  styleUrls: ['./modal-onboarding.component.scss'],
})

export class ModalOnBoardingComponent implements OnInit {

  terreChoosed: string;

  private lumieres_loader : any;
  private gones_loader: any;
  private canuts_loader: any;
  alreadyStarted = false;
  showStart = true
  showTerreChoice = false
  showTerreContent = false
  showExplaination = false

  title = "Territoire Lyon levant"

  content = [
    {
      type: "bouton",
      text: "Terre des Gones",
      url: "assets/icons/Composant 7 – 2.png",
      percentage: 1,
      style:"",
      isDisabled:false,
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

  async ngOnInit(): Promise<void> {

    this.content = [{
      type: "image",
      url: "assets/icons/Composant 7 – 2.png",
      trustedUrl: {}
    },
    {
      type: "paragraphe",
      text: "Bienvenue dans ce <b>ScoutoCaching</b> !"
    }];

    this.validContent();
    await import("../../../assets/content/lumieres_loader.json").then(data => {
      this.lumieres_loader = data;
    });
    await import("../../../assets/content/canuts_loader.json").then(data => {
      this.canuts_loader = data;
    });
    await import("../../../assets/content/gones_loader.json").then(data => {
      this.gones_loader = data;
    });
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
  explainMe():void{
    this.showStart = false;
    this.showExplaination = true;
    this.content = [
      {
        "type": "titre",
        "text": "Comment jouer ?"
      },
      {
        type:"paragraphe",
        text:"Le <b>ScoutoCaching</b>, c'est la combinaison d’une chasse au trésor 🗺️, d'un jeu de géocaching 🧭 et d’un Cluedo 🕵️ !"
      },
      {
        type:"paragraphe",
        text:"Une fois ton parcours choisi (il y en a un par Terre), tu verras sur la carte les endroits où chercher des indices pour résoudre l'enquête 🔍"
      },
      {
        type:"paragraphe",
        text:"Un clic sur la position d'un indice te dévoilera l'énigme correspondante. Rends-toi sur place et résouds l'énigme, tu trouveras la cachette contenant le précieux sésame !"
      },
      {
        type:"paragraphe",
        text:"Les cachettes peuvent prendre plusieurs formes, mais ce sont en général de toutes petites boîtes aimantées contenant un QR Code."
      },
      {
        type:"paragraphe",
        text:"En scannant ce QR code, tu obtiendras l'indice te permettant de progresser dans l'enquête"
      },
      {
        type:"paragraphe",
        text:"⚠ Attention à bien prendre soin des QR codes et à bien repositionner les caches pour les suivants 😉"
      },
      {
        type:"paragraphe",
        text:"<b>Bonne chance !!</b>"
      },
      {
        type: "paragraphe",
        text: "Exemple de cache :"
      },
      {
        type: "image",
        url: "assets/images/nano_cache_example.jpg",
        trustedUrl: this.sanitizer.bypassSecurityTrustResourceUrl("assets/images/nano_cache_example.jpg")
      },

    ]



    /*


    Trois parcours (un par Terre de Lyon Levant) te sont proposés.


    */

  }
  start(): void {
    if (this.terreChoosed === "") {

      console.log("Ouvrir choix Terres")

      this.showExplaination = false;
      this.showTerreChoice = true;

      this.title = "Quelle est ta terre ?"

      this.content = [
        {
          type: "bouton",
          text: "Terre des Lumieres",
          url: "assets/icons/Composant 6 – 2.png",
          percentage: this.getPercentage("lumieres"),
          isDisabled:false,
          style:"width:"+this.getPercentage("lumieres")+"%",
          done: this.cookieService.check('scoutocaching_caches_lumieres_done')
        },{
          type: "bouton",
          text: "Terre des Gones",
          url: "assets/icons/Composant 4 – 2.png",
          isDisabled:false,
          percentage: this.getPercentage("gones"),
          style:"width:"+this.getPercentage("gones")+"%",
          done: this.cookieService.check('scoutocaching_caches_gones_done')
        },
        {
          type: "bouton",
          text: "Terre des Canuts",
          url: "assets/icons/Composant 5 – 2.png",
          percentage: this.getPercentage("canuts"),
          isDisabled:false,
          style:"width:"+this.getPercentage("canuts")+"%",
          done: this.cookieService.check('scoutocaching_caches_canuts_done')
        }];
      // {
      //   type: "bouton",
      //   text: "Terre des Lumieres",
      //   url: "assets/icons/Composant 6 – 2.png",
      //   isDisabled:false,
      //   done: this.cookieService.check('scoutocaching_caches_lumieres_done')
      // },{
      //   type: "bouton",
      //   text: "Terre des Gones",
      //   url: "assets/icons/Composant 4 – 2.png",
      //   isDisabled:true,
      //   done: this.cookieService.check('scoutocaching_caches_gones_done')
      // },
      // {
      //   type: "bouton",
      //   text: "Terre des Canuts",
      //   url: "assets/icons/Composant 5 – 2.png",
      //   isDisabled:true,
      //   done: this.cookieService.check('scoutocaching_caches_canuts_done')
      // }];
      this.validContent();

    } else {
      this.activeModal.close(this.terreChoosed);
    }

  }

  selectTerre(e): void {

    console.log(e)

    if (e === "Terre des Gones") {
      this.choice = "gones";
      this.content = this.deepCopy(this.gones_loader.description);
    }
    else if (e === "Terre des Lumieres") {
      this.choice = "lumieres";
      this.content = this.deepCopy(this.lumieres_loader.description);
      // console.log("Lumières");
    }
    else {
      this.choice = "canuts";
      this.content = this.deepCopy(this.canuts_loader.description);
      // const json:any = lumiere_loader;
      // console.log("Canuts");
    }

    this.title = e;
    this.validContent();

    this.showTerreChoice = false;
    this.showTerreContent = true;

    this.header = this.content[0];
    this.footer = this.content[this.content.length - 1];

    this.content = this.content.slice(1, this.content.length - 1);
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


  getPercentage(terre): number {
    var answer=0;
    var id=1;
    if(this.cookieService.check("scoutocaching_caches_"+terre+"_"+id)){
      while(this.cookieService.check("scoutocaching_caches_"+terre+"_"+id)){
        if(this.cookieService.get("scoutocaching_caches_"+terre+"_"+id)==="treasureFound"){
          answer=answer+1;
        }
        id=id+1;
      }
      id=id-1;
      answer=answer*(100/id);
    }
    return answer;
  }

  deepCopy(oldObj: any) {
    var newObj = oldObj;
    if (oldObj && typeof oldObj === "object") {
      if (oldObj instanceof Date) {
        return new Date(oldObj.getTime());
      }
      newObj = Object.prototype.toString.call(oldObj) === "[object Array]" ? [] : {};
      for (var i in oldObj) {
        newObj[i] = this.deepCopy(oldObj[i]);
      }
    }
    return newObj;
  }

}
