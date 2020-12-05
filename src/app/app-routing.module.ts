import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginGuard } from './guards/login.guard';

import { DevicesComponent } from './pages/devices/devices.component';
import { PilotageComponent } from './pages/pilotage/pilotage.component';
import { MericourtComponent } from './pages/mericourt/mericourt.component';
import { NodeComponent } from './pages/node/node.component';
import { LoginComponent } from './authentification/login/login.component';
import { RasJabelComponent } from './pages/ras-jabel/ras-jabel.component';

const routes: Routes = [
  { path: '',   redirectTo: '/mericourt', pathMatch: 'full' },
  { path: 'login', pathMatch: 'full', component: LoginComponent},
  { path: 'devices', component: DevicesComponent, canActivate:  [LoginGuard] },
  { path: 'pilotage', component: PilotageComponent, canActivate:  [LoginGuard] },
  { path: 'mericourt', component: MericourtComponent, canActivate:  [LoginGuard] },
  { path: 'ras-jebel', component: RasJabelComponent, canActivate:  [LoginGuard] },
  { path: 'node/:mac_gateway/:gateway/:node/:name', component: NodeComponent, canActivate:  [LoginGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
