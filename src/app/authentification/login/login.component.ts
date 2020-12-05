import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthentificationService } from '../../services/authentification.service';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email = "";
  mdp = "";

  showAlertForgotPw = false;

  constructor(private authService: AuthentificationService, private router: Router) { }

  ngOnInit() {
  }

  login() {

    if (this.email == '') {
      $('#email-login').addClass('is-invalid');
    }
    if (this.mdp == '') {
      $('#pwd-login').addClass('is-invalid');
    }

    this.authService.login(this.email, this.mdp).then((response) => {
      this.router.navigate(['mericourt']);
    }, (err) => {
      console.log("Echec de connexion")
    });

  }

}
