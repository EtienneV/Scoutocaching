import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { BarcodeFormat, Result } from '@zxing/library';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { CookieService } from 'ngx-cookie-service';
import { Track } from 'ngx-audio-player';
@Component({
  selector: 'app-modal-cache',
  templateUrl: './modal-cache.component.html',
  styleUrls: ['./modal-cache.component.scss'],
})
export class ModalCacheComponent implements OnInit {
  @ViewChild('scanner', { static: false })
  scanner = ZXingScannerComponent as any;
  

  /*
  id: 34
  indice: "[{"type":"titre","text":null},{"type":"paragraphe","text":"Dessin arbre + renard sur chemin + scout sur chemin"},{"type":"image","url":null,"trustedUrl":{}},{"type":"video","url":null,"trustedUrl":{}}]"
  name: "Parc de Parilly"
  qrSecret: "secret"
  status: "treasureNotFound"
  story: "null"
  street: "Chemin Du Renard"
  terre: "gones"
  */
  tresorProperties;
  found = false;
  scannerOpen = false;
  userInputOpen=false;
  coordinates;


  // @Input() indice : any;
  indice = [
    {
      type: "titre",
      text: "Titre de l'indice"
    },
    {
      type: "paragraphe",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer consequat tempus ipsum, ac accumsan enim malesuada sed. Integer dictum lectus ex. In elementum mi id magna dignissim vehicula. Praesent sit amet vulputate nulla. Donec arcu sem, aliquet nec ligula a, varius aliquet nunc. Sed vestibulum ipsum quam, in auctor nisl finibus vitae. Quisque a faucibus turpis. Mauris mauris metus, rhoncus in iaculis luctus, rutrum at lectus. Vivamus facilisis et elit nec cursus. Mauris dignissim pretium erat. In eleifend varius commodo. Curabitur et pulvinar elit, sit amet fermentum nunc. Integer cursus elementum urna eget auctor."
    },
    {
      type: "titre",
      text: "Vidéo"
    },
    {
      type: "video",
      url: "https://www.youtube.com/embed/4iQETIfbzvk",
      trustedUrl: {}
    },
    {
      type: "titre",
      text: "Image"
    },
    {
      type: "image",
      url: "https://www.woopets.fr/assets/img/008/141/og-image/perroquet.jpg",
      trustedUrl: {}
    },
    {
      type: "audio",
      url: "https://dl.dropboxusercontent.com/s/9v0psowra7ekhxo/A%20Himitsu%20-%20In%20Love%20%28feat.%20Nori%29.flac?dl=0",
      trustedUrl: {},
      playlist : [{title: 'Audio One Title',
      link : {}
      }]
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

    console.log(this.tresorProperties)
    console.log(this.coordinates)
    //console.log(this.tresorProperties.qrSecret)

    if (this.tresorProperties.status == "treasureFound") {
      this.found = true;
    }



    if (!this.found) {
      this.indice = JSON.parse(this.tresorProperties.indice);
      this.mapsUrl="https://www.google.com/maps/search/?api=1&query="+this.coordinates[1]+", "+this.coordinates[0];//47.5951518,-122.3316393"
    }
    else {
      this.indice = JSON.parse(this.tresorProperties.resultat);
    }

    console.log(this.indice)


    const elementsToBeRemoved = [];

    for (let i = 0; i < this.indice.length; i++) {
      const element = this.indice[i];

      if (element.type == "titre") {

        if (element.text != null) {
          element.text = element.text.replace('\"', '"');
        }
        else {
          elementsToBeRemoved.push(this.indice.indexOf(element))
        }

      }
      if (element.type == "paragraphe") {

        if (element.text != null) {
          element.text = element.text.replace('\"', '"');
        }
        else {
          elementsToBeRemoved.push(this.indice.indexOf(element))
        }

      }
      if (element.type == "video" || element.type == "image" ) {

        if (element.url != null) {
          element.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(element.url)
        } else {
          elementsToBeRemoved.push(this.indice.indexOf(element))
        }

      }
      if (element.type == "audio"){
        if (element.url != null) {
          element.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(element.url)
          element.playlist = [
            {
              title: 'Audio One Title',
              link: element.trustedUrl
            } ]
            console.log(element)
        } else {
          elementsToBeRemoved.push(this.indice.indexOf(element))
        }
      }
    }

    for (var i = elementsToBeRemoved.length - 1; i >= 0; i--) {
      this.indice.splice(elementsToBeRemoved[i], 1);
    }




  }






  /*
  ** QR Code Scanner
  */


  initializeScanner(): void {

    /*this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
      this.hasDevices = true;
      this.availableDevices = devices;

      console.log("camera")

      // selects the devices's back camera by default
      for (const device of devices) {
        if (/back|rear|environment/gi.test(device.label)) {
          // this.scanner.changeDevice(device);
          this.currentDevice = device;
          break;
        }
      }
    });

    this.scanner.camerasNotFound.subscribe(() => this.hasDevices = false);
    this.scanner.permissionResponse.subscribe((perm: boolean) => this.hasPermission = perm);


    this.scanner.scanComplete.subscribe((result: Result) => {
      this.qrResult = result

      console.log(this.qrResult)
    });*/

  }
  
 getMobileOperatingSystem() {
  var userAgent = navigator.userAgent || navigator.vendor; // || window.opera;

      // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return "Windows Phone";
    }

    if (/android/i.test(userAgent)) {
        return "Android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }

    return "unknown";
}
  clearResult(): void {
    this.qrResultString = null;
  }

  onCodeResult(resultString: string) {
    const that = this;

    console.log('Result: ', resultString);

    // this.qrResultString = this.sanitizer.bypassSecurityTrustResourceUrl(resultString);

    // Si c'est le bon qr code, on considère l'indice comme trouvé et on affiche le résultat de la cache
    if (resultString == this.tresorProperties.qrSecret) {

      console.log("Bon QR Code")

      this.found = true;

      that.CookieService.set('scoutocaching_caches_' + this.tresorProperties.terre + "_" + this.tresorProperties.id, "treasureFound");

      this.indice = JSON.parse(this.tresorProperties.resultat);
        
      const elementsToBeRemoved = [];

      for (let i = 0; i < this.indice.length; i++) {
        const element = this.indice[i];

        if (element.type == "titre") {

          if (element.text != null) {
            element.text = element.text.replace('\"', '"');
          }
          else {
            elementsToBeRemoved.push(this.indice.indexOf(element))
          }

        }
        if (element.type == "paragraphe") {

          if (element.text != null) {
            element.text = element.text.replace('\"', '"');
          }
          else {
            elementsToBeRemoved.push(this.indice.indexOf(element))
          }

        }
        if (element.type == "video" || element.type == "image" ) {
          
          if (element.url != null) {
            element.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(element.url)
            console.log(element.trustedUrl)
          } else {
            elementsToBeRemoved.push(this.indice.indexOf(element))
          }

        }
        if (element.type == "audio"){
          if (element.url != null) {
            element.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(element.url)
            element.playlist = [
              {
                title: 'Audio One Title',
                link: element.trustedUrl
              } ]
          } else {
            elementsToBeRemoved.push(this.indice.indexOf(element))
          }
          console.log(element)
        }
      }

      for (var i = elementsToBeRemoved.length - 1; i >= 0; i--) {
        this.indice.splice(elementsToBeRemoved[i], 1);
      }

      // ! Ne pas fermer, mais afficher le résultat de la cache
      //this.activeModal.close(true);
    }
    else { // Sinon, on informe l'utilisateur que le qr code n'a pas été validé pour cette cache
      alert("Ce QR Code ne correspond pas à la cache.");
    }

  }

  onScanError(e) {
    this.qrResultString = "QR Code illisible";

    console.log("onScanError")
    //console.log(e)
  }

  onScanFailure(e) {
    console.log("onScanFailure")
    //console.log(e)
  }

  saisieManuelle(){
    this.scannerOpen=false;
    this.userInputOpen=true;
  }
  checkInput(){    
    const answer = (<HTMLInputElement>document.getElementById("code")).value;
    this.onCodeResult(answer);
  }
  
  startScanner(id) {

    this.scannerOpen = true;
    this.userInputOpen = false;

    //console.log(id)
    //this.id = id; // Id cache

    //this.indice = null;

    this.formatsEnabled = [BarcodeFormat.QR_CODE, BarcodeFormat.EAN_8, BarcodeFormat.AZTEC, BarcodeFormat.CODE_128, BarcodeFormat.EAN_13];
    // this.activeModal.close(this.id);
    // this.thisTreasure.properties.status="treasureFound";

    //this.initializeScanner();
  }






  close() {
    this.activeModal.close(this.found);
  }

  /*
  ** Utilitaires
  */

  youtubeURL(video) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(video);
  }

}
