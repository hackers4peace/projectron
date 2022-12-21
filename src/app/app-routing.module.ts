import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthnRedirectComponent } from './components/authn-redirect/authn-redirect.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { ProjectEditComponent } from './components/project-edit/project-edit.component';
import { ProjectComponent } from './components/project/project.component';
import { TaskEditComponent } from './components/task-edit/task-edit.component';
import { RequestAuthorizationComponent } from './components/request-authorization/request-authorization.component';
import { AuthGuard } from './guards/auth.guard';



const routes: Routes = [
  { path: 'redirect', component: AuthnRedirectComponent },
  { path: 'login', component: LoginComponent },
  { path: 'request-authorization', component: RequestAuthorizationComponent },
  {
    path: '', component: DashboardComponent,
    canActivate: [AuthGuard] ,
    children: [
      {
        path: 'project', component: ProjectComponent,
      },
      {
        path: 'project-edit', component: ProjectEditComponent,
      },
      {
        path: 'task-edit', component: TaskEditComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
