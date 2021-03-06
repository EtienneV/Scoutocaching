import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import lumieres_loader from '@assets/content/lumieres_loader.json';
import canuts_loader from '@assets/content/canuts_loader.json';
import gones_loader from '@assets/content/gones_loader.json';
import { BarcodeFormat } from '@zxing/library';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-modal-changeTerre',
  templateUrl: './modal-changeTerre.component.html',
  styleUrls: ['./modal-changeTerre.component.scss'],
})
export class ModalChangeTerreComponent implements OnInit {

  showStart = true
  showTerreContent = false
  showTerreChoice = false
  header: any;
  footer: any;
  title = "Territoire Lyon levant"
  choice: string;
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
      url: "assets/icons/Composant 7 – 2.png",
      percentage: 1,
      style:"",
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

  constructor(public activeModal: NgbActiveModal, private sanitizer: DomSanitizer, private cookieService: CookieService) { }

  ngOnInit(): void {
    this.start();
  }

  validContent(): void {
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
  }
  start(): void {
    this.showStart = false;
    this.showTerreChoice = true;
    this.title = "Changer de Terre"
    this.content = [{
      type: "bouton",
      text: "Terre des Gones",
      url: "assets/icons/Composant 4 – 2.png",
      percentage: this.getPercentage("gones"),
      style:"width:"+this.getPercentage("gones")+"%",
      done: this.cookieService.check('scoutocaching_caches_gones_done')
    },
    {
      type: "bouton",
      text: "Terre des Canuts",
      url: "assets/icons/Composant 5 – 2.png",
      percentage: this.getPercentage("canuts"),
      style:"width:"+this.getPercentage("canuts")+"%",
      done: this.cookieService.check('scoutocaching_caches_canuts_done')
    },
    {
      type: "bouton",
      text: "Terre des Lumieres",
      url: "assets/icons/Composant 6 – 2.png",
      percentage: this.getPercentage("lumieres"),
      style:"width:"+this.getPercentage("lumieres")+"%",
      done: this.cookieService.check('scoutocaching_caches_lumieres_done')
    }]
    this.validContent();
  }

  selectTerre(e): void {
    if (e === "Terre des Gones") {
      this.choice = "gones";
      this.content = this.deepCopy(gones_loader.description);
    }
    else if (e === "Terre des Lumieres") {
      this.choice = "lumieres";
      this.content = this.deepCopy(lumieres_loader.description);
      // console.log("Lumières");
    }
    else {
      this.choice = "canuts";
      this.content = this.deepCopy(canuts_loader.description);
      // const json:any = lumiere_loader;
      // console.log("Canuts");
    }
    this.title = e;
    this.validContent();
    this.showTerreChoice = false;
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
