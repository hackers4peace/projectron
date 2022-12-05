import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { CoreEffects } from './effects/core.effects';
import { AuthnRedirectComponent } from './components/authn-redirect/authn-redirect.component';
import { LoginComponent } from './components/login/login.component';

import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RequestAuthorizationComponent } from './components/request-authorization/request-authorization.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DataEffects } from './effects/data.effects';

@NgModule({
  declarations: [
    AppComponent,
    AuthnRedirectComponent,
    LoginComponent,
    RequestAuthorizationComponent,
    DashboardComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    EffectsModule.forRoot([CoreEffects]),
    // material modules
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,

    StoreModule.forRoot(reducers, { metaReducers }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    BrowserAnimationsModule,
    EffectsModule.forFeature([DataEffects]),
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
