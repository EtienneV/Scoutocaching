import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { environment } from '../../../environments/environment';

import * as moment from 'moment';

declare var io: any;
declare var $: any;

@Component({
  selector: 'app-page-site',
  templateUrl: './page-site.component.html',
  styleUrls: ['./page-site.component.scss']
})
export class PageSiteComponent implements OnInit {
  @Input() position;
  @Input() zoom;


  constructor(private router: Router) { }

  ngOnChanges() {
    //console.log(this.gateways)
  }

  ngOnInit(): void {
 
  }

}
