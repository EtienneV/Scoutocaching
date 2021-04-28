import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  lumieres = {
    url: "https://docs.google.com/forms/u/0/d/e/1FAIpQLSdwQSbk_b4dfoix3Psrrg3b50xlMph-Omdysml2GMgIc8OA-Q/formResponse",
    caches: [
      {
        name: 'Décines',
        formCode: 'entry.885741938',
        test: 'Test decines'
      },
      {
        name: 'Gratte-Ciel',
        formCode: 'entry.278162919',
        test: 'Test gratte ciel'
      },
      {
        name: 'Montchat',
        formCode: 'entry.1097225745',
        test: 'Test montchat'
      },
      {
        name: 'La Soie',
        formCode: 'entry.1034944471',
        test: 'Test la soie'
      },
      {
        name: 'Bellecombe',
        formCode: 'entry.874775173',
        test: 'Test bellecombe'
      },
      {
        name: 'Parcours termine',
        formCode: 'entry.1438077089',
        test: 'Test parcours termine'
      }
    ]
  };

  gones = {
    url: "https://docs.google.com/forms/u/0/d/e/1FAIpQLScHMQVXoDgbNLzpR4NE4CDqw2M6ynwIpD49UNcoit5BsaX29w/formResponse",
    caches: [
      {
        name: 'Avenue Félix Faure',
        formCode: 'entry.582427794',
        test: 'Test Felix Faure'
      },
      {
        name: 'La Confluence',
        formCode: 'entry.189107091',
        test: 'Test Confluence'
      },
      {
        name: 'Parc de Gerland',
        formCode: 'entry.2012218927',
        test: 'Test Gerland'
      },
      {
        name: 'Kiosque Monplaisir',
        formCode: 'entry.1268423961',
        test: 'Test Monplaisir'
      },
      {
        name: 'Parc de Parilly',
        formCode: 'entry.162021025',
        test: 'Test Parilly'
      },
      {
        name: 'Desgenettes',
        formCode: 'entry.1764769119',
        test: 'Test Desgenettes'
      },
      {
        name: 'Parcours termine',
        formCode: 'entry.70892475',
        test: 'Test parcours termine'
      }
    ]
  };

  canuts = {
    url: "https://docs.google.com/forms/u/0/d/e/1FAIpQLSeA7R0ZtiFDpRwtJGXMQ5QnVVSs4R4IZ_5hrL2TppEv6jhzJg/formResponse",
    caches: [
      {
        name: 'Mur des canuts',
        formCode: 'entry.1057623870',
        test: 'Test mur des Canuts'
      },
      {
        name: 'Cour des voraces',
        formCode: 'entry.1569755142',
        test: 'Test cour des Voraces'
      },
      {
        name: 'Rue Mercière',
        formCode: 'entry.911578562',
        test: 'Test merciere'
      },
      {
        name: "Parc de la Tête d'Or",
        formCode: 'entry.1070423002',
        test: 'Test Tete dor'
      },
      {
        name: 'St Pothin',
        formCode: 'entry.686000117',
        test: 'Test St Pothin'
      },
      {
        name: 'Place Bir Hakeim',
        formCode: 'entry.1422394584',
        test: 'Test Bir Hakeim'
      },
      {
        name: 'Parcours termine',
        formCode: 'entry.644597583',
        test: 'Test parcours termine'
      }
    ]
  };

  constructor(private httpClient: HttpClient) { }


  postForm(url, payload) {
    var settings = {
      "url": url,
      "method": "POST",
      "timeout": 0,
      "headers": {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      "data": payload
    };

    $.ajax(settings).done(function (response) {
      //console.log(response);
    });
  }

  postLumieres(cache, value) {
    var cacheData = this.lumieres.caches.find(elt => elt.name === cache);

    if(cacheData !== undefined) {

      var formVal = cacheData.test;

      if(value === 'OK') formVal = 'OK';
      else if(value === 'KO') formVal = 'KO';

      var payload = {};

      payload[cacheData.formCode] = formVal;

      console.log(payload);

      this.postForm(this.lumieres.url, payload);
    }
  }

  postGones(cache, value) {
    var cacheData = this.gones.caches.find(elt => elt.name === cache);

    if(cacheData !== undefined) {

      var formVal = cacheData.test;

      if(value === 'OK') formVal = 'OK';
      else if(value === 'KO') formVal = 'KO';

      var payload = {};

      payload[cacheData.formCode] = formVal;

      console.log(payload);

      this.postForm(this.gones.url, payload);
    }
  }

  postCanuts(cache, value) {
    var cacheData = this.canuts.caches.find(elt => elt.name === cache);

    if(cacheData !== undefined) {

      var formVal = cacheData.test;

      if(value === 'OK') formVal = 'OK';
      else if(value === 'KO') formVal = 'KO';

      var payload = {};

      payload[cacheData.formCode] = formVal;

      console.log(payload);

      this.postForm(this.canuts.url, payload);
    }
  }

  sendStatScan(terre, cache, value) {
    if(terre === 'lumieres') {
      this.postLumieres(cache, value)
    }
    else if(terre === 'gones') {
      this.postGones(cache, value)
    }
    else if(terre === 'canuts') {
      this.postCanuts(cache, value)
    }
  }



}
