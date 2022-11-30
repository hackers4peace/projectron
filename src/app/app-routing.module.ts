import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthnRedirectComponent } from './components/authn-redirect/authn-redirect.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { RequestAuthorizationComponent } from './components/request-authorization/request-authorization.component';

const routes: Routes = [
  { path: 'redirect', component: AuthnRedirectComponent },
  { path: 'login', component: LoginComponent },
  { path: 'request-authorization', component: RequestAuthorizationComponent },
{ path: 'dashboard', component: DashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
