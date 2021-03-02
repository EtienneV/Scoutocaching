import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MericourtComponent } from './pages/main/main.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

var routes: Routes = [
  // { path: '',   redirectTo: '/main', pathMatch: 'full' },
  // { path: 'login', pathMatch: 'full', component: LoginComponent},
  { path: '', component: MericourtComponent},
  // {path: 'json/:fileName', component: JSONComponent } ,
  {path: "*", component: PageNotFoundComponent}
  // { path: '', component : }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
