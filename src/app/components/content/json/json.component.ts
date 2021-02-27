import {Component, OnInit,Inject} from '@angular/core';
import {ItemService} from "@app/services/item.service";
import {Item} from "@content/model/item";
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  template: `
    <app-item></app-item>
    <a href="./../../json/{{newname}}">Before</a>
    <button (click)="gotoItems();">Change</button>  
  `,
  styleUrls: ['./json.component.scss']
})
export class JSONComponent implements OnInit {

  items: Item[];

  itemService: ItemService;

  jsonFileName : string;
  newname: string;
  constructor(@Inject(ItemService) itemService: ItemService, 
  private route: ActivatedRoute,
  public router: Router ) {
  this.itemService = itemService;
  }
  // constructor(private itemService: ItemService, 
  // private route: ActivatedRoute,
  // private router: Router  ) {}

  ngOnInit() {
    const routeParams = this.route.snapshot.paramMap;
    this.jsonFileName = String(routeParams.get('fileName'));
    console.log(this.jsonFileName);
    this.getItems();
  }
  getItems() {
    console.log(this.itemService.fileExists("assets/content/".concat(this.jsonFileName,".json")));
    this.itemService.fileExists("assets/content/".concat(this.jsonFileName,".json")).subscribe(
      res => {
        if(res===true){
          this.itemService.read("assets/content/".concat(this.jsonFileName,".json")).subscribe(items => {this.items = items;});
        }else{
          this.router.navigate(['**']).then(() => {
            window.location.reload();
          });
        }
      }
    );
  } 
  
  gotoItems():void {
    this.newname = '/json/'.concat(this.jsonFileName.substring(0,4).concat((1+parseInt(String(this.jsonFileName.charAt(4)))).toString()));
    console.log(this.newname);
    // Pass along the hero id if available
    // so that the HeroList component can select that item.
    this.router.navigate([this.newname]).then(() => {
      window.location.reload();
    });
  } 
  ngOnDestroy(){
    this.itemService.clear();
  }
}
