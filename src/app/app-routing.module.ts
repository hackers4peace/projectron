import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthnRedirectComponent } from './components/authn-redirect/authn-redirect.component';

const routes: Routes = [
  { path: 'redirect', component: AuthnRedirectComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
