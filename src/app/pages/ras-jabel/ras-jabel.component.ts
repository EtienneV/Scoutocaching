import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ras-jabel',
  templateUrl: './ras-jabel.component.html',
  styleUrls: ['./ras-jabel.component.scss']
})
export class RasJabelComponent implements OnInit {
  gateways = [
    {
      name: "RAS_JEBEL2",
      active : false
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
