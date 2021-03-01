import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';

import { ModalCacheComponent } from '../modal-cache/modal-cache.component';
import { ModalOnBoardingComponent } from '../modal-onboarding/modal-onboarding.component';
import { LocationService } from '../../services/location.service';

import lumieres_loader from '@assets/content/lumieres_loader.json';
import canuts_loader from '@assets/content/canuts_loader.json';
import gones_loader from '@assets/content/gones_loader.json';
import { InvalidatedProjectKind } from 'typescript';


declare var $: any;
declare var Papa: any;
declare var MapboxDraw: any;
declare var turf: any;
declare var tipContent: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnChanges {
  @Input() position;
  @Input() zoom;

  map;
  mapLoaded = false;

  alreadyStarted = "";
  terreChoosed = "";
  csvRecords: any[] = [];
  header = false;
  geolocate;
  groupes = [];

  parcoursSelected;

  userPositionGeoJson = {
    "type": "FeatureCollection",
    "features": []
  };
  activeTresorsGeoJson = {
    "type": "FeatureCollection",
    "features": []
  };
  allTresorsGeoJson = {
    "type": "FeatureCollection",
    "features": []
  };
  groupesGeoJson = {
    "type": "FeatureCollection",
    "features": []
  };


  constructor(private httpClient: HttpClient, private router: Router, private modalService: NgbModal, private cookieService: CookieService, private locationService: LocationService) {

    mapboxgl.accessToken = 'pk.eyJ1IjoiY2hpcHNvbmR1bGVlIiwiYSI6ImQzM2UzYmQxZTFjNjczZWMyY2VlMzQ5NmM2MzEzYWRmIn0.0iPy8Qyw2FjGSxawGZxW8A';

    // Cookies selection terre
    this.terreChoosed = this.cookieService.get('scoutocaching_terre');
    this.alreadyStarted = this.cookieService.get('alreadyStarted');
  }

  ngOnInit(): void {
    const that = this;

    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/chipsondulee/ckibkn4zp08z01apbrodswj9g', //43.244442, 5.398040
      center: JSON.parse(that.position), // starting position [lng, lat]
      zoom: that.zoom, // starting zoom
    });

    this.geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    });




    that.terreChoosed = this.cookieService.get('scoutocaching_terre');

    console.log(that.terreChoosed)

    if (that.terreChoosed === undefined || that.terreChoosed == "") { // Si aucune terre n'a été choisie

      const onboarding = that.modalService.open(ModalOnBoardingComponent, { size: 'lg', centered: true });

      onboarding.result.then((result) => {
        console.log(result);

        that.terreChoosed = result;

        const now = new Date();
        // console.log(now.getHours());

        const expiredDate = new Date();
        expiredDate.setMinutes(now.getMinutes() + 3);

        console.log(now.getMinutes(), expiredDate.getMinutes());

        that.cookieService.set("alreadyStarted", "true", { expires: expiredDate });
        that.cookieService.set('scoutocaching_terre', that.terreChoosed);

        that.loadCaches();

        that.refreshMap();

        //this.init()
      }, (reason) => {
        console.log(reason);
      });


    }
    else {
      that.loadCaches();
    }















    that.loadGroupes();



    that.loadMap();

  }

  ngOnChanges() {
  }

  // getUserPosition(){
  //   this.locationService.getPosition().then(pos=>{
  //     this.userPositionGeoJson.features.push({
  //       "type": "Feature",
  //       "geometry": {
  //         "type": "Point",
  //         "coordinates": [pos.lng,pos.lat]
  //       }
  //     })
  //     this.map.setCenter([pos.lng,pos.lat]);
  //   });
  // }

  // updateUserPosition(){
  //   this.locationService.getPosition().then(pos=>{
  //     this.userPositionGeoJson.features=[{
  //       "type": "Feature",
  //       "geometry": {
  //         "type": "Point",
  //         "coordinates": [pos.lng,pos.lat]
  //       }
  //     }];
  //     this.map.setCenter([pos.lng,pos.lat]);
  //   });
  // }







  /*
  ** MAP
  */

  loadGroupes() {
    const that = this;

    // Chargement de la position des groupes et des caches
    Papa.parse("assets/objets_carte.csv", {
      download: true,
      dynamicTyping: true,
      header: true,
      complete: function (results) {

        console.log(results);

        that.groupes = results.data;

        for (let i = 0; i < results.data.length; i++) { // Pour chaque element
          const element = results.data[i];
          let coord = element["coords"]; // ? COORD

          if (coord !== undefined) {

            coord = coord.split(' ');
            coord = [parseFloat(coord[1]), parseFloat(coord[0])];

            // Recherche de l'adresse
            // ! Nécessaire ?
            that.reverseGeoCoding(coord[1], coord[0]).then((resp: any) => {

              let streetName = ''; // Adresse
              for (let i = 0; i < resp.features.length; i++) {
                const element = resp.features[i];

                if (element.place_type[0] === 'address') {
                  streetName = element.text;
                }
              }

              // Si l'élément est un groupe
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
            });
          }

        }
      }
    });
  }

  loadCaches() {
    const that = this;

    if (this.terreChoosed == "gones") {
      this.parcoursSelected = gones_loader;
    }
    else if (this.terreChoosed == "lumieres") {
      this.parcoursSelected = lumieres_loader;
    }
    else if (this.terreChoosed == "canuts") {
      this.parcoursSelected = canuts_loader;
    }

    that.activeTresorsGeoJson.features = [];

    for (let i = 0; i < this.parcoursSelected.indices.length; i++) {
      const indice = this.parcoursSelected.indices[i];

      // Statut de la cache (trouvee ou pas)
      var status = that.cookieService.get('scoutocaching_caches_' + this.parcoursSelected.name + "_" + indice.id);

      // Initialisation du cookie
      if (status === "undefined" || status === "") {
        status = "treasureNotFound";
        that.cookieService.set('scoutocaching_caches_' + this.parcoursSelected.name + "_" + indice.id, status);
      }

      var coord = indice.coords.split(' ');
      coord = [parseFloat(coord[1]), parseFloat(coord[0])];

      // Ajout de la cache au géoJson global des caches
      that.activeTresorsGeoJson.features.push({
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": coord
        },
        "properties": {
          "id": indice.id,
          "name": indice.name,
          "status": status,
          "terre": this.parcoursSelected.name,
          "resultat": indice.resultat,
          "indice": indice.indice,
          "qrSecret": indice.qr_secret
        }
      })
    }
  }


  loadMap() {
    const that = this;

    that.map.addControl(that.geolocate); // Bouton de géolocalisation // ! PAS VISIBLE : caché par la barre de menu

    that.map.on('load', function () {
      that.geolocate.trigger();

      // that.updateUserPosition();
      // update the drone symbol's location on the map
      // that.map.getSource('userPoint').setData(that.userPositionGeoJson);
      // console.log(that.userPositionGeoJson.features)
      // fly the map to the drone's current location
      // that.map.flyTo({center: that.userPositionGeoJson.features[0].geometry.coordinates, speed: 0.5});
      // }, 2000);
      // that.map.addImage('pulsing-dot', that.userPulsingDot, { pixelRatio: 4});

      // that.map.addLayer({
      //   'id': 'userPoint',
      //   'type': 'symbol',
      //   'source': 'userPoint',
      //   'layout': {
      //     'icon-image': 'pulsing-dot'
      //   }
      //   });

      // Chargement des icones a afficher sur la carte
      that.loadMapIcons().then(() => {
        that.loadMapFoulards().then(() => {

          // Sources
          that.map.addSource('tresors', {
            type: 'geojson',
            data: that.activeTresorsGeoJson
          });

          that.map.addSource('groupes', {
            type: 'geojson',
            data: that.groupesGeoJson
          });

          // Labels
          let labelsGeoJson = { ...that.activeTresorsGeoJson };
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
              'icon-image': ['get', 'status'],
              'icon-size': 0.25,
              'icon-allow-overlap': true,
              'icon-ignore-placement': true,
              'icon-anchor': 'center',
            },
            "filter": ["!in", "id", ""]
          });

          // When a click event occurs on a feature in the tresors layer, open a popup at the
          // location of the feature, with description HTML from its properties.
          that.map.on('click', 'tresors', function (e) {
            that.clickOnTresor(e);
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

          window.setInterval(function () {
            that.refreshMap();
          }, 500);


        })
      });
    });

  }

  refreshMap() {
    const that = this;

    // Maj du cookie de la terre sélectionnée
    if (that.terreChoosed != this.cookieService.get('scoutocaching_terre')) {
      that.terreChoosed = this.cookieService.get('scoutocaching_terre');

      that.loadCaches();
    }

    // Géojson des caches à afficher : celles correspondant à la terre
    //that.activeTresorsGeoJson.features = that.allTresorsGeoJson.features.filter(element => element.properties.terre == that.terreChoosed);
    // console.log(that.activeTresorsGeoJson);

    // Maj des caches sur la carte
    that.map.getSource('tresors').setData(that.activeTresorsGeoJson);
  }








  /*
  ** Map interactions
  */

  clickOnTresor(e) {
    const that = this;

    //console.log(e.features[0].properties)

    var tresorProperties = e.features[0].properties;
    var coordinates = e.features[0].geometry.coordinates.slice();

    const modalRef = that.modalService.open(ModalCacheComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.tresorProperties = tresorProperties;
    modalRef.componentInstance.coordinates = coordinates;

    modalRef.result.then((result) => {
      console.log(result)

      if (result) {

        console.log("Trouvé")

        var thisTreature = that.activeTresorsGeoJson.features.find(item => {
          return item.properties.id == tresorProperties.id;
        })

        console.log(thisTreature)

        if (thisTreature !== undefined) {
          thisTreature.properties.status = "treasureFound";
        }
      }

      that.map.getSource('tresors').setData(that.activeTresorsGeoJson);
    }, (reason) => {
      console.log(reason);
    });





    /*var coordinates = e.features[0].geometry.coordinates.slice();
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
      .addTo(that.map);*/

    /*
        // Récupération de la cache
        const thisTreature = that.activeTresorsGeoJson.features.reduce(function (prev, curr) {
          return ((Math.abs(curr.geometry.coordinates[0] - e.lngLat.lng) + Math.abs(curr.geometry.coordinates[1] - e.lngLat.lat)) < (Math.abs(prev.geometry.coordinates[0] - e.lngLat.lng) + Math.abs(prev.geometry.coordinates[1] - e.lngLat.lat)) ? curr : prev);
        });

        console.log(thisTreature)

        // Ouverture de la modale de la cache
        const modalRef = that.modalService.open(ModalCacheComponent, { size: 'lg' });
        modalRef.componentInstance.id = thisTreature.properties['id'];
        modalRef.componentInstance.indice = thisTreature.properties['indice'];
        modalRef.componentInstance.title = thisTreature.properties['name'];
        modalRef.componentInstance.qrSecret = thisTreature.properties['qrSecret'];


        // Si il est trouvé
        if (thisTreature.properties.status === "treasureFound") {

          // ! TO DO Charger le contenu des personnages

          that.cookieService.set('avoidOnBoarding', '',);

          modalRef.componentInstance.found = true;
          modalRef.componentInstance.indice = null;
          modalRef.componentInstance.story = thisTreature.properties['story'];
          modalRef.componentInstance.story_cachee = thisTreature.properties['story'];

          console.log(modalRef.componentInstance.story);

          if (modalRef.componentInstance.story === null) { // Si aucun contenu à afficher
            modalRef.componentInstance.story = "<h2>Cache trouvée </h2>";
          }
        }

        modalRef.componentInstance.coord = e.lngLat;
        //modalRef.componentInstance.idRapport = idRapport;

        modalRef.result.then((result) => {
          if (modalRef.componentInstance.id === thisTreature.properties['id'] && result === true) {
            thisTreature.properties.status = "treasureFound";
            that.cookieService.set('scoutocaching_caches_'.concat(thisTreature.properties['id'].toString()), thisTreature.properties.status);
            that.map.getSource('tresors').setData(that.activeTresorsGeoJson);
          }
          //this.init()
        }, (reason) => {
          console.log(reason);
        });
        */
  }













  /*
  ** Load map icons
  */



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
      that.loadMapIcon("treasureNotFound.png", "treasureNotFound");
      that.loadMapIcon("treasureFound.png", "treasureFound").then(() => {
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
