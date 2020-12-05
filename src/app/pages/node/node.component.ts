import { Component, OnInit, OnChanges } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { environment } from '../../../environments/environment';

import * as moment from 'moment';

declare var io: any;
declare var $: any;

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent implements OnInit, OnChanges {

  gateway;
  node;
  mac_gateway;
  nom;

  socket;

  mqtt_messages = [];

  constructor(private route: ActivatedRoute) {
    route.params.subscribe(params => {
      this.init ();
    });
  }

  ngOnInit(): void {
    const that = this;

    this.socket = io();

    this.socket.on("mqtt_message", message => {
      console.log(message)

      if(message.mac_gateway == this.mac_gateway){
        let date = new Date();
        message.date = date.toLocaleString();

        that.mqtt_messages.push(message)
      }
    })
  }

  ngOnChanges() {

  }

  init() {
    this.mac_gateway = decodeURI(this.route.snapshot.params['mac_gateway'])
    this.gateway = decodeURI(this.route.snapshot.params['gateway'])
    this.node = decodeURI(this.route.snapshot.params['node'])
    this.nom = decodeURI(this.route.snapshot.params['name'])

    console.log(this.mac_gateway)
    console.log(this.gateway)
    console.log(this.node)

  }

  maintenance(on) {
    console.log("MaintenanceOn", JSON.stringify({
      mac_gateway: this.mac_gateway,
      gateway: this.gateway,
      node: this.node,
      value: on
    }))

    this.socket.emit('maintenance', JSON.stringify({
      mac_gateway: this.mac_gateway,
      gateway: this.gateway,
      node: this.node,
      value: on
    }));
  }

  light(on) {
    console.log("LightOn", JSON.stringify({
      mac_gateway: this.mac_gateway,
      gateway: this.gateway,
      node: this.node,
      value: on
    }))

    this.socket.emit('light', JSON.stringify({
      mac_gateway: this.mac_gateway,
      gateway: this.gateway,
      node: this.node,
      value: on
    }));
  }

}


