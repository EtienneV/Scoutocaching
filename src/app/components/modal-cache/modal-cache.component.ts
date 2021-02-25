import { Component, OnInit, Output, ViewChild } from '@angular/core';
import {NgbActiveModal, NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {DomSanitizer} from '@angular/platform-browser';
import { BarcodeFormat, Result } from '@zxing/library';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
@Component({
  selector: 'app-modal-cache',
  templateUrl: './modal-cache.component.html',
  styleUrls: ['./modal-cache.component.scss'],
})
export class ModalCacheComponent implements OnInit {
  
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
      url: "https://www.youtube.com/embed/1Rk1K5Mmnbg",
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
    }
  ]
  id=-1;
  title="";
  story=null;
  coord={lat:0.00000, lng:0.00000};
  found=false;
  scannerEnabled=false;

  
  @ViewChild('scanner', { static: false })
  scanner: ZXingScannerComponent;

  hasDevices: boolean;
  hasPermission: boolean;
  qrResultString: string;
  qrResult: Result;

  information="";
  formatsEnabled: BarcodeFormat = BarcodeFormat.QR_CODE;
  currentDevice: MediaDeviceInfo = null;
  availableDevices: MediaDeviceInfo[];
  

  constructor(public activeModal: NgbActiveModal, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    if(this.found==false){
      const elementsToBeRemoved=[];
      for (let i = 0; i < this.indice.length; i++) {
        const element = this.indice[i];
        if (element.type == "titre" || element.type=="paragraphe" ){
          if (element.text!=null){
                  element.text=element.text.replace('\"','"')
          }
          else{
                elementsToBeRemoved.push(this.indice.indexOf(element))
          }
        }
        if(element.type == "video" || element.type == "image") {
          if(element.url!=null){
          element.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(element.url)
          }else{
                elementsToBeRemoved.push(this.indice.indexOf(element))
          }
        }
      }
      for (var i = elementsToBeRemoved.length-1; i>=0 ; i--) {
          this.indice.splice(elementsToBeRemoved[i],1);
      }
    }
    else if(this.story!=""){
      console.log(this.story);
    // else if(this.found===true && this.qrcodeScanned=true){

    }
    this.initializeScanner();
  }
  youtubeURL(video) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(video);
  }
  initializeScanner(): void{
    this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
    this.hasDevices = true;
    this.availableDevices = devices;

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
    this.scanner.scanComplete.subscribe((result: Result) => this.qrResult = result);
    this.scanner.permissionResponse.subscribe((perm: boolean) => this.hasPermission = perm);
  }
  clearResult(): void {
    this.qrResultString = null;
  }

  onCodeResult(resultString: string) {
    console.debug('Result: ', resultString);
    // this.qrResultString = this.sanitizer.bypassSecurityTrustResourceUrl(resultString);
    this.found=true;
    this.activeModal.close(0);
  }
  onScanError(e){
    this.qrResultString = "QR Code illisible";
  }
  
  onClickMe(id){
    this.id=id;
    this.indice=null;
    this.coord={lat:0.00000, lng:0.00000};
    this.formatsEnabled = BarcodeFormat.QR_CODE;
    // this.activeModal.close(this.id);
    // this.thisTreasure.properties.status="treasureFound";
  }


}
