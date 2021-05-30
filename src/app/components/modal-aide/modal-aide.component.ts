import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { BarcodeFormat, Result } from '@zxing/library';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-modal-aide',
  templateUrl: './modal-aide.component.html',
  styleUrls: ['./modal-aide.component.scss'],
})
export class ModalAideComponent implements OnInit {
  // @Input() indice : any;
  title="Aide"
  indice = [
    {
      type: "titre",
      text: "À quoi ressemble une cache ?"
    },
    {
      type: "paragraphe",
      text: "Ce sont la plupart du temps de petites boîtes aimantées contenant un QR code :"
    },
    {
      type: "image",
      url: "assets/images/nano_cache_example.jpg",
      trustedUrl: {}
    },
    {
      type: "paragraphe",
      text: "Dans certains cas, la boîte peut prendre une autre forme."
    },
    {
      type: "titre",
      text: "Que puis-je faire si je n’arrive pas à scanner un QR code ?"
    },
    {
      type: "paragraphe",
      text: "Les QR codes sont fragiles et il peut arriver qu'ils s'abîment après un certain nombre de manipulations. <br>Dans ce cas, tu trouveras au dos de chaque QR code une suite de chiffres que tu peux renseigner en appuyant sur le bouton <b>« Saisie Manuelle »</b>"
    },
    {
      type: "titre",
      text: "Dois-je terminer mon Géocaching dans la journée ?"
    },
    {
      type: "paragraphe",
      text: "Non, tu peux continuer ta partie dans plus tard. Ta progression est sauvegardée dans ton navigateur. <br>Tu peux noter les codes de chaque cache découverte pour être sûr de ne pas repartir à zéro."
    },
    {
      type: "titre",
      text: "Puis-je faire les histoires des autres terres ? "
    },
    {
      type: "paragraphe",
      text: "Oui ! Fais-toi kiffer"
    }
  ]

  id = -1;
  story = null;
  story_cachee = null;
  mapsUrl: any;
  //scannerEnabled = false;

  hasDevices: boolean;
  hasPermission: boolean;
  qrResultString: string;
  qrResult: Result;

  information = "";
  formatsEnabled: BarcodeFormat[];
  currentDevice: MediaDeviceInfo = null;
  availableDevices: MediaDeviceInfo[];


  constructor(public activeModal: NgbActiveModal, private sanitizer: DomSanitizer, private CookieService: CookieService) { }

  ngOnInit(): void {
  //   console.log(this.indice)


  //   const elementsToBeRemoved = [];

  //   for (let i = 0; i < this.indice.length; i++) {
  //     const element = this.indice[i];

  //     if (element.type == "titre") {

  //       if (element.text != null) {
  //         element.text = element.text.replace('\"', '"');
  //       }
  //       else {
  //         elementsToBeRemoved.push(this.indice.indexOf(element))
  //       }

  //     }
  //     if (element.type == "paragraphe") {

  //       if (element.text != null) {
  //         element.text = element.text.replace('\"', '"');
  //       }
  //       else {
  //         elementsToBeRemoved.push(this.indice.indexOf(element))
  //       }

  //     }
  //     if (element.type == "video" || element.type == "image") {

  //       if (element.url != null) {
  //         element.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(element.url)
  //       } else {
  //         elementsToBeRemoved.push(this.indice.indexOf(element))
  //       }

  //     }
  //   }

  //   for (var i = elementsToBeRemoved.length - 1; i >= 0; i--) {
  //     this.indice.splice(elementsToBeRemoved[i], 1);
  //   }

  //   console.log(this.indice);

  this.validContent();

  }



  validContent(): void {
    const elementsToBeRemoved = [];
    for (let i = 0; i < this.indice.length; i++) {
      const element = this.indice[i];
      if (element.type == "titre" || element.type == "paragraphe") {
        if (element.text != null) {
          element.text = element.text.replace('\"', '"')
        }
        else {
          elementsToBeRemoved.push(this.indice.indexOf(element))
        }
      }
      if (element.type == "video" || element.type == "image") {
        if (element.url != null) {
          element.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(element.url)
        } else {
          elementsToBeRemoved.push(this.indice.indexOf(element))
        }
      }
    }
    for (var i = elementsToBeRemoved.length - 1; i >= 0; i--) {
      this.indice.splice(elementsToBeRemoved[i], 1);
    }
  }

  loadContent(data):void{
    this.indice=data;
    this.validContent();
  }




  close() {
    this.activeModal.close();
  }

}
