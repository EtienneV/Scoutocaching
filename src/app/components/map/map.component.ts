import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { ModalCacheComponent } from '../modal-cache/modal-cache.component';

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
  @Input() position;
  @Input() zoom;

  map;
  mapLoaded = false;

  csvRecords: any[] = [];
  header = false;

  groupes = [];

  tresorsGeoJson = {
    "type": "FeatureCollection",
    "features": []
  };

  groupesGeoJson = {
    "type": "FeatureCollection",
    "features": []
  };


  selectedLights = [];

  constructor(private httpClient: HttpClient, private router: Router, private modalService: NgbModal) {
    const that = this;

    mapboxgl.accessToken = 'pk.eyJ1IjoiY2hpcHNvbmR1bGVlIiwiYSI6ImQzM2UzYmQxZTFjNjczZWMyY2VlMzQ5NmM2MzEzYWRmIn0.0iPy8Qyw2FjGSxawGZxW8A';

  }

  ngOnInit(): void {
    const that = this;

    this.initLocalStorage();

    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/chipsondulee/ckibkn4zp08z01apbrodswj9g', //43.244442, 5.398040
      center: JSON.parse(that.position), // starting position [lng, lat]
      zoom: that.zoom, // starting zoom
    });

    Papa.parse("assets/objets_carte.csv", {
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
          let coord = element["coords"]; // ? COORD

          if (coord !== undefined) {

            coord = coord.split(' ');
            coord = [parseFloat(coord[1]), parseFloat(coord[0])];

            that.reverseGeoCoding(coord[1], coord[0]).then((resp: any) => {

              let streetName = '';

              for (let i = 0; i < resp.features.length; i++) {
                const element = resp.features[i];

                if (element.place_type[0] === 'address') {
                  streetName = element.text;
                }
              }

              if (element["type"] == "Groupe") {
                that.groupesGeoJson.features.push({
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
                that.tresorsGeoJson.features.push({
                  "type": "Feature",
                  "geometry": {
                    "type": "Point",
                    "coordinates": coord
                  },
                  "properties": {
                    "name": element["name"], // ! NAME
                    "id": element["id"], // ! ID
                    street: streetName,
                    indice: element["indice"]
                  }
                })
              }

            });
          }

        }

        console.log(that.tresorsGeoJson)

        that.loadMap();

      }
    });
  }

  ngOnChanges() {
  }





  initLocalStorage() {

    /*
    parcours_selectionne = 'canuts'

    parcours = [
      {
        id: 'canuts',
        tresors: [
          {
            id: 0,
            solved: false
          },
          ...
        ]
      },
      ...
    ]
    */


    let localVariable;

    if (localStorage.length > 0) { // Si la bdd local storage a été initialisée

      // Récupération des variables
      localVariable = localStorage.getItem("local_variable");

      // Si la variable n'est pas définie
      if (localVariable === null) {
        localStorage.setItem("local_variable", "hello");
      }
    } else {
      localStorage.setItem("local_variable", "hello");
    }
  }








  loadMap() {
    const that = this;

    this.map.on('load', function () {

      that.loadMapIcons().then(() => {
        that.loadMapFoulards().then(() => {
          // Sources
          that.map.addSource('tresors', {
            type: 'geojson',
            data: that.tresorsGeoJson
          });

          that.map.addSource('groupes', {
            type: 'geojson',
            data: that.groupesGeoJson
          });

          // Labels
          let labelsGeoJson = { ...that.tresorsGeoJson };
          labelsGeoJson.features = labelsGeoJson.features.concat(that.groupesGeoJson.features);

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
            'id': 'groupes',
            'type': 'symbol',
            'source': 'groupes',
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
            'id': 'tresors',
            'type': 'symbol',
            'source': 'tresors',

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


          // When a click event occurs on a feature in the tresors layer, open a popup at the
          // location of the feature, with description HTML from its properties.
          that.map.on('click', 'tresors', function (e) {
            //that.clickOnTresor(e);


            const modalRef = that.modalService.open(ModalCacheComponent, { size: 'lg' });
            //modalRef.componentInstance.idRapport = idRapport;
            modalRef.result.then((result) => {
              //this.init()
            }, (reason) => {
              //console.log(reason);
            });



          });

          // Change the cursor to a pointer when the mouse is over the tresors layer.
          that.map.on('mouseenter', 'tresors', function () {
            that.map.getCanvas().style.cursor = 'pointer';
          });

          // Change it back to a pointer when it leaves.
          that.map.on('mouseleave', 'tresors', function () {
            that.map.getCanvas().style.cursor = '';
          });

          that.mapLoaded = true;
        })
      });
    });
  }


  clickOnTresor(e) {
    const that = this;

    var coordinates = e.features[0].geometry.coordinates.slice();
    var id = e.features[0].properties.id;

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    console.log(e.features[0]) //id, name, street

    let node = e.features[0].properties;

    let html = "<b>Nom : </b>" + node.name + "<br>";
    html += "<b>Indice : </b>" + node.indice + "<br>";

    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(html)
      .addTo(that.map);

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
          resolve("");
        }
      )
    })
  }

  loadMapIcons() {
    const that = this;
    return new Promise((resolve, reject) => {
      that.loadMapIcon("treasure.png", "treasure").then(() => {
        resolve("");
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
          resolve("");
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

      resolve("");
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
