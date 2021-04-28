import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
// import lumieres_loader from '@assets/content/lumieres_loader.json';
// import canuts_loader from '@assets/content/canuts_loader.json';
// import gones_loader from '@assets/content/gones_loader.json';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-modal-changeTerre',
  templateUrl: './modal-changeTerre.component.html',
  styleUrls: ['./modal-changeTerre.component.scss'],
})
export class ModalChangeTerreComponent implements OnInit {

  lumieres_loader;
  gones_loader;
  canuts_loader;
  showStart = false
  showTerreContent = false
  showTerreChoice = true
  header: any;
  footer: any;
  title = "Territoire Lyon levant"
  choice: string;
  content = [
    {
      type: "bouton",
      text: "Terre des Gones",
      url: "assets/icons/Composant 7 – 2.png",
      percentage: 1,
      style:"",
      isDisabled:true,
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

  constructor(public activeModal: NgbActiveModal, private sanitizer: DomSanitizer, private cookieService: CookieService) {
    // this.gones_loader= gones_loader;
    // this.lumieres_loader =lumieres_loader;
    // this.canuts_loader=canuts_loader;
   }

  async ngOnInit(): Promise<void> {
  // ngOnInit(){
    this.start();
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
    console.log(this.content)
    const elementsToBeRemoved = [];
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
    for (var i = elementsToBeRemoved.length - 1; i >= 0; i--) {
      this.content.splice(elementsToBeRemoved[i], 1);
    }
    console.log(this.content)
  }
  start(): void {
    this.header = null;
    this.footer = null;
    this.showStart = false;
    this.showTerreChoice = true;
    this.showTerreContent=false;
    this.title = "Changer de Terre"
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
    }]
    this.validContent();
  }

  selectTerre(e): void {
    if (e === "Terre des Gones") {
      this.choice = "gones";
      this.content = this.deepCopy(this.gones_loader.description);
      // this.content = this.deepCopy(this.gones_loader.description);
    }
    else if (e === "Terre des Lumieres") {
      this.choice = "lumieres";
      this.content = this.deepCopy(this.lumieres_loader.description);
      // this.content = this.deepCopy(this.lumieres_loader.description);
      // console.log("Lumières");
    }
    else {
      this.choice = "canuts";
      this.content = this.deepCopy(this.canuts_loader.description);
      // this.content = this.deepCopy(this.canuts_loader.description);
      // const json:any = lumiere_loader;
      // console.log("Canuts");
    }
    this.title = e;
    this.validContent();
    this.showTerreChoice = false;
    this.showStart = false;
    this.showTerreContent = true;
    this.header = this.content.splice(0, 1)[0];
    this.footer = this.content.pop();
    console.log(this.header);
    console.log(this.content);
    console.log(this.footer);
  }
  go(e): void {
    this.cookieService.set("scoutocaching_terre", this.choice);
    this.activeModal.close(this.choice);
  }
  goBackToTerreChoice(e): void {
    this.header = null;
    this.footer = null;
    this.showTerreContent = false;
    this.showStart = false;
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
