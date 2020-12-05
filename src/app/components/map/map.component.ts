import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';

declare var $: any;
declare var Papa: any;
declare var MapboxDraw: any;
declare var turf: any;
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @Input() nodesFile;
  @Input() tabNodes;
  @Input() tabGateways;
  @Input() position;
  @Input() zoom;

  map;
  mapLoaded = false;

  csvRecords: any[] = [];
  header = false;

  groupes = [];

  lightsGeoJson = {
    "type": "FeatureCollection",
    "features": []
  };

  gatewaysGeoJson = {
    "type": "FeatureCollection",
    "features": []
  };

  sensorsGeoJson = {
    "type": "FeatureCollection",
    "features": []
  };

  selectedLights = [];

  constructor(private httpClient: HttpClient, private router: Router) {
    const that = this;

    mapboxgl.accessToken = 'pk.eyJ1IjoiY2hpcHNvbmR1bGVlIiwiYSI6ImQzM2UzYmQxZTFjNjczZWMyY2VlMzQ5NmM2MzEzYWRmIn0.0iPy8Qyw2FjGSxawGZxW8A';

  }

  ngOnInit(): void {
    const that = this;

    console.log(this.tabNodes)
    console.log(this.tabGateways)
    console.log(this.nodesFile)

    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/chipsondulee/ckibkn4zp08z01apbrodswj9g', //43.244442, 5.398040
      center: JSON.parse(that.position), // starting position [lng, lat]
      zoom: that.zoom, // starting zoom
    });

    Papa.parse("assets/" + that.nodesFile, {
      download: true,
      dynamicTyping: true,
      header: true,
      complete: function (results) {


        /* results.data.map(function(item) {
           console.log(item["coords.coordinates"])
           item["coords.coordinates"] = JSON.parse(item["coords.coordinates"])

           return item;
         })*/

        console.log(results);

        that.groupes = results.data;

        for (let i = 0; i < results.data.length; i++) {
          const element = results.data[i];
          let coord = element["coords"]; // ! COORD

          coord = coord.split(' ');
          coord = [parseFloat(coord[1]), parseFloat(coord[0])];

          if (coord !== undefined) {

            that.reverseGeoCoding(coord[1], coord[0]).then((resp: any) => {
              //console.log(resp)

              let streetName = '';

              for (let i = 0; i < resp.features.length; i++) {
                const element = resp.features[i];

                if (element.place_type[0] === 'address') {
                  //console.log('Rue : ' + element.text)

                  streetName = element.text;
                }
              }

              if (element["type"] == "GenericSensor") { // ! TYPE
                that.sensorsGeoJson.features.push({
                  "type": "Feature",
                  "geometry": {
                    "type": "Point",
                    "coordinates": coord
                  },
                  "properties": {
                    "name": element["name"],
                    "id": element["id"],
                    street: streetName
                  }
                })
              }
              else if (element["type"] == "Groupe") {
                that.gatewaysGeoJson.features.push({
                  "type": "Feature",
                  "geometry": {
                    "type": "Point",
                    "coordinates": coord
                  },
                  "properties": {
                    "name": element["name"],
                    "id": element["id"],
                    "icon": element["icon"],
                    street: streetName
                  }
                })
              }
              else if (element["type"] == "Cache") {
                that.lightsGeoJson.features.push({
                  "type": "Feature",
                  "geometry": {
                    "type": "Point",
                    "coordinates": coord
                  },
                  "properties": {
                    "name": element["name"], // ! NAME
                    "id": element["id"], // ! ID
                    street: streetName,
                  }
                })
              }

            });
          }

        }

        console.log(that.lightsGeoJson)

        that.loadMap();

      }
    });
  }

  ngOnChanges() {
    //console.log(this.tabNodes)
    //console.log(this.tabGateways)

    this.updateActiveNodes();
  }

  loadMap() {
    const that = this;

    this.map.on('load', function () {

      that.loadMapIcons().then(() => {
        that.loadMapFoulards().then(() => {
          // Sources
          that.map.addSource('lights', {
            type: 'geojson',
            data: that.lightsGeoJson
          });

          that.map.addSource('gateways', {
            type: 'geojson',
            data: that.gatewaysGeoJson
          });

          that.map.addSource('sensors', {
            type: 'geojson',
            data: that.sensorsGeoJson
          });

          let labelsGeoJson = { ...that.lightsGeoJson };
          labelsGeoJson.features = labelsGeoJson.features.concat(that.gatewaysGeoJson.features);
          labelsGeoJson.features = labelsGeoJson.features.concat(that.sensorsGeoJson.features);

          console.log(labelsGeoJson)

          that.map.addSource('labels', {
            type: 'geojson',
            data: labelsGeoJson
          });

          // Layers
          that.map.addLayer({
            'id': 'labels',
            'type': 'symbol',
            'source': 'labels',
            'layout': {
              'text-allow-overlap': false,
              'text-ignore-placement': false,
              'text-field': ['get', 'name'],
              'text-font': ["Open Sans Regular", "Arial Unicode MS Regular"],
              'text-offset': [1.3, 0],
              'text-anchor': 'left',
              'text-size': 13
            }
          });

          that.map.addLayer({
            'id': 'sensors',
            'type': 'symbol',
            'source': 'sensors',
            'layout': {
              'icon-image': 'sensor',
              'icon-size': 0.5,
              'icon-allow-overlap': true,
              'icon-ignore-placement': true,
              'text-allow-overlap': false,
              'text-ignore-placement': false,
              'icon-anchor': 'center',
              // get the title name from the source's "title" property
            },
            "filter": ["!in", "id", ""]
          });

          that.map.addLayer({
            'id': 'gateways-inactive',
            'type': 'symbol',
            'source': 'gateways',
            'layout': {
              'icon-image': ['get', 'icon'],
              'icon-size': 0.5,
              'icon-allow-overlap': true,
              'icon-ignore-placement': true,
              'icon-anchor': 'center',
            },
            "filter": ["!in", "id", ""]
          });

          that.map.addLayer({
            'id': 'gateways-active',
            'type': 'symbol',
            'source': 'gateways',
            'layout': {
              'icon-image': 'gateway-green',
              'icon-size': 0.5,
              'icon-allow-overlap': true,
              'icon-ignore-placement': true,
              'icon-anchor': 'center',
            },
            "filter": ["in", "id", ""]
          });

          that.map.addLayer({
            'id': 'tresors',
            'type': 'symbol',
            'source': 'lights',

            'layout': {
              'icon-padding': 0,
              'icon-image': 'treasure',
              'icon-size': 0.5,
              'icon-allow-overlap': true,
              'icon-ignore-placement': true,
              'icon-anchor': 'center',
            },
            "filter": ["!in", "id", ""]
          });

          that.map.addLayer({
            'id': 'light-points-selected',
            'type': 'symbol',
            'source': 'lights',

            'layout': {
              'icon-padding': 0,
              'icon-image': 'light-green',
              'icon-size': 0.5,
              'icon-allow-overlap': true,
              'icon-ignore-placement': true,
              'icon-anchor': 'center',
            },
            "filter": ["in", "id", ""]
          });

          /*
          // When a click event occurs on a feature in the tresors layer, open a popup at the
          // location of the feature, with description HTML from its properties.
          that.map.on('click', 'tresors', function (e) {
            that.clickOnLight(e);
          });
  
          // Change the cursor to a pointer when the mouse is over the tresors layer.
          that.map.on('mouseenter', 'tresors', function () {
            that.map.getCanvas().style.cursor = 'pointer';
          });
  
          // Change it back to a pointer when it leaves.
          that.map.on('mouseleave', 'tresors', function () {
            that.map.getCanvas().style.cursor = '';
          });
          */


          that.map.on('click', 'light-points-selected', function (e) {
            that.clickOnLight(e);
          });

          // Change the cursor to a pointer when the mouse is over the light-points-selected layer.
          that.map.on('mouseenter', 'light-points-selected', function () {
            that.map.getCanvas().style.cursor = 'pointer';
          });

          // Change it back to a pointer when it leaves.
          that.map.on('mouseleave', 'light-points-selected', function () {
            that.map.getCanvas().style.cursor = '';
          });

          /*
          that.map.on("wheel", event => {
            if (event.originalEvent.ctrlKey) {
                return;
            }
  
            if (event.originalEvent.metaKey) {
                return;
            }
  
            if (event.originalEvent.altKey) {
                return;
            }
  
            event.preventDefault();
        });
        */

          that.mapLoaded = true;
          that.updateActiveNodes();
        })

      });
    });
  }


  clickOnLight(e) {
    const that = this;

    var coordinates = e.features[0].geometry.coordinates.slice();
    var id = e.features[0].properties.id;

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    /*
    * "name": element["name"],
                    "id": element["configuration.wittiNodeName"],
                  *  street: streetName,
                  *  mac_gateway: element.mac_gateway,
                  *  gateway: element.gateway,
                  *  node: element.node,
                  *  last_message: element.date,
                  *  group: element["core.groupPath"]
    */

    console.log(e.features[0]) //id, name, street

    let node = e.features[0].properties;

    let html = "<b>Nom : </b>" + node.name + "<br>";
    html += "<b>Groupe : </b>" + node.group + "<br>";
    html += "<b>Rue : </b>" + node.street + "<br>";
    html += "<b>Gateway : </b>" + node.gateway + " (" + node.mac_gateway + ")<br>";
    html += "<b>MAC : </b>" + node.node + "<br>";
    html += "<b>Dernière activité : </b>" + node.last_message + "<br>";
    html += '<button id="pilot-light-' + node.node + '">Piloter le luminaire</button>'

    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(html)
      .addTo(that.map);

    document.getElementById('pilot-light-' + node.node).addEventListener('click', function (e) {
      //let coord = JSON.parse(decodeURI($(e.target).attr('coord')));

      //console.log(node.node)

      that.router.navigate(["node/" + encodeURI(node.mac_gateway) + "/" + encodeURI(node.gateway) + "/" + encodeURI(node.node) + "/" + encodeURI(node.name)]);
    });
  }



  selectLightPoints(lightsTab) {
    let filter = ['in', 'id'];
    filter = filter.concat(lightsTab)

    let filter2 = ['!in', 'id'];
    filter2 = filter2.concat(lightsTab)

    this.map.setFilter("light-points-selected", filter);
    this.map.setFilter("tresors", filter2);

    // Extraction of unique lights
    this.selectedLights = [...new Set(lightsTab)]

    console.log(this.selectedLights)
    //alert(JSON.stringify(this.selectedLights))
  }



  /*
  ** UPDATE NODES STATUS
  */

  updateActiveNodes() {
    if (this.mapLoaded) {
      this.updateGateways();
      this.updateLights();
    }
  }

  updateGateways() {
    let activeGateways = [];

    // Pour chaque Gateway affichée
    for (const gateway of this.gatewaysGeoJson.features) {
      // Recherche dans le tableau des gw mis à jour
      let gw_e = this.tabGateways.find(elt => {
        if (elt.name == gateway.properties.name) {
          return true;
        }
        else return false;
      })

      if (gw_e !== undefined) {
        // Si la gw est active
        if (gw_e.active) {
          console.log(gw_e.name)

          activeGateways.push(gw_e.name)
        }
      }
    }

    let filter = ['in', 'name'];
    filter = filter.concat(activeGateways)

    let filter2 = ['!in', 'name'];
    filter2 = filter2.concat(activeGateways)

    this.map.setFilter("gateways-active", filter);
    this.map.setFilter("gateways-inactive", filter2);

  }

  updateLights() {
    const that = this;

    let activeLights = [];

    // Pour chaque Luminaire affichée
    for (let i = 0; i < this.lightsGeoJson.features.length; i++) {
      let light = this.lightsGeoJson.features[i];

      //console.log(this.tabNodes)

      // Recherche dans le tableau des gw mis à jour
      let light_e = this.tabNodes.find(elt => {
        if (elt.node == light.properties.id) {
          return true;
        }
        else return false;
      })

      if (light_e !== undefined) {
        //console.log(light_e)

        // Si la gw est active
        if (light_e.active) {
          //console.log(light_e.node)

          //console.log(light_e.gateway)

          light.properties.gateway = light_e.gateway;
          light.properties.mac_gateway = light_e.mac_gateway;
          light.properties.node = light_e.node;
          light.properties.last_message = light_e.date;

          activeLights.push(light_e.node)
        }
      }


    }

    console.log(this.lightsGeoJson)

    this.map.getSource('lights').setData(this.lightsGeoJson);

    let filter = ['in', 'id'];
    filter = filter.concat(activeLights)

    let filter2 = ['!in', 'id'];
    filter2 = filter2.concat(activeLights)

    this.map.setFilter("light-points-selected", filter);
    this.map.setFilter("tresors", filter2);

  }


  loadMapIcon(file, name) {
    const that = this;
    return new Promise((resolve, reject) => {
      that.map.loadImage(
        "assets/icons/" + file,
        (error, image) => {
          if (error) reject(error);
          if (!that.map.hasImage(name)) {
            that.map.addImage(name, image);
          }
          resolve();
        }
      )
    })
  }

  loadMapIcons() {
    const that = this;
    return new Promise((resolve, reject) => {
      that.loadMapIcon("light.png", "lightbulb").then(() => {
        that.loadMapIcon("light-selected.png", "light-green").then(() => {
          that.loadMapIcon("light-red.png", "light-red").then(() => {
            that.loadMapIcon("treasure.png", "treasure").then(() => {
              resolve();
            })
          })
        })
      })
    })
  }


  loadFoulard(file, name) {
    const that = this;
    return new Promise((resolve, reject) => {
      that.map.loadImage(
        "assets/foulards/" + file,
        (error, image) => {
          if (error) reject(error);
          if (!that.map.hasImage(name)) {
            that.map.addImage(name, image);
          }
          resolve();
        }
      )
    })
  }

  loadMapFoulards() {
    const that = this;

    return new Promise(async (resolve, reject) => {

      for (const groupe of this.groupes) {
        if (groupe["type"] == "Groupe") {
          await that.loadFoulard(groupe["icon"] + ".png", groupe["icon"])
        }
      }

      resolve();
    });
  }










  /*
  ** APIs
  */

  get(target) {
    return new Promise((resolve, reject) => {
      this.httpClient
        .get<any[]>(target)
        .subscribe(ret => resolve(ret), error => reject(error));
    });
  }

  geoCoding(requete) {
    return this.get('https://api.mapbox.com/geocoding/v5/mapbox.places/' + requete + '.json?access_token=pk.eyJ1IjoibWF0dGZpY2tlIiwiYSI6ImNqNnM2YmFoNzAwcTMzM214NTB1NHdwbnoifQ.Or19S7KmYPHW8YjRz82v6g&cachebuster=1551446394528&autocomplete=false&country=fr');
  }

  reverseGeoCoding(lat, long) {
    return this.get('https://api.mapbox.com/geocoding/v5/mapbox.places/' + long + ',' + lat + '.json?access_token=pk.eyJ1IjoibWF0dGZpY2tlIiwiYSI6ImNqNnM2YmFoNzAwcTMzM214NTB1NHdwbnoifQ.Or19S7KmYPHW8YjRz82v6g&cachebuster=1551446394528&autocomplete=false&country=fr');
  }

}
