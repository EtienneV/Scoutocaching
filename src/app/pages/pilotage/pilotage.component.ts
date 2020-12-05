import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

import * as moment from 'moment';
//import dt from 'datatables.net';

declare var io: any;
declare var $: any;

@Component({
  selector: 'app-pilotage',
  templateUrl: './pilotage.component.html',
  styleUrls: ['./pilotage.component.scss']
})
export class PilotageComponent implements OnInit {

  socket;

  mqtt_messages = [];

  constructor() { }

  ngOnInit(): void {
    const that = this;

    this.socket = io();

    this.socket.on("mqtt_message", message => {
      //console.log(message)

      if(message.mac_gateway == "DC:A6:32:3C:F3:E1"){
        let date = new Date();
        message.date = date.toLocaleString();

        that.mqtt_messages.push(message)
      }
    })



    /*
    setInterval(function() {

      let message = {
        gateway: "DC:A6:32:3C:F3:E1",
        message_type: "",
        node: "nodesConnection",
        topic: "lyracom/DC:A6:32:3C:F3:E1/DC:A6:32:3C:F3:E1/nodesConnection"
      };

      let date = new Date();

      message.date = date;

      that.mqtt_messages.push({
        date: date.toLocaleString(),
        gateway: "DC:A6:32:3C:F3:E1",
        message_type: "",
        node: "nodesConnection",
        topic: "lyracom/DC:A6:32:3C:F3:E1/DC:A6:32:3C:F3:E1/nodesConnection"
      })
    }, 3000);
    */
  }

  maintenance(on) {
    console.log("MaintenanceOn", JSON.stringify({
      mac_gateway: "DC:A6:32:3C:F3:E1",
      gateway: "DC:A6:32:3C:F3:E1",
      node: "N2525508",
      value: on
    }))

    this.socket.emit('maintenance', JSON.stringify({
      mac_gateway: "DC:A6:32:3C:F3:E1",
      gateway: "DC:A6:32:3C:F3:E1",
      node: "N2525508",
      value: on
    }));
  }

  light(on) {
    console.log("LightOn", JSON.stringify({
      mac_gateway: "DC:A6:32:3C:F3:E1",
      gateway: "DC:A6:32:3C:F3:E1",
      node: "N2525508",
      value: on
    }))

    this.socket.emit('light', JSON.stringify({
      mac_gateway: "DC:A6:32:3C:F3:E1",
      gateway: "DC:A6:32:3C:F3:E1",
      node: "N2525508",
      value: on
    }));
  }

}
