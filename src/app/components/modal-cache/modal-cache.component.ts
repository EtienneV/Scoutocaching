import { Component, OnInit, Input, OnChanges } from '@angular/core';
import {NgbActiveModal, NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-modal-cache',
  templateUrl: './modal-cache.component.html',
  styleUrls: ['./modal-cache.component.scss']
})
export class ModalCacheComponent implements OnInit {

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
    }
  ]

  constructor(public activeModal: NgbActiveModal, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    for (let i = 0; i < this.indice.length; i++) {
      const element = this.indice[i];

      if(element.type == "video") {
        element.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(element.url)
      }
    }
  }

  youtubeURL(video) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(video);
  }


}
