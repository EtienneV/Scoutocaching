import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { NgbActiveModal, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-image',
  templateUrl: './modal-image.component.html',
  styleUrls: ['./modal-image.component.scss']
})
export class ModalImageComponent implements OnInit {

  @Input() urlPhoto;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    console.log(this.urlPhoto)
  }

  close() {
    this.activeModal.close();
  }

}
