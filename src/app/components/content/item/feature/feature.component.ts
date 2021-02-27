import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-feature',
  template: `
    <div class="item feature"><h3>{{title}}</h3></div>`,
  styleUrls: ['./feature.component.scss']
})
export class FeatureComponent  {
  title: any;
}
