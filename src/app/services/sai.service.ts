import { Injectable } from '@angular/core';
import { getDefaultSession } from '@inrupt/solid-client-authn-browser';
import { Application } from '@janeirodigital/interop-application';
import { DataInstance } from '@janeirodigital/interop-data-model';
import { RDFS } from '@janeirodigital/interop-namespaces';
import { environment } from 'src/environments/environment';
import { Project } from '../models/project.model';

function instance2Project(instance: DataInstance, owner: string): Project {
  return {
    id: instance.iri,
    label: instance.getObject(RDFS.label)!.value,
    owner
  }
}

const shapeTrees = {
  project: 'http://localhost:3000/shapetrees/trees/Project'
}

@Injectable({
  providedIn: 'root'
})
export class SaiService {
  private session: Application | undefined;
  private cache: DataInstance[] = []

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
    for (const registration of user.selectRegistrations(shapeTrees.project)) {
      for await (const dataInstance of registration.dataInstances) {
        this.cache.push(dataInstance)
        projects.push(instance2Project(dataInstance, ownerId));
      }
    }

    return {ownerId, projects}
  }

  async updateProject(project: Project) {
    const instance = this.cache.find(i => i.iri === project.id)
    if (!instance) {
      throw new Error(`Data Instance not found for: ${project.id}`)
    }

    instance.replaceValue(RDFS.label, project.label);

    await instance.update(instance.dataset)

    return instance2Project(instance, project.owner)
  }
}
