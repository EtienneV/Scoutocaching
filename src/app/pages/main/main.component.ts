import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MericourtComponent implements OnInit {
  userPosition='[0, 0]';
  constructor() {}

  ngOnInit(): void {  
    
  }

}
