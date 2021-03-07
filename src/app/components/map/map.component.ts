import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';

import { ModalCacheComponent } from '../modal-cache/modal-cache.component';
import { ModalOnBoardingComponent } from '../modal-onboarding/modal-onboarding.component';
import { ModalResolutionComponent } from '../modal-resolve/modal-resolve.component';

import lumieres_loader from '@assets/content/lumieres_loader.json';
import canuts_loader from '@assets/content/canuts_loader.json';
import gones_loader from '@assets/content/gones_loader.json';
import { ModalChangeTerreComponent } from '../modal-changeTerre/modal-changeTerre.component';


declare var Papa: any;

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
  allFound = false;
  alreadyStarted = "";
  terreChoosed = "";
  csvRecords: any[] = [];
  refreshment : any;
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


  constructor(private httpClient: HttpClient, private modalService: NgbModal, private cookieService: CookieService) {

    mapboxgl.accessToken = 'pk.eyJ1IjoiY2hpcHNvbmR1bGVlIiwiYSI6ImQzM2UzYmQxZTFjNjczZWMyY2VlMzQ5NmM2MzEzYWRmIn0.0iPy8Qyw2FjGSxawGZxW8A';

    // Cookies selection terre
    this.terreChoosed = this.cookieService.get('scoutocaching_terre');
    this.alreadyStarted = this.cookieService.get('alreadyStarted');
  }

  ngOnInit(): void {
    const that = this;

    (<HTMLInputElement>document.getElementById("resolutionDiv")).style.display = "none";
    /*
    ** Init Map
    */

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


    /*
    ** Load parcours
    */

    that.terreChoosed = this.cookieService.get('scoutocaching_terre');

    if (that.terreChoosed === undefined || that.terreChoosed == "") { // Si aucune terre n'a été choisie


      const onboarding = that.modalService.open(ModalOnBoardingComponent, { size: 'lg', centered: true, backdrop: 'static' });

      onboarding.result.then((result) => {
        that.terreChoosed = result;

        const now = new Date();
        const expiredDate = new Date();
        expiredDate.setMinutes(now.getMinutes() + 3);

        that.cookieService.set("alreadyStarted", "true", { expires: expiredDate });
        that.cookieService.set('scoutocaching_terre', that.terreChoosed);

        that.loadCaches();
        // that.refreshMap();
      }, (reason) => {
        console.log(reason);
      });

    }
    else {
      that.loadCaches();
      // console.log(that.activeTresorsGeoJson.features.length)
    }


    
    that.loadGroupes();
    that.loadMap();
    var item = window.document.getElementById('groupesVisibilitySelectorShow');
    item.onclick =  function(e){that.changeGroupesVisibility(e);}
    var item = window.document.getElementById('groupesVisibilitySelectorHide');
    item.onclick =  function(e){that.changeGroupesVisibility(e);}
    // item.href="javascript:void(0);";
    // item.className="dropdown-item waves-effect waves-light";
// 
    // var link =  window.document.createElement('input');
    // link.type = 'checkbox';
    // link.name="showGroupes";
    // // link.className = 'pr-2';
    
    // var label = document.createElement('label'); 
              
    // // assigning attributes for  
    // // the created label tag  
    // // label.htmlFor = link.name; 
      
    // // appending the created text to  
    // // the created label tag  
    // // label.appendChild(document.createTextNode('Voir les groupes')); 
    
    // item.textContent = 'Voir les groupes'; 
    // // link.textContent = "<label for='showGroupes'>Afficher les groupes</label>";
    // // var text = document.createTextNode("Afficher les groupes");
    // // link.appendChild(text);
    // // item.appendChild(link);
    // // item.appendChild(label);
    // var layers = window.document.getElementById('navMenu');
    // layers.appendChild(item);
  }

  ngOnChanges() {

  }

  changeGroupesVisibility(e){
    // var clickedLayer = "groupes";
    // e.preventDefault();
    // e.stopPropagation();
    var hideBool:boolean;
    for(const clickedLayer of ["groupes","labels"]){
      var visibility = this.map.getLayoutProperty(clickedLayer, 'visibility');
      
      // toggle layer visibility by changing the layout object's visibility property
      if (visibility === 'visible') {
      this.map.setLayoutProperty(clickedLayer, 'visibility', 'none');
      hideBool=true;
      // this.className = '';
      } else {
      // this.className = 'active';
      this.map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
      hideBool=false;
      }
    }
    const show=window.document.getElementById('groupesVisibilitySelectorHide');
    var hide = window.document.getElementById('groupesVisibilitySelectorShow');
    if(hideBool){ // Groupes visibles
      show.style.visibility="hidden";
      show.style.height="0px";
      show.style.padding="0 0";
      hide.style.visibility="visible";
      hide.style.height="auto";
      hide.style.padding="0.25rem 1.5rem";
    }
    else{
      hide.style.visibility="hidden";
      hide.style.height="0px";
      hide.style.padding="0 0";
      show.style.visibility="visible";
      show.style.height="auto";
      show.style.padding="0.25rem 1.5rem";
    }
  }
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
      this.parcoursSelected = lumieres_loader; //JSON.parse("../../assets/content/gones_loader.json");// 
    }
    else if (this.terreChoosed == "canuts") {
      this.parcoursSelected = canuts_loader;
    }

    this.activeTresorsGeoJson.features = [];

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
      this.activeTresorsGeoJson.features.push({
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

    that.map.addControl(that.geolocate); // Bouton de géolocalisation

    that.map.on('load', function () {
      that.geolocate.trigger();

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
              'visibility': 'none',
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
              'visibility': 'none',
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

          that.refreshment = window.setInterval(function () {
            that.refreshMap();
          }, 500);

        })
      });
    });

  
  }

  loadResolution(){
    const that = this;   
    clearInterval(that.refreshment);
    const resolution = that.modalService.open(ModalResolutionComponent, { size: 'lg', centered: true });
    resolution.componentInstance.title=that.parcoursSelected.resolutionTitle;
    resolution.componentInstance.content = that.parcoursSelected.resolutionPersonnages;
    resolution.componentInstance.parcoursName=this.parcoursSelected.name
    resolution.result.then((result) => {
      console.log(result);
      (<HTMLInputElement>document.getElementById("resolutionDiv")).style.display ="initial";
      (<HTMLInputElement>document.getElementById("resolutionButton")).style.display="none";
      (<HTMLInputElement>document.getElementById("changeTerreButton")).style.display="initial";
      that.refreshment = window.setInterval(function () {that.refreshMap();}, 500);
      if(result){
        (<HTMLInputElement>document.getElementById("changeTerreButton")).click();
      }else{ // REDIRECTION BETA TESTING -- TO BE REMOVED IN PRODUCTION !!!!!
        let url: string = 'https://forms.gle/2CgCK7SgVR2wJ27u9';
        window.open(url, '_blank'); 
      }
    }, (reason) => {
      console.log(reason);
      console.log(that.cookieService.check('scoutocaching_caches_' + this.parcoursSelected.name + "_done"))
      if(that.cookieService.check('scoutocaching_caches_' + this.parcoursSelected.name + "_done")){ // Le suspect a été trouvé 
      (<HTMLInputElement>document.getElementById("resolutionDiv")).style.display ="initial";
      (<HTMLInputElement>document.getElementById("changeTerreButton")).style.display="initial";
      (<HTMLInputElement>document.getElementById("resolutionButton")).style.display="none";
      }else{      
        (<HTMLInputElement>document.getElementById("resolutionDiv")).style.display ="initial";
        (<HTMLInputElement>document.getElementById("changeTerreButton")).style.display="none";
        (<HTMLInputElement>document.getElementById("resolutionButton")).style.display="initial";
      }
    });
  }
  changeTerre():void{
    const onboarding = this.modalService.open(ModalChangeTerreComponent, {size: 'lg', centered: true }); 
    onboarding.result.then((result) => {
      console.log(result);
      this.terreChoosed=result;
      this.cookieService.set('scoutocaching_terre',this.terreChoosed);
      (<HTMLInputElement>document.getElementById("resolutionDiv")).style.display ="none";
      //this.init()
    }, (reason) => {
      console.log(reason);
    });
  }

  areAllFound(){    
    const that = this;
    var answer = true;
    
    for (let i = 0; i < this.parcoursSelected.indices.length; i++) {
      const indice = this.parcoursSelected.indices[i]
      if(that.cookieService.get('scoutocaching_caches_' + this.parcoursSelected.name + "_" + indice.id)==="treasureNotFound"){
        answer=false;
      }
    }
    if(this.parcoursSelected.indices.length===0){
      answer =false;
    }
    that.allFound = answer;
  }

  refreshMap() {
    const that = this;
    // Maj du cookie de la terre sélectionnée
    if (that.terreChoosed != this.cookieService.get('scoutocaching_terre')) {
      that.terreChoosed = this.cookieService.get('scoutocaching_terre');
      that.areAllFound();
      that.loadCaches();
    }
    that.areAllFound();
    if(that.allFound && !that.cookieService.get('scoutocaching_caches_' + this.parcoursSelected.name + "_done")){
      
      (<HTMLInputElement>document.getElementById("resolutionDiv")).style.display ="initial";
      (<HTMLInputElement>document.getElementById("changeTerreButton")).style.display="none";
      (<HTMLInputElement>document.getElementById("resolutionButton")).style.display="initial";
      (<HTMLInputElement>document.getElementById("resolutionButton")).onclick =  function(){that.loadResolution()};
      // that.loadResolution();
    }
    // Maj des caches sur la carte
    that.map.getSource('tresors').setData(that.activeTresorsGeoJson);
  }








  /*
  ** Map interactions
  */

  clickOnTresor(e) {
    const that = this;
    console.log(e);
    console.log(e.features[0].properties)

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
