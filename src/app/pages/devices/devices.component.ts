import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

declare var $: any;
declare var io: any;

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit {

  devices = [
    {
      name: "Device 1",
      mac: 'FF:FF:FF:FF:FF:FF',
      last_message: "03/11/2020 11:35:15",
      state: true
    },
    {
      name: "Device 2",
      mac: 'FF:FF:FF:FF:FF:FF',
      last_message: "03/11/2020 11:35:15",
      state: false
    },
    {
      name: "Device 3",
      mac: 'FF:FF:FF:FF:FF:FF',
      last_message: "03/11/2020 11:35:15",
      state: false
    },
    {
      name: "Device 4",
      mac: 'FF:FF:FF:FF:FF:FF',
      last_message: "03/11/2020 11:35:15",
      state: true
    }
  ]

  socket;

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    console.log("onInit")

    this.socket = io();
  }

  switchDevice(index, state) {
    console.log("Switch device " + index + " : " + state)
  }

  maintenance(on) {
    console.log("MaintenanceOn", on)

    this.socket.emit('maintenance', on);

    /*
    this.api_maintenanceOn(on).then(resp => {
      console.log(resp)
    }, err => {
      console.log(err)
    })*/
  }

  light(on) {
    console.log("LightOn", on)

    this.socket.emit('light', on);

    /*
    this.api_lightOn(on).then(resp => {
      console.log(resp)
    }, err => {
      console.log(err)
    })*/
  }



  /*
  ** HTTP
  */

  API_ENDPOINT = "https://api-sandbox.everyware-cloud.com/v2/";

  post(target, body) {
    return new Promise((resolve, reject) => {
      const httpOptions = {
        headers: new HttpHeaders({
          "Authorization": "Basic d2l0dGlfYXBpOmx5cmFjb21DIW91ZDE=",
          "Content-Type": "application/xml"
        })
      };

      this.httpClient
        .post(target, body, httpOptions)
        .subscribe(ret => resolve(ret), error => reject(error));
    });
  }

  api_maintenanceOn(on) {

    let value = 0;
    if(on) value = 1;

    const date = new Date();
    let timestamp = date.toISOString();

    let body = '<message xmlns=\"http://eurotech.com/edc/2.0\">\r\n  ' +
    '<topic>$EDC/lyracom/DC:A6:32:3C:F3:E1/DC:A6:32:3C:F3:E1/pilote/maintenance/N2525508</topic>\r\n  ' +
    '<payload>\r\n    <sentOn>' + timestamp + '</sentOn>\r\n    ' +
    '<metrics>\r\n      <metric>\r\n        <name>onoff</name>\r\n        <type>int</type>\r\n        <value>' + value + '</value>\r\n      </metric>\r\n    ' +
    '</metrics>\r\n  </payload>\r\n</message>';

    return this.post(this.API_ENDPOINT + 'messages/publish', body);
  }

  api_lightOn(on) {

    let value = 0;
    if(on) value = 100;

    const date = new Date();
    let timestamp = date.toISOString();

    let body = '<message xmlns=\"http://eurotech.com/edc/2.0\">\r\n  ' +
    '<topic>$EDC/lyracom/DC:A6:32:3C:F3:E1/DC:A6:32:3C:F3:E1/pilote/maintenance/N2525508</topic>\r\n  ' +
    '<payload>\r\n    <sentOn>' + timestamp + '</sentOn>\r\n    ' +
    '<metrics>\r\n      ' +
    '<metric>\r\n        <name>name</name>\r\n        <type>string</type>\r\n        <value>level</value>\r\n      </metric>\r\n      ' +
    '<metric>\r\n        <name>value</name>\r\n        <type>int</type>\r\n        <value>' + value + '</value>\r\n      </metric>\r\n' +
    '</metrics>\r\n  </payload>\r\n</message>';

    return this.post(this.API_ENDPOINT + 'messages/publish', body);
  }

}
