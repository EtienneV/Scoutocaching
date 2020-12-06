import { Component, OnInit, Input, OnChanges } from '@angular/core';
import {NgbActiveModal, NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-cache',
  templateUrl: './modal-cache.component.html',
  styleUrls: ['./modal-cache.component.scss']
})
export class ModalCacheComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
