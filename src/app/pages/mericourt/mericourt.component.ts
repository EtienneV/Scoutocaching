import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mericourt',
  templateUrl: './mericourt.component.html',
  styleUrls: ['./mericourt.component.scss']
})
export class MericourtComponent implements OnInit {
  gateways = [
    {
      name: "Mericourt1",
      active : false
    },
    {
      name: "Mericourt2",
      active : false
    },
    {
      name: "Mericourt3",
      active : false
    }
  ];

  constructor() { }

  ngOnInit(): void {
    const that = this;

  }

}
