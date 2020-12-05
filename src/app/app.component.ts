import { Component } from '@angular/core';

import { AuthentificationService } from './services/authentification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'micro-cms-everywarecloud';

  constructor(private AuthentificationService: AuthentificationService) {

  }

  logout() {
    this.AuthentificationService.deconnexion();
  }
}
