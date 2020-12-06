import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginGuard } from './guards/login.guard';

import { MericourtComponent } from './pages/mericourt/mericourt.component';
import { LoginComponent } from './authentification/login/login.component';

const routes: Routes = [
  { path: '',   redirectTo: '/mericourt', pathMatch: 'full' },
  { path: 'login', pathMatch: 'full', component: LoginComponent},
  { path: 'mericourt', component: MericourtComponent, canActivate:  [LoginGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
