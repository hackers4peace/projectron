import { Injectable } from '@angular/core';
import { getDefaultSession } from '@inrupt/solid-client-authn-browser';
import { Application } from '@janeirodigital/interop-application';
import { environment } from 'src/environments/environment';
import { Project } from '../models/project.model';
@Injectable({
  providedIn: 'root'
})
export class SaiService {
  private session: Application | undefined;

  async buildSession(userId: string): Promise<Application> {
    this.session = await Application.build(
      userId!,
      environment.applicationId,
      { fetch: getDefaultSession().fetch, randomUUID: self.crypto.randomUUID }
    );

    return this.session;
  }

  authorize(authorizationRedirectUri: string) {
    window.location.href = authorizationRedirectUri;
  }

  async loadProjects(ownerId: string): Promise<{ownerId: string, projects: Project[]}> {
    if (!this.session) {
      throw new Error('buildSession was not called');
    }
    const user = this.session.dataOwners.find((agent) => agent.iri === ownerId);
    if (!user) {
      throw new Error(`data registration not found for ${ownerId}`)
    }
    const projects = [];
    for (const registration of user.selectRegistrations(Project.shapeTree)) {
      for await (const dataInstance of registration.dataInstances) {
        projects.push(new Project(dataInstance));
      }
    }

    return {ownerId, projects}
  }
}
