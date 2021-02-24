import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { ModalCacheComponent } from '../modal-cache/modal-cache.component';
import {ModalOnBoardingComponent} from '../modal-onboarding/modal-onboarding.component';
import {LocationService} from '../../services/location.service';
import {CookieService} from 'ngx-cookie-service';  
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';

declare var $: any;
declare var Papa: any;
declare var MapboxDraw: any;
declare var turf: any;
declare var tipContent:any;
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
  terreChoosed = "lumieres";
  csvRecords: any[] = [];
  header = false;
  userPulsingDot;
  groupes = [];
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
    this.terreChoosed = this.cookieService.get('scoutocaching_terre');

  }

  ngOnInit(): void {
    const that = this;

    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/chipsondulee/ckibkn4zp08z01apbrodswj9g', //43.244442, 5.398040
      center: JSON.parse(that.position), // starting position [lng, lat]
      zoom: that.zoom, // starting zoom
    });    
    var size = 200;
    this.userPulsingDot = {
      width: size,
      height: size,
      data: new Uint8Array(size * size * 4),
       
      // get rendering context for the map canvas when layer is added to the map
      onAdd: function () {
      var canvas = document.createElement('canvas');
      canvas.width = this.width;
      canvas.height = this.height;
      this.context = canvas.getContext('2d');
      },
       
      // called once before every frame where the icon will be used
      render: function () {
      var duration = 1000;
      var t = (performance.now() % duration) / duration;
       
      var radius = (size / 2) * 0.3;
      var outerRadius = (size / 2) * 0.7 * t + radius;
      var context = this.context;
       
      // draw outer circle
      context.clearRect(0, 0, this.width, this.height);
      context.beginPath();
      context.arc(this.width / 2,this.height / 2,outerRadius,0, Math.PI * 2);
      // context.fillStyle = 'rgba(255, 200, 200,' + (1 - t) + ')';
      context.fillStyle = 'rgba(1, 116, 186,' + (1 - t) + ')';
      context.fill();
       
      // draw inner circle
      context.beginPath();
      context.arc(
      this.width / 2,
      this.height / 2,
      radius,
      0,
      Math.PI * 2
      );
      // context.fillStyle = 'rgba(255, 100, 100, 1)';
      context.fillStyle = 'rgba(4, 58, 93, 1)';
      context.strokeStyle = 'white';
      context.lineWidth = 2 + 4 * (1 - t);
      context.fill();
      context.stroke();
       
      // update this image's data with data from the canvas
      this.data = context.getImageData(0,0,this.width,this.height).data;
       
      // continuously repaint the map, resulting in the smooth animation of the dot
      that.map.triggerRepaint();
       
      // return `true` to let the map know that the image was updated
      return true;
      }
      };
      that.getUserPosition();
      
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
                var status = that.cookieService.get('scoutocaching_caches_'.concat(element["id"].toString()));
                if(status==="undefined" || status===""){
                  status="treasureNotFound";
                  that.cookieService.set('scoutocaching_caches_'.concat(element["id"].toString()),status);
                }
                that.allTresorsGeoJson.features.push({
                  "type": "Feature",
                  "geometry": {
                    "type": "Point",
                    "coordinates": coord
                  },
                  "properties": {
                    "name": element["name"], // ! NAME
                    "id": element["id"], // ! ID
                    "status": status,
                    "terre":element["terre"],
                    "story":element["story"],
                    street: streetName,
                    indice: [{type: "titre",
                      text: element["indice_title"]
                    },
                    {
                      type: "paragraphe",text: element["indice_text"]
                    },
                    {
                      type: "image",url: element["indice_image"], trustedUrl: {}
                    },
                    {
                      type: "video",url: element["indice_video"],  trustedUrl: {}
                    }]
                  }
                })
              }

            });
          }

        }
        console.log(that.allTresorsGeoJson)
        that.loadMap();
                
      }
    });
  }

  getUserPosition(){
    this.locationService.getPosition().then(pos=>{
      this.userPositionGeoJson.features.push({
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [pos.lng,pos.lat]
        }
      })
      this.map.setCenter([pos.lng,pos.lat]);
    });
  }
  updateUserPosition(){
    this.locationService.getPosition().then(pos=>{
      this.userPositionGeoJson.features[0]={
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [pos.lng,pos.lat]
        }
      }
      this.map.setCenter([pos.lng,pos.lat]);
    });
  }

  refreshMap(){
    const that =this;
    that.activeTresorsGeoJson.features = that.allTresorsGeoJson.features.filter(element =>  element.properties.terre == that.terreChoosed);
    console.log(that.activeTresorsGeoJson);
    that.map.getSource('tresors').setData(that.activeTresorsGeoJson);
  }

  loadMap() {
    const that = this;
    this.map.on('load', function () {
      window.setInterval(function () {
        that.updateUserPosition();
        // update the drone symbol's location on the map
        that.map.getSource('userPoint').setData(this.userPositionGeoJson);
      
        // fly the map to the drone's current location
        this.map.flyTo({center: this.userPositionGeoJson.features[0].geometry.coordinates, speed: 0.5});
      }, 2000);
      that.map.addImage('pulsing-dot', that.userPulsingDot, { pixelRatio: 4});
      that.map.addSource('userPoint', {
        'type': 'geojson',
        'data': that.userPositionGeoJson
      });
      that.map.addLayer({
        'id': 'userPoint',
        'type': 'symbol',
        'source': 'userPoint',
        'layout': {
          'icon-image': 'pulsing-dot'
        } 
        });
      that.loadMapIcons().then(() => {
        that.loadMapFoulards().then(() => {
          // Sources
          that.map.addSource('tresors', {
            type: 'geojson',
            data: that.allTresorsGeoJson
          });

          that.map.addSource('groupes', {
            type: 'geojson',
            data: that.groupesGeoJson
          });

          // Labels
          let labelsGeoJson = { ...that.allTresorsGeoJson };
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
            //that.clickOnTresor(e);
            const thisTreature = that.activeTresorsGeoJson.features.reduce(function(prev, curr) {
              return ((Math.abs(curr.geometry.coordinates[0] - e.lngLat.lng) + Math.abs(curr.geometry.coordinates[1] - e.lngLat.lat))< (Math.abs(prev.geometry.coordinates[0] - e.lngLat.lng) + Math.abs(prev.geometry.coordinates[1] - e.lngLat.lat)) ? curr : prev);
            });          
            const modalRef = that.modalService.open(ModalCacheComponent, {size: 'lg'});           
            modalRef.componentInstance.id=thisTreature.properties['id'];
            modalRef.componentInstance.indice=thisTreature.properties['indice'];
            modalRef.componentInstance.title=thisTreature.properties['name'];
            if(thisTreature.properties.status==="treasureFound"){
              modalRef.componentInstance.found=true;
              modalRef.componentInstance.indice=null;
              modalRef.componentInstance.story=thisTreature.properties['story'];
              console.log(modalRef.componentInstance.story);
              if(modalRef.componentInstance.story===null){
                modalRef.componentInstance.story="<h2>Cache trouvée </h2>";
              }
            }

            modalRef.componentInstance.coord=e.lngLat;
            //modalRef.componentInstance.idRapport = idRapport;
            modalRef.result.then((result) => {
              if(modalRef.componentInstance.id===thisTreature.properties['id'] && result===0){              
                thisTreature.properties.status="treasureFound";
                that.cookieService.set('scoutocaching_caches_'.concat(thisTreature.properties['id'].toString()),thisTreature.properties.status);
                that.map.getSource('tresors').setData(that.activeTresorsGeoJson);
              }
              //this.init()
            }, (reason) => {
              console.log(reason);
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
          if(that.terreChoosed===""){
            const onboarding = that.modalService.open(ModalOnBoardingComponent, {size: 'lg', centered: true }); 
            onboarding.result.then((result) => {
              console.log(result);
              that.terreChoosed=result;
              that.cookieService.set('scoutocaching_terre',that.terreChoosed);
              that.refreshMap();
              //this.init()
            }, (reason) => {
              console.log(reason);
            });
          }else{
            that.refreshMap();
          }
        })
      });
    });
    
  }

  ngOnChanges() {
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
          resolve();
        }
      )
    })
  }

  loadMapIcons() {
    const that = this;
    return new Promise((resolve, reject) => {
      that.loadMapIcon("treasureNotFound.png", "treasureNotFound");
      that.loadMapIcon("treasureFound.png", "treasureFound").then(() => {
        resolve();
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
