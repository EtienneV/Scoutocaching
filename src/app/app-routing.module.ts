import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginGuard } from './guards/login.guard';

import { MericourtComponent } from './pages/main/main.component';
import { LoginComponent } from './authentification/login/login.component';

const routes: Routes = [
  // { path: '',   redirectTo: '/main', pathMatch: 'full' },
  // { path: 'login', pathMatch: 'full', component: LoginComponent},
  { path: '', component: MericourtComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
