import { Injectable } from '@angular/core';
import { getDefaultSession } from '@inrupt/solid-client-authn-browser';
import { Application } from '@janeirodigital/interop-application';
import { DataInstance } from '@janeirodigital/interop-data-model';
import { ACL, RDFS } from '@janeirodigital/interop-namespaces';
import { environment } from 'src/environments/environment';
import { Project } from '../models/project.model';
import { Task } from '../models/task.model';
import { Agent } from '../models/agent.model';
import { Registration } from '../models/registration.model';

class NoSaiSessionError extends Error {
  constructor() {
    super('buildSession was not called');
  }
}

const shapeTrees = {
  project: 'http://localhost:3000/shapetrees/trees/Project',
  task: 'http://localhost:3000/shapetrees/trees/Task'
}

function instance2Project(instance: DataInstance, owner: string, registration: string): Project {
  return {
    id: instance.iri,
    label: instance.getObject(RDFS.label)!.value,
    owner,
    registration,
    canUpdate: instance.accessMode.includes(ACL.Update.value),
    canAddTasks: instance.findChildGrant(shapeTrees.task)?.accessMode.includes(ACL.Create.value),
  }
}

function instance2Task(instance: DataInstance, project: string, owner: string): Task {
  return {
    id: instance.iri,
    label: instance.getObject(RDFS.label)!.value,
    project,
    owner,
    canUpdate: instance.accessMode.includes(ACL.Update.value),
    canDelete: instance.accessMode.includes(ACL.Delete.value),
  }
}


@Injectable({
  providedIn: 'root'
})
export class SaiService {
  private session: Application | undefined;
  private cache: { [key: string]: DataInstance } = {}
  private ownerIndex: { [key: string]: string } = {}

  async buildSession(userId: string): Promise<Application> {
    this.session = await Application.build(
      userId!,
      environment.applicationId,
      { fetch: getDefaultSession().fetch, randomUUID: crypto.randomUUID.bind(crypto) }
    );

    return this.session;
  }

  authorize() {
    if (!this.session) {
      throw new NoSaiSessionError();
    }
    if (this.session.authorizationRedirectUri) {
      window.location.href = this.session.authorizationRedirectUri;
    } else {
      throw new Error('authorizationRedirectUri is undefined');
    }
  }

  share(resource: {id: string}) {
    if (!this.session) {
      throw new NoSaiSessionError();
    }
    const shareUri = this.session.getShareUri(resource.id);
    if (shareUri) {
      window.localStorage.setItem('restorePath', `${window.location.pathname}${window.location.search}`)
      window.location.href = shareUri;
    } else {
      throw new Error('shareUri is undefined')
    }
  }

  async getAgents(): Promise<Agent[]> {
    if (!this.session) {
      throw new NoSaiSessionError();
    }
    const session = this.session
    const profiles = await Promise.all(
      this.session.dataOwners.map(owner => session.factory.readable.webIdProfile(owner.iri))
    )
    return profiles.map(profile => ({
      id: profile.iri,
      label: profile.label || 'unknown' // TODO think of a better fallback
    }))
  }

  async loadProjects(ownerId: string): Promise<{ownerId: string, projects: Project[], registrations: Registration[]}> {
    if (!this.session) {
      throw new NoSaiSessionError();
    }
    const user = this.session.dataOwners.find((agent) => agent.iri === ownerId);
    if (!user) {
      throw new Error(`data registration not found for ${ownerId}`)
    }
    const projects: Project[] = [];
    const registrations: Registration[] = [];
    for (const registration of user.selectRegistrations(shapeTrees.project)) {
      registrations.push({
          id: registration.iri,
          label: 'TODO',
          owner: ownerId,
          canCreate: registration.grant.accessMode.includes(ACL.Create.value),
      })
      for await (const dataInstance of registration.dataInstances) {
        this.cache[dataInstance.iri] = dataInstance
        this.ownerIndex[dataInstance.iri] = ownerId
        projects.push(instance2Project(dataInstance, ownerId, registration.iri));
      }
    }

    return {ownerId, projects, registrations}
  }

  async updateProject(project: Project) {
    if (!this.session) {
      throw new NoSaiSessionError();
    }
    let instance: DataInstance
    if (project.id !== 'DRAFT') {
      const cached = this.cache[project.id]
      if (!cached) {
        throw new Error(`Data Instance not found for: ${project.id}`)
      }
      instance = cached
    } else {
      const user = this.session.dataOwners.find((agent) => agent.iri === project.owner);
      if (!user) {
        throw new Error(`user not found for ${project.owner}`)
      }
      const registration = user.selectRegistrations(shapeTrees.project).find(registration => registration.iri === project.registration)
      if (!registration) {
        throw new Error(`data registrationnot found for ${project.registration}`)
      }
      instance = await registration.newDataInstance()
      this.cache[instance.iri] = instance
    }

    instance.replaceValue(RDFS.label, project.label);

    await instance.update(instance.dataset)

    return instance2Project(instance, project.owner, project.registration)
  }

  async loadTasks(projectId: string): Promise<{projectId: string, tasks: Task[]}> {
    if (!this.session) {
      throw new NoSaiSessionError();
    }
    const project = this.cache[projectId]
    if (!project) {
      throw new Error(`Project not found for: ${projectId}`)
    }
    const tasks = [];
    for await (const dataInstance of project.getChildInstancesIterator(shapeTrees.task)) {
      this.cache[dataInstance.iri] = dataInstance
      tasks.push(instance2Task(dataInstance, projectId, this.ownerIndex[projectId]));
    }

    return {projectId, tasks}
  }

  async updateTask(task: Task) {
    if (!this.session) {
      throw new NoSaiSessionError();
    }
    let instance: DataInstance
    if (task.id !== 'DRAFT') {
      const cached = this.cache[task.id]
      if (!cached) {
        throw new Error(`Data Instance not found for: ${task.id}`)
      }
      instance = cached
    } else {
      const project = this.cache[task.project]
      if (!project) {
        throw new Error(`project not found ${task.project}`)
      }
      instance = await project.newChildDataInstance(shapeTrees.task)
      this.cache[instance.iri] = instance
    }

    instance.replaceValue(RDFS.label, task.label);

    await instance.update(instance.dataset)

    return instance2Task(instance, task.project, task.owner)
  }

  async deleteTask(task: Task): Promise<Task> {
    if (!this.session) {
      throw new NoSaiSessionError();
    }
    let instance: DataInstance

    instance = this.cache[task.id];
    await instance.delete();

    delete this.cache[task.id];

    return task;
  }

  async deleteProject(project: Project): Promise<Project> {
    if (!this.session) {
      throw new NoSaiSessionError();
    }
    let instance: DataInstance

    instance = this.cache[project.id];
    await instance.delete();

    delete this.cache[project.id];

    return project;
  }
}
