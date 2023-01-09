import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MaterialModule } from '../material.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgEncodeURIComponentPipeModule } from 'angular-pipes'

import { EffectsModule } from '@ngrx/effects';
import { CoreEffects } from './effects/core.effects';
import { DataEffects } from './effects/data.effects';

import { NavigationEffects } from './effects/navigation.effects';
import { ReactiveFormsModule } from "@angular/forms";

import { AuthnRedirectComponent } from './components/authn-redirect/authn-redirect.component';
import { LoginComponent } from './components/login/login.component';
import { RequestAuthorizationComponent } from './components/request-authorization/request-authorization.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProjectComponent } from './components/project/project.component';
import { ProjectEditComponent } from './components/project-edit/project-edit.component';
import { TaskEditComponent } from './components/task-edit/task-edit.component';
import { ProjectCreateComponent } from './components/project-create/project-create.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthnRedirectComponent,
    LoginComponent,
    RequestAuthorizationComponent,
    DashboardComponent,
    ProjectComponent,
    ProjectEditComponent,
    TaskEditComponent,
    ProjectCreateComponent
  ],
  imports: [
    MaterialModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserModule,
    EffectsModule.forRoot([CoreEffects, DataEffects, NavigationEffects]),
    StoreModule.forRoot(reducers, { metaReducers }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    BrowserAnimationsModule,
    NgEncodeURIComponentPipeModule
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
