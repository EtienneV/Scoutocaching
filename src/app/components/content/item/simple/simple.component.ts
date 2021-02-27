import {Component} from '@angular/core';
import {DynamicComponent} from "../dynamic/dynamic.component";

@Component({
  selector: 'app-simple',
  template: `
    <div class="item simple"><h3>{{title}}</h3></div>`,
  styleUrls: ['./simple.component.scss']
})
export class SimpleComponent extends DynamicComponent {


}
