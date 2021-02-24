import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { LocationService } from 'src/app/services/location.service';
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


  constructor(private router: Router, private locationService : LocationService) { }

  ngOnChanges() {
    //console.log(this.gateways)
  }

  ngOnInit(): void { 
    const that = this;
    that.locationService.getPosition().then(pos => {that.position=[pos.lng, pos.lat].toString(); console.log(pos); console.log(that.position);});
 
  }

}
