import { Injectable } from '@angular/core';
import { getDefaultSession } from '@inrupt/solid-client-authn-browser';
import { Application } from '@janeirodigital/interop-application';
import { DataInstance } from '@janeirodigital/interop-data-model';
import { RDFS } from '@janeirodigital/interop-namespaces';
import { environment } from 'src/environments/environment';
import { Project } from '../models/project.model';
import { Task } from '../models/task.model';
import { Agent } from '../models/agent.model';

function instance2Project(instance: DataInstance, owner: string): Project {
  return {
    id: instance.iri,
    label: instance.getObject(RDFS.label)!.value,
    owner
  }
}

function instance2Task(instance: DataInstance, project: string, owner: string): Task {
  return {
    id: instance.iri,
    label: instance.getObject(RDFS.label)!.value,
    project,
    owner
  }
}

const shapeTrees = {
  project: 'http://localhost:3000/shapetrees/trees/Project',
  task: 'http://localhost:3000/shapetrees/trees/Task'
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

  authorize(authorizationRedirectUri: string) {
    window.location.href = authorizationRedirectUri;
  }

  async getAgents(): Promise<Agent[]> {
    if (!this.session) {
      throw new Error('buildSession was not called');
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
        this.cache[dataInstance.iri] = dataInstance
        this.ownerIndex[dataInstance.iri] = ownerId
        projects.push(instance2Project(dataInstance, ownerId));
      }
    }

    return {ownerId, projects}
  }

  async updateProject(project: Project) {
    if (!this.session) {
      throw new Error('buildSession was not called');
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
        throw new Error(`data registration not found for ${project.owner}`)
      }
      const registration = user.selectRegistrations(shapeTrees.project)[0] // TODO handle multiple
      instance = await registration.newDataInstance()
      console.log(instance.iri, [...instance.dataset])
      console.log(this.cache)
      this.cache[instance.iri] = instance
    }

    instance.replaceValue(RDFS.label, project.label);

    await instance.update(instance.dataset)

    return instance2Project(instance, project.owner)
  }

  async loadTasks(projectId: string): Promise<{projectId: string, tasks: Task[]}> {
    if (!this.session) {
      throw new Error('buildSession was not called');
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
      throw new Error('buildSession was not called');
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
      console.log(project.iri, [...project.dataset])
      console.log(this.cache)
      instance = await project.newChildDataInstance(shapeTrees.task)
      this.cache[instance.iri] = instance
    }

    instance.replaceValue(RDFS.label, task.label);

    await instance.update(instance.dataset)

    return instance2Task(instance, task.project, task.owner)
  }
}
